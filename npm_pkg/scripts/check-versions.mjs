import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packages = ["server", "client", "react"].map((name) =>
  JSON.parse(
    readFileSync(
      new URL(`../packages/${name}/package.json`, import.meta.url),
      "utf8",
    ),
  ),
);
const version = packages[0].version;
for (const pkg of packages) {
  assert.equal(
    pkg.version,
    version,
    `${pkg.name} must match the shared release version ${version}`,
  );
  for (const sibling of packages) {
    const dependency = pkg.dependencies?.[sibling.name];
    if (dependency !== undefined)
      assert.equal(
        dependency,
        version,
        `${pkg.name} must depend on ${sibling.name}@${version}`,
      );
  }
}
console.log(`All published Serve packages use ${version}.`);
