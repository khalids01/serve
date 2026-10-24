import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

function httpsUrl(value, label, originOnly = false) {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      (originOnly && url.pathname !== "/")
    )
      throw new Error();
    return url;
  } catch {
    throw new Error(
      `${label} must be a valid HTTPS ${originOnly ? "origin" : "URL"}, without credentials, query or fragment.`,
    );
  }
}
export function deploymentRequest(env, event = {}) {
  const {
    DOKPLOY_WEBHOOK_URL: webhook,
    DOKPLOY_URL: base,
    DOKPLOY_COMPOSE_ID: composeId,
    DOKPLOY_API_KEY: key,
  } = env;
  if (webhook && (base || composeId || key))
    throw new Error(
      "Choose DOKPLOY_WEBHOOK_URL or the three Dokploy API settings, not both.",
    );
  if (env.GITHUB_REF !== "refs/heads/main")
    throw new Error("Only main can trigger this production deployment.");
  if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/.test(env.GITHUB_SHA ?? ""))
    throw new Error("GITHUB_SHA must be the full published commit hash.");
  if (!/^[\w.-]+\/[\w.-]+$/.test(env.GITHUB_REPOSITORY ?? ""))
    throw new Error("Set GITHUB_REPOSITORY to owner/repo.");
  if (webhook) {
    const url = httpsUrl(webhook, "DOKPLOY_WEBHOOK_URL");
    if (!/^\/api\/deploy\/compose\/[^/]+$/.test(url.pathname))
      throw new Error(
        "Use the Compose webhook URL ending /api/deploy/compose/<token>.",
      );
    const paths = (values) =>
      Array.isArray(values)
        ? values.filter((value) => typeof value === "string")
        : [];
    const commits = Array.isArray(event.commits)
      ? event.commits.map((commit) => ({
          id: commit.id,
          added: paths(commit.added),
          modified: paths(commit.modified),
          removed: paths(commit.removed),
        }))
      : [{ id: env.GITHUB_SHA, added: [], modified: [], removed: [] }];
    const body = {
      ref: env.GITHUB_REF,
      after: env.GITHUB_SHA,
      repository: { full_name: env.GITHUB_REPOSITORY },
      head_commit: {
        id: env.GITHUB_SHA,
        message: `Deploy Serve ${env.GITHUB_SHA}`,
      },
      commits,
    };
    return {
      mode: "webhook",
      url,
      headers: { "Content-Type": "application/json", "X-GitHub-Event": "push" },
      body,
    };
  }
  if (!base || !composeId || !key)
    throw new Error(
      "Set DOKPLOY_WEBHOOK_URL, or DOKPLOY_URL + DOKPLOY_COMPOSE_ID + DOKPLOY_API_KEY.",
    );
  const origin = httpsUrl(base, "DOKPLOY_URL", true);
  return {
    mode: "API",
    url: new URL("/api/compose.deploy", origin),
    headers: { "Content-Type": "application/json", "x-api-key": key },
    body: { composeId },
  };
}
export async function triggerDeployment(env, event = {}, fetchImpl = fetch) {
  const request = deploymentRequest(env, event);
  let response;
  try {
    response = await fetchImpl(request.url, {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify(request.body),
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    // Errors from fetch may include the webhook token; never log their cause/URL.
    throw new Error(
      "Dokploy deployment request failed or timed out. Check the private endpoint and server connectivity; verify deployment logs before retrying.",
    );
  }
  if (!response.ok)
    throw new Error(
      `Dokploy rejected deployment: HTTP ${response.status}. Check service configuration and permissions.`,
    );
  if (response.status !== 204) {
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(
        "Dokploy returned a non-JSON response; deployment was not confirmed.",
      );
    }
    if (
      typeof data?.message === "string" &&
      /not match|disabled|not found|error/i.test(data.message)
    )
      throw new Error(
        "Dokploy did not accept deployment. Check branch, watch paths and Auto Deploy settings.",
      );
  }
  return { mode: request.mode, accepted: true };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    const event = process.env.GITHUB_EVENT_PATH
      ? JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"))
      : {};
    if (process.argv.includes("--check")) {
      const request = deploymentRequest(process.env, event);
      console.log(
        `Dokploy ${request.mode} configuration validated. No deployment triggered.`,
      );
    } else {
      const result = await triggerDeployment(process.env, event);
      console.log(
        `Dokploy accepted the ${result.mode} deployment request. Check migration and container health in Dokploy.`,
      );
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
