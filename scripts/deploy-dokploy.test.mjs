import assert from "node:assert/strict";
import { test } from "node:test";
import { deploymentRequest, triggerDeployment } from "./deploy-dokploy.mjs";

const common = {
  GITHUB_REF: "refs/heads/main",
  GITHUB_SHA: "a".repeat(40),
  GITHUB_REPOSITORY: "khalids01/serve",
};
const webhook = {
  ...common,
  DOKPLOY_WEBHOOK_URL:
    "https://dokploy.example/api/deploy/compose/private-token",
};
const api = {
  ...common,
  DOKPLOY_URL: "https://dokploy.example",
  DOKPLOY_COMPOSE_ID: "compose-id",
  DOKPLOY_API_KEY: "private-key",
};
test("raw webhook sends the provider event, branch/hash and normalized paths", async () => {
  let calls = 0;
  const result = await triggerDeployment(
    webhook,
    { commits: [{ added: ["Dockerfile"] }] },
    async (url, init) => {
      calls++;
      assert.equal(url.pathname, "/api/deploy/compose/private-token");
      assert.equal(init.headers["X-GitHub-Event"], "push");
      assert.equal(init.redirect, "error");
      const body = JSON.parse(init.body);
      assert.equal(body.ref, common.GITHUB_REF);
      assert.equal(body.after, common.GITHUB_SHA);
      assert.equal(body.repository.full_name, "khalids01/serve");
      assert.deepEqual(body.commits[0].modified, []);
      return Response.json({ message: "Compose deployed successfully" });
    },
  );
  assert.equal(result.accepted, true);
  assert.equal(calls, 1);
});
test("API mode uses the Compose ID and private header", async () => {
  await triggerDeployment(api, {}, async (url, init) => {
    assert.equal(url.pathname, "/api/compose.deploy");
    assert.equal(init.headers["x-api-key"], "private-key");
    assert.deepEqual(JSON.parse(init.body), { composeId: "compose-id" });
    return Response.json({ success: true });
  });
});
test("rejects missing/partial settings and competing modes", () => {
  for (const env of [
    common,
    { ...common, DOKPLOY_URL: api.DOKPLOY_URL },
    { ...webhook, ...api },
  ])
    assert.throws(() => deploymentRequest(env));
});
test("rejects non-production branches, bad hashes and unsafe URLs", () => {
  for (const env of [
    { ...api, GITHUB_REF: "refs/heads/feature" },
    { ...api, GITHUB_SHA: "short" },
    { ...api, DOKPLOY_URL: "http://dokploy.example" },
    { ...api, DOKPLOY_URL: "https://user:password@dokploy.example" },
    { ...api, DOKPLOY_URL: "https://dokploy.example/path" },
    {
      ...webhook,
      DOKPLOY_WEBHOOK_URL: "https://dokploy.example/api/deploy/wrong-kind",
    },
  ])
    assert.throws(() => deploymentRequest(env));
});
test("rejects branch/watch-path refusals and unexpected HTML", async () => {
  await assert.rejects(
    triggerDeployment(webhook, {}, async () =>
      Response.json({ message: "Branch Not Match" }),
    ),
  );
  await assert.rejects(
    triggerDeployment(webhook, {}, async () => new Response("login HTML")),
  );
  await assert.rejects(
    triggerDeployment(
      webhook,
      {},
      async () => new Response(null, { status: 403 }),
    ),
  );
});
test("does not retry an ambiguous failure or leak its private URL", async () => {
  let calls = 0;
  await assert.rejects(
    triggerDeployment(webhook, {}, async () => {
      calls++;
      throw new Error(webhook.DOKPLOY_WEBHOOK_URL);
    }),
    (error) => !error.message.includes("private-token"),
  );
  assert.equal(calls, 1);
});
