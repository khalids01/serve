import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";

async function main() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  if (
    process.env.SERVE_AUTH_INTEGRATION_TEST !== "1" ||
    !["127.0.0.1", "localhost"].includes(url.hostname) ||
    !url.pathname.endsWith("_test")
  )
    throw new Error(
      "Use an isolated localhost database ending in _test and set SERVE_AUTH_INTEGRATION_TEST=1.",
    );
  process.env.NEXT_PUBLIC_APP_URL = "https://files.example";
  process.env.BETTER_AUTH_SECRET =
    "auth-integration-test-secret-at-least-32-characters";
  process.env.GITHUB_CLIENT_ID = "test-github-client";
  process.env.GITHUB_CLIENT_SECRET = "test-github-secret";
  process.env.EMAIL = "sender@example.test";
  process.env.EMAIL_PASSWORD = "smtp-test-only";
  process.env.ENABLE_SIGNUP = "false"; // Legacy environment configuration must have no effect.
  const mail: { to: string; text: string }[] = [];
  const nodemailer = (await import("nodemailer")).default;
  const originalTransport = nodemailer.createTransport;
  nodemailer.createTransport = (() => ({
    sendMail: async (message: { to: string; text: string }) => {
      mail.push(message);
      return { messageId: "test" };
    },
  })) as unknown as typeof originalTransport;
  const { prisma } = await import("../src/lib/prisma");
  const { bootstrapAdmin } = await import("./bootstrap-admin.mjs");
  try {
    const suffix = randomUUID();
    const adminEmail = `admin-${suffix}@example.test`;
    await assert.rejects(
      () => bootstrapAdmin(prisma, adminEmail),
      /Sign up with that email first/,
    );
    assert.equal(
      await prisma.user.findUnique({ where: { email: adminEmail } }),
      null,
    );
    const missingCli = spawnSync(
      process.execPath,
      ["scripts/bootstrap-admin.mjs"],
      {
        env: { ...process.env, ADMIN_EMAIL: adminEmail },
        encoding: "utf8",
      },
    );
    assert.equal(missingCli.status, 1);
    assert.match(missingCli.stderr, /Sign up with that email first/);

    const { auth } = await import("../src/lib/auth");
    const { getSignupEnabled } = await import("../src/lib/auth-settings");
    assert.equal(
      await getSignupEnabled(),
      true,
      "Fresh installations allow signup regardless of legacy ENABLE_SIGNUP",
    );
    const context = await auth.$context;
    const registered = await context.internalAdapter.createOAuthUser(
      { email: adminEmail, name: "First registered user", emailVerified: true },
      { providerId: "github", accountId: `admin-${suffix}` },
    );
    assert.equal(
      (
        await prisma.user.findUniqueOrThrow({
          where: { id: registered.user.id },
        })
      ).role,
      "user",
    );
    const admin = await bootstrapAdmin(
      prisma,
      `  ${adminEmail.toUpperCase()}  `,
    );
    assert.equal(admin.id, registered.user.id);
    assert.equal(admin.role, "admin");
    assert.equal((await bootstrapAdmin(prisma, adminEmail)).id, admin.id);
    assert.equal(
      (await prisma.user.findUniqueOrThrow({ where: { id: admin.id } }))
        .emailVerified,
      true,
    );
    assert.equal(
      await prisma.account.count({ where: { userId: admin.id } }),
      1,
    );
    const existing = await prisma.user.create({
      data: {
        email: `PROMOTE-${suffix}@EXAMPLE.TEST`,
        name: "Keep this name",
        role: "user",
        emailVerified: false,
      },
    });
    assert.equal(
      (await bootstrapAdmin(prisma, existing.email)).id,
      existing.id,
    );
    assert.equal(
      (await prisma.user.findUniqueOrThrow({ where: { id: existing.id } }))
        .name,
      "Keep this name",
    );
    const preserved = await prisma.user.findUniqueOrThrow({
      where: { id: existing.id },
    });
    assert.equal(preserved.email, existing.email);
    assert.equal(preserved.emailVerified, false);
    await assert.rejects(
      () => bootstrapAdmin(prisma, "invalid"),
      /ADMIN_EMAIL/,
    );
    const cli = spawnSync(process.execPath, ["scripts/bootstrap-admin.mjs"], {
      env: { ...process.env, ADMIN_EMAIL: adminEmail },
      encoding: "utf8",
    });
    assert.equal(cli.status, 0, cli.stderr);
    assert.match(cli.stdout, /Admin account ready/);

    await prisma.authSettings.create({
      data: { id: "default", signupEnabled: false },
    });
    assert.equal(await getSignupEnabled(), false);
    const headers = new Headers({ origin: "https://files.example" });
    const requestCode = async (email: string) => {
      const response = await auth.api.sendVerificationOTP({
        body: { email, type: "sign-in" },
        headers,
        asResponse: true,
      });
      assert.equal(response.status, 200, await response.clone().text());
    };
    const signIn = async (email: string) => {
      await requestCode(email);
      const message = mail.filter((message) => message.to === email).at(-1);
      assert(message, `Expected an email for ${email}`);
      const otp = /code is (\d{6})/.exec(message.text)?.[1];
      assert(otp);
      return auth.api.signInEmailOTP({
        body: { email, otp },
        headers,
        asResponse: true,
      });
    };
    const adminSignIn = await signIn(adminEmail);
    assert.equal(adminSignIn.status, 200, await adminSignIn.clone().text());
    const cookie = adminSignIn.headers
      .getSetCookie()
      .map((value) => value.split(";")[0])
      .join("; ");
    assert(cookie);
    const unknown = `blocked-${suffix}@example.test`;
    await requestCode(unknown);
    assert(
      !mail.some((message) => message.to === unknown),
      "Disabled signup must not email unregistered users",
    );
    await assert.rejects(
      () =>
        context.internalAdapter.createOAuthUser(
          {
            email: `oauth-blocked-${suffix}@example.test`,
            name: "Blocked",
            emailVerified: true,
          },
          { providerId: "github", accountId: `blocked-${suffix}` },
        ),
      /New signups are disabled/,
    );

    const { NextRequest } = await import("next/server");
    const { GET, PATCH } = await import(
      "../src/app/api/admin/auth-settings/route"
    );
    const settingsRequest = (
      signupEnabled: boolean,
      customHeaders: Record<string, string> = {},
    ) =>
      new NextRequest("https://files.example/api/admin/auth-settings", {
        method: "PATCH",
        headers: {
          origin: "https://files.example",
          "content-type": "application/json",
          cookie,
          ...customHeaders,
        },
        body: JSON.stringify({ signupEnabled }),
      });
    assert.equal(
      (
        await GET(
          new NextRequest("https://files.example/api/admin/auth-settings"),
        )
      ).status,
      401,
    );
    assert.equal(
      (await PATCH(settingsRequest(true, { origin: "https://evil.example" })))
        .status,
      403,
    );
    assert.equal((await PATCH(settingsRequest(true))).status, 200);
    assert.equal(await getSignupEnabled(), true);
    const enabled = `enabled-${suffix}@example.test`;
    const newSignIn = await signIn(enabled);
    assert.equal(newSignIn.status, 200, await newSignIn.clone().text());
    const normal = await prisma.user.findUniqueOrThrow({
      where: { email: enabled },
    });
    assert.equal(normal.role, "user");
    const normalCookie = newSignIn.headers
      .getSetCookie()
      .map((value) => value.split(";")[0])
      .join("; ");
    assert.equal(
      (await PATCH(settingsRequest(false, { cookie: normalCookie }))).status,
      403,
    );
    assert.equal(
      (
        await GET(
          new NextRequest("https://files.example/api/admin/auth-settings", {
            headers: { cookie: normalCookie },
          }),
        )
      ).status,
      403,
    );
    const pending = `pending-${suffix}@example.test`;
    await requestCode(pending);
    const pendingOtp = /code is (\d{6})/.exec(
      mail.filter((message) => message.to === pending).at(-1)?.text ?? "",
    )?.[1];
    assert(pendingOtp);
    const oauth = await context.internalAdapter.createOAuthUser(
      {
        email: `oauth-enabled-${suffix}@example.test`,
        name: "GitHub user",
        emailVerified: true,
      },
      { providerId: "github", accountId: `enabled-${suffix}` },
    );
    assert.equal(
      (await prisma.user.findUniqueOrThrow({ where: { id: oauth.user.id } }))
        .role,
      "user",
    );
    assert.equal((await PATCH(settingsRequest(false))).status, 200);
    assert.equal(await getSignupEnabled(), false);
    const pendingSignIn = await auth.api.signInEmailOTP({
      body: { email: pending, otp: pendingOtp },
      headers,
      asResponse: true,
    });
    assert.equal(pendingSignIn.status, 403);
    assert.equal(
      await prisma.user.findUnique({ where: { email: pending } }),
      null,
    );
    assert.equal(
      (await signIn(enabled)).status,
      200,
      "Existing users can sign in after signup is disabled",
    );
    const { protectAdmin } = await import("../src/features/auth/guard");
    const denied = await protectAdmin(
      new NextRequest("https://files.example/api/admin/storage-settings", {
        headers: { cookie: normalCookie },
      }),
    );
    assert(denied instanceof Response);
    assert.equal(denied.status, 403);
    const { ApiKeyService } = await import("../src/lib/api-keys");
    const application = await prisma.application.create({
      data: {
        name: "Admin-owned application",
        slug: `auth-${suffix}`,
        ownerId: admin.id,
        storageDir: `auth-${suffix}`,
      },
    });
    const key = await ApiKeyService.createApiKey(
      application.id,
      admin.id,
      "Application scope only",
    );
    const applicationKey = await protectAdmin(
      new NextRequest("https://files.example/api/admin/storage-settings", {
        headers: { "x-api-key": key.key },
      }),
    );
    assert(applicationKey instanceof Response);
    assert.equal(applicationKey.status, 401);
    if (process.env.AUTH_TEST_STATE_FILE)
      await writeFile(
        process.env.AUTH_TEST_STATE_FILE,
        JSON.stringify({ cookie, normalCookie, adminEmail }),
        { mode: 0o600 },
      );
    console.log(
      "Auth integration passed: regular signup, existing-account promotion/idempotency, missing-account refusal, OTP and OAuth signup policy, persisted settings, issued-code recheck, role checks, and existing-user sign-in.",
    );
  } finally {
    nodemailer.createTransport = originalTransport;
    await prisma.$disconnect();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
