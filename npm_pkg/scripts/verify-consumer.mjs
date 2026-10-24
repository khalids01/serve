import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  cpSync,
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
function run(command, args, cwd, extraEnv = {}) {
  return execFileSync(command, args, {
    cwd,
    env: { ...process.env, ...extraEnv },
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
      "server-only@0.0.1",
    ],
    consumer,
  );
  for (const name of ["server", "react"]) {
    const dist = join(
      consumer,
      "node_modules",
      "@skycanvasstudio",
      `serve-${name}`,
      "dist",
    );
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
    `import { createFileServer, type FileAsset } from '@skycanvasstudio/serve-server';
import { createBrowserTokenHandler } from '@skycanvasstudio/serve-server/adapters/fetch';
import '@skycanvasstudio/serve-react/styles.css';
import { AdvancedImage, FileUploader, MediaLibrary, FileServerProvider, useUpload, useFiles, useDeleteFile, UploadQueue } from '@skycanvasstudio/serve-react';
const client = createFileServer({baseUrl:'https://files.example',apiKey:'sk_test'});
createBrowserTokenHandler({client, authorize:async()=>true,scopes:['files:read'],allowedOrigins:['https://consumer.example']});
void [AdvancedImage,FileUploader,MediaLibrary,FileServerProvider,useUpload,useFiles,useDeleteFile,UploadQueue];
const asset: FileAsset | undefined = undefined; void asset;`,
  );
  writeFileSync(
    join(consumer, "consumer.cts"),
    `import server = require('@skycanvasstudio/serve-server'); import ui = require('@skycanvasstudio/serve-react'); void server.createFileServer; void ui.AdvancedImage;`,
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
  cpSync(
    join(root, "examples/quickstart/lib"),
    join(consumer, "next-docs/lib"),
    { recursive: true },
  );
  cpSync(
    join(root, "examples/quickstart/app"),
    join(consumer, "next-docs/app"),
    { recursive: true },
  );
  writeFileSync(
    join(consumer, "tsconfig.docs.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        jsx: "react-jsx",
        types: ["node", "react"],
        strict: true,
        noEmit: true,
        paths: { "@/*": ["./next-docs/*"] },
      },
      include: ["next-docs/**/*.ts", "next-docs/**/*.tsx"],
    }),
  );
  for (const filename of ["upload.mjs", "check-serve.mjs"])
    cpSync(
      join(root, "examples/quickstart", filename),
      join(consumer, filename),
    );
  writeFileSync(
    join(consumer, "docs-fetch.mjs"),
    `import assert from 'node:assert/strict';
const base = process.env.FILE_SERVER_URL;
const asset = {id:'docs-asset',filename:'hello.txt',originalName:'hello.txt',contentType:'text/plain',kind:'document',sizeBytes:16,width:null,height:null,tags:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),urls:{content:base+'/api/v1/files/docs-asset/content',image:null,placeholder:null},variants:[]};
globalThis.fetch = async (input, init = {}) => {
  const url = new URL(String(input)); assert.equal(url.origin,base);
  if (url.pathname === '/api/v1/capabilities') return Response.json({data:{apiVersion:'v1',publicBaseUrl:base,browserTokens:{enabled:true}}});
  assert.equal(new Headers(init.headers).get('authorization'),'Bearer sk_documented_test');
  if (url.pathname === '/api/v1/browser-tokens') { assert.deepEqual(JSON.parse(init.body).allowedOrigins,['https://consumer.example']); return Response.json({data:{token:'browser-token',expiresAt:new Date(Date.now()+300000).toISOString()}}); }
  assert.equal(url.pathname,'/api/v1/files');
  if (init.method === 'POST') { const file=init.body.get('file'); assert.equal(file.name,'hello.txt'); assert.equal(await file.text(),'Hello from Serve'); return Response.json({data:asset},{status:201}); }
  return Response.json({data:[asset],pagination:{page:1,limit:1,total:1,pages:1,hasNext:false,hasPrev:false}});
};`,
  );
  writeFileSync(
    join(consumer, "compile-docs.cjs"),
    `const fs = require('node:fs'); const ts = require('typescript');
for (const [source, target] of [['next-docs/lib/file-server.ts','docs-server-client.mjs'],['next-docs/app/api/file-server/token/route.ts','docs-token-route.mjs']]) {
  const code = fs.readFileSync(source,'utf8').replaceAll('"@/lib/auth"','"./docs-auth.mjs"').replaceAll('"@/lib/file-server"','"./docs-server-client.mjs"');
  fs.writeFileSync(target,ts.transpileModule(code,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText);
}`,
  );
  writeFileSync(
    join(consumer, "docs-auth.mjs"),
    `export const auth={api:{getSession:async({headers})=>headers.get('cookie')==='session=valid'?{user:{id:'test-user'}}:null}};`,
  );
  writeFileSync(
    join(consumer, "docs-route-smoke.mjs"),
    `import assert from 'node:assert/strict'; import {POST} from './docs-token-route.mjs';
const make=(origin,cookie)=>new Request('https://0.0.0.0:3000/api/file-server/token',{method:'POST',headers:{host:'consumer.example',origin,cookie}});
const response=await POST(make('https://consumer.example','session=valid')); assert.equal(response.status,200); assert.equal((await response.json()).data.token,'browser-token'); assert.equal(response.headers.get('cache-control'),'no-store');
assert.equal((await POST(make('https://consumer.example',''))).status,401);
assert.equal((await POST(make('https://attacker.example','session=valid'))).status,403);`,
  );
  const docsEnv = {
    FILE_SERVER_URL: "https://files.example",
    FILE_SERVER_API_KEY: "sk_documented_test",
  };
  const smoke = `import assert from 'node:assert/strict';
import {createRequire} from 'node:module'; import {createFileServer} from '@skycanvasstudio/serve-server';
import * as ui from '@skycanvasstudio/serve-react'; import React from 'react'; import {renderToString} from 'react-dom/server';
const require = createRequire(import.meta.url); assert.equal(typeof require('@skycanvasstudio/serve-server').createFileServer,'function'); assert.equal(typeof require('@skycanvasstudio/serve-react').MediaLibrary,'function');
const client=createFileServer({baseUrl:'https://files.example',apiKey:'sk_test',fetch:async()=>Response.json({data:[],pagination:{page:1,limit:20,total:0,pages:0,hasNext:false,hasPrev:false}})}); assert.deepEqual((await client.files.list()).data,[]);
const markup=renderToString(React.createElement(ui.FileServerProvider,{baseUrl:'https://files.example',tokenProvider:async()=>{throw new Error('SSR requested token')}},React.createElement(ui.MediaLibrary)));assert(markup.includes('Media library'));
assert(require.resolve('@skycanvasstudio/serve-react/styles.css').endsWith('styles.css'));`;
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
    run(
      "node",
      [
        join(consumer, "node_modules/typescript/bin/tsc"),
        "-p",
        "tsconfig.docs.json",
      ],
      consumer,
    );
    const uploadOutput = run(
      "node",
      ["--import", "./docs-fetch.mjs", "upload.mjs"],
      consumer,
      docsEnv,
    );
    assert(
      uploadOutput.includes(
        "https://files.example/api/v1/files/docs-asset/content",
      ),
    );
    assert(
      run(
        "node",
        ["--import", "./docs-fetch.mjs", "check-serve.mjs"],
        consumer,
        docsEnv,
      ).includes("Server SDK: connected"),
    );
    run("node", ["compile-docs.cjs"], consumer);
    run(
      "node",
      [
        "--conditions=react-server",
        "--import",
        "./docs-fetch.mjs",
        "docs-route-smoke.mjs",
      ],
      consumer,
      docsEnv,
    );
    run("node", ["smoke.mjs"], consumer);
    run(
      "npm",
      ["exec", "--yes", "--package=node@20", "--", "node", "smoke.mjs"],
      consumer,
    );
    run("bun", ["smoke.mjs"], consumer);
    console.log(
      `React ${version}: strict ESM/CJS types, exact docs scripts/Next snippets, Node 20/current Node/Bun imports and SSR passed`,
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
