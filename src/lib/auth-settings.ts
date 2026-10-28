import { APIError } from "better-auth/api";
import { prisma } from "./prisma";

export async function getSignupEnabled(): Promise<boolean> {
  const settings = await prisma.authSettings.findUnique({
    where: { id: "default" },
    select: { signupEnabled: true },
  });
  return settings?.signupEnabled ?? true;
}

// Both OTP and OAuth user creation pass through this hook, including codes issued before a policy change.
export async function enforceSignupPolicy() {
  if (!(await getSignupEnabled())) {
    throw new APIError("FORBIDDEN", {
      code: "SIGNUP_DISABLED",
      message:
        "New signups are disabled. Contact your administrator for access.",
    });
  }
}
