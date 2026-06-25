import "server-only";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const {
  R2_ACCOUNT_ID,
  R2_S3_API_URL,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_PUBLIC,
  R2_BUCKET_PRIVATE,
  R2_PUBLIC_BASE_URL,
} = process.env;

export type R2BucketKind = "public" | "private";

const PRESIGNED_PUT_EXPIRES_IN_SECONDS = 60 * 10;

export const isR2Configured = Boolean(
  R2_ACCOUNT_ID &&
    R2_S3_API_URL &&
    R2_ACCESS_KEY_ID &&
    R2_SECRET_ACCESS_KEY &&
    R2_BUCKET_PUBLIC &&
    R2_BUCKET_PRIVATE,
);

let r2Client: S3Client | null = null;

const getR2Client = () => {
  if (!isR2Configured) {
    throw new Error("Cloudflare R2 is not fully configured");
  }

  if (!r2Client) {
    r2Client = new S3Client({
      region: "auto",
      endpoint: R2_S3_API_URL,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID!,
        secretAccessKey: R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  return r2Client;
};

const toBuffer = async (file: Blob) => Buffer.from(await file.arrayBuffer());

const buildPublicUrl = (objectKey: string) => {
  if (!R2_PUBLIC_BASE_URL) {
    return undefined;
  }

  return `${R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${objectKey}`;
};

const getBucketName = (bucket: R2BucketKind) =>
  bucket === "public" ? R2_BUCKET_PUBLIC : R2_BUCKET_PRIVATE;

export const buildPublicObjectUrl = (objectKey: string) =>
  buildPublicUrl(objectKey);

export const createPresignedPutUrl = async ({
  bucket,
  objectKey,
  contentType,
}: {
  bucket: R2BucketKind;
  objectKey: string;
  contentType?: string;
}) => {
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: getBucketName(bucket),
    Key: objectKey,
    ContentType: contentType || undefined,
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: PRESIGNED_PUT_EXPIRES_IN_SECONDS,
  });

  return {
    objectKey,
    uploadUrl,
    expiresInSeconds: PRESIGNED_PUT_EXPIRES_IN_SECONDS,
  };
};

export const uploadPublicObject = async ({
  objectKey,
  file,
}: {
  objectKey: string;
  file: Blob;
}) => {
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_PUBLIC,
      Key: objectKey,
      Body: await toBuffer(file),
      ContentType: file.type || undefined,
    }),
  );

  return {
    objectKey,
    url: buildPublicUrl(objectKey),
  };
};

export const uploadPrivateObject = async ({
  objectKey,
  file,
}: {
  objectKey: string;
  file: Blob;
}) => {
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_PRIVATE,
      Key: objectKey,
      Body: await toBuffer(file),
      ContentType: file.type || undefined,
    }),
  );

  return {
    objectKey,
  };
};

export const deletePublicObject = async (objectKey: string) => {
  const client = getR2Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_PUBLIC,
      Key: objectKey,
    }),
  );
};

export const deletePrivateObject = async (objectKey: string) => {
  const client = getR2Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_PRIVATE,
      Key: objectKey,
    }),
  );
};

export const getPrivateObject = async (objectKey: string) => {
  const client = getR2Client();

  return client.send(
    new GetObjectCommand({
      Bucket: R2_BUCKET_PRIVATE,
      Key: objectKey,
    }),
  );
};
