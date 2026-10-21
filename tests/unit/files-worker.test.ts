import { describe, expect, it, vi } from "vitest";

import type { SignedFile } from "@/types/download";
import { createSignedFileUrl } from "@/utils";

import { handleFileRequest } from "../../workers/files/handler";
import type { FilesR2Bucket, FilesWorkerEnv } from "../../workers/files/types";

const secret = "test-files-secret";
const now = Date.UTC(2026, 9, 20, 12, 0, 0);
const content = "%PDF-1.7 Khryuchik coloring pages";
const bytes = new TextEncoder().encode(content);
const objectKey = "books/hrjuchik/book.pdf";

const file: SignedFile = {
  bucket: "private",
  objectKey,
  fileName: "Хрючик.pdf",
  contentType: "application/pdf",
  expiresAtSeconds: now / 1000 + 600,
};

const createBucket = (objects: Record<string, Uint8Array<ArrayBuffer>>) => {
  const describeObject = (data: Uint8Array) => ({
    size: data.length,
    httpEtag: '"etag-1"',
    httpMetadata: { contentType: "application/octet-stream" },
  });

  return {
    get: vi.fn<FilesR2Bucket["get"]>(async (key, options) => {
      const data = objects[key];

      if (!data) return null;

      const rangeHeader = options?.range?.get("Range");

      if (!rangeHeader) {
        return { ...describeObject(data), body: new Response(data).body! };
      }

      const suffixMatch = rangeHeader.match(/^bytes=-(\d+)$/);

      if (suffixMatch) {
        const suffix = Number(suffixMatch[1]);

        return {
          ...describeObject(data),
          range: { offset: undefined, length: undefined, suffix },
          body: new Response(data.slice(-suffix)).body!,
        };
      }

      const match = rangeHeader.match(/^bytes=(\d+)-(\d*)$/);
      const offset = Number(match?.[1]);

      if (!match || offset >= data.length) {
        throw new Error("InvalidRange");
      }

      const end = match[2] ? Number(match[2]) : data.length - 1;
      const slice = data.slice(offset, end + 1);

      return {
        ...describeObject(data),
        range: { offset, length: slice.length, suffix: undefined },
        body: new Response(slice).body!,
      };
    }),
    head: vi.fn<FilesR2Bucket["head"]>(async (key) =>
      objects[key] ? describeObject(objects[key]) : null,
    ),
  };
};

const createEnv = () => {
  const env = {
    PUBLIC_FILES: createBucket({ "entertainment/coloring.pdf": bytes }),
    PRIVATE_FILES: createBucket({ [objectKey]: bytes }),
    FILES_SIGNING_SECRET: secret,
  };

  return env satisfies FilesWorkerEnv;
};

const request = async (
  overrides: Partial<SignedFile> = {},
  init: RequestInit = {},
) =>
  new Request(
    await createSignedFileUrl("https://files.example.com", secret, {
      ...file,
      ...overrides,
    }),
    init,
  );

describe("files worker", () => {
  it("streams a private file as an attachment with its original name", async () => {
    const env = createEnv();

    const response = await handleFileRequest(await request(), env, now);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(content);
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(response.headers.get("content-disposition")).toBe(
      "attachment; filename=\"______.pdf\"; filename*=UTF-8''%D0%A5%D1%80%D1%8E%D1%87%D0%B8%D0%BA.pdf",
    );
    expect(response.headers.get("content-length")).toBe(String(bytes.length));
    expect(response.headers.get("accept-ranges")).toBe("bytes");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("etag")).toBe('"etag-1"');
    expect(env.PRIVATE_FILES.get).toHaveBeenCalledWith(objectKey, undefined);
    expect(env.PUBLIC_FILES.get).not.toHaveBeenCalled();
  });

  it("reads public links from the public bucket", async () => {
    const env = createEnv();

    const response = await handleFileRequest(
      await request({
        bucket: "public",
        objectKey: "entertainment/coloring.pdf",
      }),
      env,
      now,
    );

    expect(response.status).toBe(200);
    expect(env.PUBLIC_FILES.get).toHaveBeenCalled();
    expect(env.PRIVATE_FILES.get).not.toHaveBeenCalled();
  });

  it("falls back to the stored content type when the link has none", async () => {
    const response = await handleFileRequest(
      await request({ contentType: undefined }),
      createEnv(),
      now,
    );

    expect(response.headers.get("content-type")).toBe(
      "application/octet-stream",
    );
  });

  it("serves a requested byte range so downloads can resume", async () => {
    const response = await handleFileRequest(
      await request({}, { headers: { Range: "bytes=4-8" } }),
      createEnv(),
      now,
    );

    expect(response.status).toBe(206);
    expect(await response.text()).toBe(content.slice(4, 9));
    expect(response.headers.get("content-range")).toBe(
      `bytes 4-8/${bytes.length}`,
    );
    expect(response.headers.get("content-length")).toBe("5");
  });

  it("serves the tail of the file for a suffix range", async () => {
    const response = await handleFileRequest(
      await request({}, { headers: { Range: "bytes=-6" } }),
      createEnv(),
      now,
    );

    expect(response.status).toBe(206);
    expect(await response.text()).toBe(content.slice(-6));
    expect(response.headers.get("content-range")).toBe(
      `bytes ${bytes.length - 6}-${bytes.length - 1}/${bytes.length}`,
    );
    expect(response.headers.get("content-length")).toBe("6");
  });

  it("answers 416 for a range outside the file", async () => {
    const response = await handleFileRequest(
      await request({}, { headers: { Range: "bytes=9999-" } }),
      createEnv(),
      now,
    );

    expect(response.status).toBe(416);
  });

  it("answers HEAD with the file headers and no body", async () => {
    const env = createEnv();

    const response = await handleFileRequest(
      await request({}, { method: "HEAD" }),
      env,
      now,
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
    expect(response.headers.get("content-length")).toBe(String(bytes.length));
    expect(env.PRIVATE_FILES.head).toHaveBeenCalledWith(objectKey);
    expect(env.PRIVATE_FILES.get).not.toHaveBeenCalled();
  });

  it("refuses an expired link without touching storage", async () => {
    const env = createEnv();

    const response = await handleFileRequest(
      await request(),
      env,
      file.expiresAtSeconds * 1000 + 1,
    );

    expect(response.status).toBe(403);
    expect(env.PRIVATE_FILES.get).not.toHaveBeenCalled();
  });

  it("refuses a forged link", async () => {
    const forged = new URL((await request()).url);

    forged.pathname = "/private/books/other.pdf";

    const response = await handleFileRequest(
      new Request(forged),
      createEnv(),
      now,
    );

    expect(response.status).toBe(403);
  });

  it("answers 404 when the file is gone", async () => {
    const response = await handleFileRequest(
      await request({ objectKey: "books/missing.pdf" }),
      createEnv(),
      now,
    );

    expect(response.status).toBe(404);
  });

  it("answers 503 instead of failing when the secret is not set", async () => {
    const env = { ...createEnv(), FILES_SIGNING_SECRET: "" };

    const response = await handleFileRequest(await request(), env, now);

    expect(response.status).toBe(503);
    expect(env.PRIVATE_FILES.get).not.toHaveBeenCalled();
  });

  it("only allows GET and HEAD", async () => {
    const response = await handleFileRequest(
      await request({}, { method: "POST" }),
      createEnv(),
      now,
    );

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, HEAD");
  });
});
