import type {
  SignedFile,
  SignedFileBucket,
  SignedFileCheck,
} from "@/types/download";

const encoder = new TextEncoder();

const INVALID: SignedFileCheck = { ok: false, reason: "invalid" };

const isSignedFileBucket = (value: string): value is SignedFileBucket =>
  value === "public" || value === "private";

const toBase64Url = (bytes: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));

  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const importSigningKey = (secret: string) =>
  crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

const toSignedPayload = (file: SignedFile) =>
  encoder.encode(
    JSON.stringify([
      file.bucket,
      file.objectKey,
      file.fileName,
      file.contentType ?? "",
      file.expiresAtSeconds,
    ]),
  );

const toObjectPath = (file: SignedFile) =>
  `/${file.bucket}/${file.objectKey.split("/").map(encodeURIComponent).join("/")}`;

export const createSignedFileUrl = async (
  baseUrl: string,
  secret: string,
  file: SignedFile,
) => {
  const signature = await crypto.subtle.sign(
    "HMAC",
    await importSigningKey(secret),
    toSignedPayload(file),
  );
  const url = new URL(toObjectPath(file), baseUrl);

  url.searchParams.set("name", file.fileName);

  if (file.contentType) {
    url.searchParams.set("type", file.contentType);
  }

  url.searchParams.set("exp", String(file.expiresAtSeconds));
  url.searchParams.set("sig", toBase64Url(signature));

  return url.toString();
};

export const readSignedFileUrl = async (
  url: URL,
  secret: string,
  now = Date.now(),
): Promise<SignedFileCheck> => {
  const [bucket, ...segments] = url.pathname.slice(1).split("/");
  const fileName = url.searchParams.get("name");
  const contentType = url.searchParams.get("type");
  const expiresAtSeconds = Number(url.searchParams.get("exp"));
  const signature = url.searchParams.get("sig");

  if (
    !isSignedFileBucket(bucket) ||
    segments.length === 0 ||
    !fileName ||
    !Number.isSafeInteger(expiresAtSeconds) ||
    !signature
  ) {
    return INVALID;
  }

  let file: SignedFile;
  let signatureBytes: Uint8Array<ArrayBuffer>;

  try {
    file = {
      bucket,
      objectKey: segments.map(decodeURIComponent).join("/"),
      fileName,
      ...(contentType ? { contentType } : {}),
      expiresAtSeconds,
    };
    signatureBytes = fromBase64Url(signature);
  } catch {
    return INVALID;
  }

  const isAuthentic = await crypto.subtle.verify(
    "HMAC",
    await importSigningKey(secret),
    signatureBytes,
    toSignedPayload(file),
  );

  if (!isAuthentic) {
    return INVALID;
  }

  return expiresAtSeconds * 1000 > now
    ? { ok: true, file }
    : { ok: false, reason: "expired" };
};
