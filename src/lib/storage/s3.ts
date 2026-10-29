import { Agent as HttpAgent } from "node:http";
import { Agent as HttpsAgent } from "node:https";
import { Readable } from "node:stream";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { config } from "@/config";
import type {
  SignedReadOptions,
  StorageBackend,
  StorageByteRange,
  StorageObjectInfo,
  StorageReadStream,
} from "./backend";
import { BROWSE_PAGE_SIZE, type BrowsePage } from "./browse";
import { safeStorageLookup } from "./endpoint";

function streamToBuffer(body: unknown): Promise<Buffer> {
  if (!body) return Promise.resolve(Buffer.alloc(0));
  if (Buffer.isBuffer(body)) return Promise.resolve(body);
  if (body instanceof Uint8Array) return Promise.resolve(Buffer.from(body));

  const stream = body as AsyncIterable<Uint8Array>;
  return (async () => {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  })();
}

function streamToWeb(body: unknown): ReadableStream<Uint8Array> {
  if (
    body &&
    typeof body === "object" &&
    "transformToWebStream" in body &&
    typeof body.transformToWebStream === "function"
  ) {
    return body.transformToWebStream() as ReadableStream<Uint8Array>;
  }

  const iterator = (body as AsyncIterable<Uint8Array>)[Symbol.asyncIterator]();
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const next = await iterator.next();
        if (next.done) {
          controller.close();
          return;
        }
        controller.enqueue(
          next.value instanceof Uint8Array
            ? next.value
            : new Uint8Array(next.value),
        );
      } catch (error) {
        controller.error(error);
      }
    },
    async cancel() {
      await iterator.return?.();
    },
  });
}

function isMissingObject(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  if (
    "name" in error &&
    ["NoSuchKey", "NotFound"].includes(
      String((error as { name?: string }).name),
    )
  ) {
    return true;
  }
  if ("$metadata" in error) {
    return (
      (error as { $metadata?: { httpStatusCode?: number } }).$metadata
        ?.httpStatusCode === 404
    );
  }
  return false;
}

export type S3StorageOptions = {
  accessKeyId?: string;
  secretAccessKey?: string;
  bucket?: string;
  region?: string;
  endpoint?: string;
  forcePathStyle?: boolean;
  restrictNetwork?: boolean;
  deliveryMode?: "proxy" | "direct";
};
export class S3StorageBackend implements StorageBackend {
  readonly maxWriteBytes = 5 * 1024 ** 3;
  private client: S3Client;
  private bucket: string;
  private deliveryMode: "proxy" | "direct";

  constructor(options: S3StorageOptions = config.storage.s3) {
    const {
      accessKeyId,
      secretAccessKey,
      bucket,
      region,
      endpoint,
      forcePathStyle,
    } = options;

    if (!accessKeyId || !secretAccessKey || !bucket) {
      throw new Error(
        "S3 storage requires S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, and S3_BUCKET in environment",
      );
    }

    this.bucket = bucket;
    this.deliveryMode = options.deliveryMode ?? "direct";
    this.client = new S3Client({
      region,
      requestChecksumCalculation: "WHEN_REQUIRED",
      ...(endpoint ? { endpoint } : {}),
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle,
      ...(options.restrictNetwork
        ? {
            requestHandler: new NodeHttpHandler({
              httpsAgent: new HttpsAgent({ lookup: safeStorageLookup }),
              httpAgent: new HttpAgent({ lookup: safeStorageLookup }),
              connectionTimeout: 10000,
              socketTimeout: 30000,
            }),
          }
        : {}),
    });
  }

  get directDelivery() {
    return this.deliveryMode === "direct";
  }

  async signedRead(key: string, options: SignedReadOptions) {
    if (this.deliveryMode !== "direct") return null;
    const url = await getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ResponseContentType: options.contentType,
        ResponseContentDisposition: options.disposition ?? "inline",
        ResponseCacheControl: options.cacheControl ?? "private, max-age=300",
      }),
      {
        expiresIn: 900,
        // Stable targets within five minutes make private browser caching useful.
        // Actual validity is 10–15 minutes; every Serve redirect still checks access.
        signingDate: new Date(Math.floor(Date.now() / 300_000) * 300_000),
      },
    );
    // Private/local HTTP endpoints stay behind Serve; never send signed credentials over HTTP.
    return new URL(url).protocol === "https:" ? url : null;
  }

  async put(
    key: string,
    data: Buffer,
    opts?: { contentType?: string },
  ): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: data,
        ContentType: opts?.contentType,
      }),
    );
  }

  async get(key: string): Promise<Buffer | null> {
    try {
      const response = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return await streamToBuffer(response.Body);
    } catch (error: unknown) {
      if (isMissingObject(error)) {
        return null;
      }
      throw error;
    }
  }

  async open(
    key: string,
    range?: StorageByteRange,
  ): Promise<StorageReadStream | null> {
    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Range: range ? `bytes=${range.start}-${range.end}` : undefined,
        }),
      );

      if (!response.Body) return null;

      return {
        body: streamToWeb(response.Body),
        contentLength: response.ContentLength ?? 0,
        contentRange: response.ContentRange,
        contentType: response.ContentType,
      };
    } catch (error) {
      if (isMissingObject(error)) return null;
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (error) {
      if (!isMissingObject(error)) throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return true;
    } catch (error) {
      if (isMissingObject(error)) return false;
      throw error;
    }
  }

  async createDirectory(key: string) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: "",
        IfNoneMatch: "*",
      }),
    );
  }
  async createFile(
    key: string,
    body: ReadableStream<Uint8Array>,
    size: number,
    contentType?: string,
  ) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: Readable.fromWeb(
          body as unknown as Parameters<typeof Readable.fromWeb>[0],
        ),
        ContentLength: size,
        ContentType: contentType || "application/octet-stream",
        IfNoneMatch: "*",
      }),
    );
  }
  async copyFile(source: string, target: string) {
    await this.client.send(
      new CopyObjectCommand({
        Bucket: this.bucket,
        Key: target,
        CopySource: `${this.bucket}/${source.split("/").map(encodeURIComponent).join("/")}`,
        IfNoneMatch: "*",
      }),
    );
  }
  async removeDirectory(key: string) {
    await this.delete(key);
  }
  async stat(key: string): Promise<StorageObjectInfo | null> {
    try {
      const info = await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return {
        key,
        sizeBytes: info.ContentLength ?? 0,
        mtimeMs: info.LastModified?.getTime(),
        etag: info.ETag,
      };
    } catch (error) {
      if (isMissingObject(error)) return null;
      throw error;
    }
  }

  async browse(prefix: string, cursor?: string): Promise<BrowsePage> {
    const page = await this.client.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        Delimiter: "/",
        MaxKeys: BROWSE_PAGE_SIZE,
        ContinuationToken: cursor,
      }),
    );
    return {
      entries: [
        ...(page.CommonPrefixes ?? []).flatMap((item) =>
          item.Prefix ? [{ key: item.Prefix, kind: "folder" as const }] : [],
        ),
        ...(page.Contents ?? []).flatMap((item) =>
          item.Key && item.Key !== prefix
            ? [
                {
                  key: item.Key,
                  kind: "file" as const,
                  sizeBytes: item.Size ?? 0,
                  modifiedAt: item.LastModified?.getTime(),
                },
              ]
            : [],
        ),
      ],
      nextCursor: page.IsTruncated ? page.NextContinuationToken : undefined,
    };
  }

  async list(prefix: string): Promise<StorageObjectInfo[]> {
    const items: StorageObjectInfo[] = [];
    let continuationToken: string | undefined;

    do {
      const response = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );

      for (const obj of response.Contents ?? []) {
        if (!obj.Key) continue;
        items.push({
          key: obj.Key,
          sizeBytes: obj.Size ?? 0,
          mtimeMs: obj.LastModified?.getTime(),
        });
      }

      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : undefined;
    } while (continuationToken);

    return items;
  }

  async deletePrefix(prefix: string): Promise<void> {
    const objects = await this.list(prefix);
    if (objects.length === 0) return;

    const batchSize = 1000;
    for (let i = 0; i < objects.length; i += batchSize) {
      const batch = objects.slice(i, i + batchSize);
      const result = await this.client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucket,
          Delete: {
            Objects: batch.map((obj) => ({ Key: obj.key })),
          },
        }),
      );
      if (result.Errors?.length)
        throw new Error("Some S3 objects could not be deleted.");
    }
  }
}
