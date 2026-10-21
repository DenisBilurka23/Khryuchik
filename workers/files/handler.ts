import { buildAttachmentDisposition } from "../../src/utils/content-disposition";
import { readSignedFileUrl } from "../../src/utils/signed-file-url";
import type { FilesR2Object, FilesR2Range, FilesWorkerEnv } from "./types";

const NO_STORE = { "Cache-Control": "private, no-store" };

const emptyResponse = (status: number, headers: HeadersInit = {}) =>
  new Response(null, { status, headers: { ...NO_STORE, ...headers } });

const toByteRange = (range: FilesR2Range, size: number) => {
  if (range.suffix !== undefined) {
    return { start: Math.max(0, size - range.suffix), end: size - 1 };
  }

  const start = range.offset ?? 0;
  const length = range.length ?? size - start;

  return { start, end: Math.min(size, start + length) - 1 };
};

const buildFileHeaders = (
  object: FilesR2Object,
  fileName: string,
  contentType: string | undefined,
) =>
  new Headers({
    ...NO_STORE,
    "Accept-Ranges": "bytes",
    "Content-Type":
      contentType ??
      object.httpMetadata?.contentType ??
      "application/octet-stream",
    "Content-Disposition": buildAttachmentDisposition(fileName),
    "Content-Length": String(object.size),
    ETag: object.httpEtag,
    "X-Content-Type-Options": "nosniff",
  });

export const handleFileRequest = async (
  request: Request,
  env: FilesWorkerEnv,
  now = Date.now(),
): Promise<Response> => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return emptyResponse(405, { Allow: "GET, HEAD" });
  }

  if (!env.FILES_SIGNING_SECRET) {
    return emptyResponse(503);
  }

  const link = await readSignedFileUrl(
    new URL(request.url),
    env.FILES_SIGNING_SECRET,
    now,
  );

  if (!link.ok) {
    return emptyResponse(403);
  }

  const { bucket, objectKey, fileName, contentType } = link.file;
  const files = bucket === "public" ? env.PUBLIC_FILES : env.PRIVATE_FILES;

  if (request.method === "HEAD") {
    const object = await files.head(objectKey);

    return object
      ? new Response(null, {
          headers: buildFileHeaders(object, fileName, contentType),
        })
      : emptyResponse(404);
  }

  const wantsRange = request.headers.has("Range");
  let object;

  try {
    object = await files.get(
      objectKey,
      wantsRange ? { range: request.headers } : undefined,
    );
  } catch {
    return emptyResponse(wantsRange ? 416 : 502);
  }

  if (!object) {
    return emptyResponse(404);
  }

  const headers = buildFileHeaders(object, fileName, contentType);

  if (wantsRange && object.range) {
    const { start, end } = toByteRange(object.range, object.size);

    headers.set("Content-Range", `bytes ${start}-${end}/${object.size}`);
    headers.set("Content-Length", String(end - start + 1));

    return new Response(object.body, { status: 206, headers });
  }

  return new Response(object.body, { headers });
};
