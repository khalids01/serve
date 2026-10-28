import type { BrowserToken, TokenProvider } from "./client";

export function createTokenProvider(
  endpoint: string,
  fetchImpl: typeof fetch = globalThis.fetch,
): TokenProvider {
  return async () => {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
    });
    if (!response.ok)
      throw new Error("Unable to obtain a File Server browser token.");
    const payload = (await response.json()) as { data?: BrowserToken };
    if (
      !payload.data?.token ||
      !Number.isFinite(Date.parse(payload.data.expiresAt))
    )
      throw new Error("Token endpoint returned an invalid response.");
    return payload.data;
  };
}
export function createTokenCache(tokenProvider: TokenProvider) {
  let cached: BrowserToken | null = null;
  let pending: Promise<BrowserToken> | null = null;
  return async (forceRefresh = false) => {
    if (forceRefresh) cached = null;
    if (cached && Date.now() < Date.parse(cached.expiresAt) - 30_000)
      return cached.token;
    if (!pending) {
      pending = tokenProvider()
        .then((value) => {
          if (
            !value.token ||
            !Number.isFinite(Date.parse(value.expiresAt)) ||
            Date.parse(value.expiresAt) <= Date.now()
          )
            throw new Error(
              "Token provider returned an expired or invalid token.",
            );
          cached = value;
          return value;
        })
        .finally(() => {
          pending = null;
        });
    }
    return (await pending).token;
  };
}
