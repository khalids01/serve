import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { config } from "@/config";
import type {
  StorageBackend,
  StorageByteRange,
  StorageObjectInfo,
  StorageReadStream,
} from "./backend";

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

export class S3StorageBackend implements StorageBackend {
  private client: S3Client;
  private bucket: string;

  constructor() {
    const {
      accessKeyId,
      secretAccessKey,
      bucket,
      region,
      endpoint,
      forcePathStyle,
    } = config.storage.s3;

    if (!accessKeyId || !secretAccessKey || !bucket) {
      throw new Error(
        "S3 storage requires S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, and S3_BUCKET in environment",
      );
    }

    this.bucket = bucket;
    this.client = new S3Client({
      region,
      ...(endpoint ? { endpoint } : {}),
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle,
    });
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
      console.error("Error deleting S3 object:", error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return true;
    } catch {
      return false;
    }
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
      await this.client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucket,
          Delete: {
            Objects: batch.map((obj) => ({ Key: obj.key })),
          },
        }),
      );
    }
  }
}
