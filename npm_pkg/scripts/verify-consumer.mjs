import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifacts = join(root, "artifacts");
mkdirSync(artifacts, { recursive: true });
function run(command, args, cwd) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}
const tarballs = [];
for (const name of ["server", "react"]) {
  const manifest = JSON.parse(
    readFileSync(join(root, "packages", name, "package.json"), "utf8"),
  );
  assert.equal(manifest.publishConfig.access, "public");
  const output = JSON.parse(
    run(
      "npm",
      ["pack", "--json", "--ignore-scripts", "--pack-destination", artifacts],
      join(root, "packages", name),
    ),
  )[0];
  assert(output.files.some((file) => file.path === "dist/index.js"));
  for (const file of output.files)
    assert(
      /^(dist\/|package.json$|README.md$|LICENSE$|CHANGELOG.md$)/.test(
        file.path,
      ),
      `Unexpected packed file ${file.path}`,
    );
  tarballs.push(join(artifacts, output.filename));
  console.log(
    `${manifest.name}: ${output.size} bytes packed, ${output.files.length} files`,
  );
}
const consumer = mkdtempSync(join(tmpdir(), "serve-consumer-"));
try {
  writeFileSync(
    join(consumer, "package.json"),
    JSON.stringify({ private: true, type: "module" }),
  );
  run(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      ...tarballs,
      "react@18.2.0",
      "react-dom@18.2.0",
      "@types/react@18",
      "@types/react-dom@18",
      "@types/node@20",
      "typescript@6.0.3",
    ],
    consumer,
  );
  for (const name of ["server", "react"]) {
    const dist = join(consumer, "node_modules", "@file-server", name, "dist");
    const walk = (dir) =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
          ? walk(join(dir, entry.name))
          : [join(dir, entry.name)],
      );
    for (const file of walk(dist)) {
      const source = readFileSync(file, "utf8");
      assert(
        !/@file-server\/contracts|from ["']@\/|prisma|\/home\/khalid/.test(
          source,
        ),
        `Leaked internal dependency/path in ${file}`,
      );
    }
  }
  writeFileSync(
    join(consumer, "consumer.mts"),
    `import { createFileServer, type FileAsset } from '@file-server/server';
import { createBrowserTokenHandler } from '@file-server/server/adapters/fetch';
import '@file-server/react/styles.css';
import { AdvancedImage, FileUploader, MediaLibrary, FileServerProvider, useUpload, useFiles, useDeleteFile, UploadQueue } from '@file-server/react';
const client = createFileServer({baseUrl:'https://files.example',apiKey:'sk_test'});
createBrowserTokenHandler({client, authorize:async()=>true,scopes:['files:read'],allowedOrigins:['https://consumer.example']});
void [AdvancedImage,FileUploader,MediaLibrary,FileServerProvider,useUpload,useFiles,useDeleteFile,UploadQueue];
const asset: FileAsset | undefined = undefined; void asset;`,
  );
  writeFileSync(
    join(consumer, "consumer.cts"),
    `import server = require('@file-server/server'); import ui = require('@file-server/react'); void server.createFileServer; void ui.AdvancedImage;`,
  );
  const tsconfig = {
    compilerOptions: {
      target: "ES2022",
      module: "NodeNext",
      moduleResolution: "NodeNext",
      strict: true,
      noEmit: true,
      skipLibCheck: false,
    },
    include: ["consumer.mts", "consumer.cts"],
  };
  writeFileSync(join(consumer, "tsconfig.json"), JSON.stringify(tsconfig));
  const smoke = `import assert from 'node:assert/strict';
import {createRequire} from 'node:module'; import {createFileServer} from '@file-server/server';
import * as ui from '@file-server/react'; import React from 'react'; import {renderToString} from 'react-dom/server';
const require = createRequire(import.meta.url); assert.equal(typeof require('@file-server/server').createFileServer,'function'); assert.equal(typeof require('@file-server/react').MediaLibrary,'function');
const client=createFileServer({baseUrl:'https://files.example',apiKey:'sk_test',fetch:async()=>Response.json({data:[],pagination:{page:1,limit:20,total:0,pages:0,hasNext:false,hasPrev:false}})}); assert.deepEqual((await client.files.list()).data,[]);
const markup=renderToString(React.createElement(ui.FileServerProvider,{baseUrl:'https://files.example',tokenProvider:async()=>{throw new Error('SSR requested token')}},React.createElement(ui.MediaLibrary)));assert(markup.includes('Media library'));
assert(require.resolve('@file-server/react/styles.css').endsWith('styles.css'));`;
  writeFileSync(join(consumer, "smoke.mjs"), smoke);
  for (const version of [18, 19]) {
    if (version === 19)
      run(
        "npm",
        [
          "install",
          "--ignore-scripts",
          "--no-audit",
          "--no-fund",
          "react@19",
          "react-dom@19",
          "@types/react@19",
          "@types/react-dom@19",
        ],
        consumer,
      );
    run(
      "node",
      [
        join(consumer, "node_modules/typescript/bin/tsc"),
        "-p",
        "tsconfig.json",
      ],
      consumer,
    );
    run("node", ["smoke.mjs"], consumer);
    run(
      "npm",
      ["exec", "--yes", "--package=node@20", "--", "node", "smoke.mjs"],
      consumer,
    );
    run("bun", ["smoke.mjs"], consumer);
    console.log(
      `React ${version}: strict NodeNext ESM/CJS types, Node 20/current Node/Bun imports and SSR passed`,
    );
  }
  console.log(`Release tarballs: ${artifacts}`);
} catch (error) {
  console.error(error.stdout?.toString() || "");
  console.error(error.stderr?.toString() || "");
  throw error;
} finally {
  rmSync(consumer, { recursive: true, force: true });
}
