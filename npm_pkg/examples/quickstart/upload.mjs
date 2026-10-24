import { createFileServer } from "@skycanvasstudio/serve-server";

const files = createFileServer({
  baseUrl: process.env.FILE_SERVER_URL,
  apiKey: process.env.FILE_SERVER_API_KEY,
});

const asset = await files.files.upload({
  file: new Blob(["Hello from Serve"], { type: "text/plain" }),
  filename: "hello.txt",
});

console.log("File URL:", asset.urls.content);
