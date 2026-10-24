import { rmSync } from "node:fs";

for (const name of ["contracts", "server", "react"])
  rmSync(new URL(`../packages/${name}/dist`, import.meta.url), {
    recursive: true,
    force: true,
  });
rmSync(new URL("../artifacts", import.meta.url), {
  recursive: true,
  force: true,
});
