import { lookup } from "node:dns/promises";
import type { LookupFunction } from "node:net";
import { isIP } from "node:net";

// Private endpoints are opt-in operator configuration, never a browser-supplied switch.
function privateHostAllowed(host: string) {
  return (process.env.STORAGE_ALLOWED_PRIVATE_HOSTS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .includes(host.toLowerCase());
}
export function isPublicAddress(address: string) {
  if (isIP(address) === 4) {
    const [a, b] = address.split(".").map(Number);
    return !(
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && (b === 168 || b === 0)) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  if (isIP(address) === 6) {
    const value = address.toLowerCase();
    if (value.startsWith("::ffff:")) return false;
    return /^[23]/.test(value) && !value.startsWith("2001:db8:");
  }
  return false;
}
export function validateEndpoint(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Enter an absolute S3 endpoint URL.");
  }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  )
    throw new Error(
      "S3 endpoint must be an origin without credentials, path, query or fragment.",
    );
  if (
    url.protocol !== "https:" &&
    !(url.protocol === "http:" && privateHostAllowed(host))
  )
    throw new Error(
      "Use HTTPS for S3 endpoints. Operators may explicitly allow a private MinIO hostname.",
    );
  if (isIP(host) && !isPublicAddress(host) && !privateHostAllowed(host))
    throw new Error(
      "Private S3 endpoints must be explicitly allowed by the server operator.",
    );
  return url.origin;
}
export async function assertEndpointAddresses(host: string) {
  const addresses = await lookup(host, { all: true });
  if (
    !addresses.length ||
    (!privateHostAllowed(host) &&
      addresses.some((result) => !isPublicAddress(result.address)))
  )
    throw new Error("S3 endpoint resolves to a restricted network address.");
  return addresses;
}
// Validate the addresses used by each socket, not just a one-time DNS preflight.
export const safeStorageLookup: LookupFunction = (
  hostname,
  options,
  callback,
) => {
  assertEndpointAddresses(hostname)
    .then((addresses) => {
      const family = typeof options === "number" ? options : options.family;
      const matching = family
        ? addresses.filter((value) => value.family === family)
        : addresses;
      if (!matching.length)
        throw new Error(
          "S3 endpoint has no permitted address for this address family.",
        );
      if (typeof options === "object" && options.all) callback(null, matching);
      else callback(null, matching[0].address, matching[0].family);
    })
    .catch(() =>
      callback(
        new Error("S3 endpoint network address is not permitted."),
        "",
        0,
      ),
    );
};
