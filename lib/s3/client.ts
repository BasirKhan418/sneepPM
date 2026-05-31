import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { z } from "zod";

import { env } from "@/lib/config/env";
import { ApiError } from "@/lib/shared/api-error";
import { uploadScopeValues, type UploadScope } from "@/lib/shared/contracts";

const createUploadPresignInputSchema = z.object({
  orgId: z.string().trim().min(1),
  scope: z.enum(uploadScopeValues),
  resourceId: z.string().trim().min(1).optional(),
  fileName: z.string().trim().min(1),
  contentType: z.string().trim().min(1),
  size: z.number().int().positive(),
});

let s3Client: S3Client | undefined;

export function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/-\./g, ".")
    .replace(/^-|-$/g, "");
}

export function buildObjectKey(input: {
  orgId: string;
  scope: string;
  resourceId?: string;
  fileId: string;
  fileName: string;
}) {
  if (!input.scope.trim()) {
    throw new ApiError("VALIDATION_ERROR", "Storage scope is required");
  }

  const safeName = sanitizeFileName(input.fileName);
  const scopeSegment = input.resourceId ? `${input.scope}/${input.resourceId}` : input.scope;

  return `org/${input.orgId}/${scopeSegment}/${input.fileId}-${safeName}`;
}

export function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: env.s3.region,
      credentials: {
        accessKeyId: env.s3.accessKeyId,
        secretAccessKey: env.s3.secretAccessKey,
      },
    });
  }

  return s3Client;
}

export async function createUploadPresign(input: {
  orgId: string;
  scope: UploadScope;
  resourceId?: string;
  fileName: string;
  contentType: string;
  size: number;
}) {
  const payload = createUploadPresignInputSchema.parse(input);

  if (payload.size > env.s3.uploadMaxBytes) {
    throw new ApiError("UPLOAD_TOO_LARGE", "Upload exceeds the configured size limit", {
      details: { limit: env.s3.uploadMaxBytes, size: payload.size },
    });
  }

  const fileId = nanoid(12);
  const key = buildObjectKey({
    orgId: payload.orgId,
    scope: payload.scope,
    resourceId: payload.resourceId,
    fileId,
    fileName: payload.fileName,
  });
  const command = new PutObjectCommand({
    Bucket: env.s3.bucket,
    Key: key,
    ContentLength: payload.size,
    ContentType: payload.contentType,
  });

  const url = await getSignedUrl(getS3Client(), command, {
    expiresIn: env.s3.presignExpiresSeconds,
  });

  return {
    fileId,
    key,
    url,
    expiresIn: env.s3.presignExpiresSeconds,
  };
}

export async function createDownloadPresign(input: {
  key: string;
  responseContentDisposition?: string;
}) {
  const command = new GetObjectCommand({
    Bucket: env.s3.bucket,
    Key: input.key,
    ResponseContentDisposition: input.responseContentDisposition,
  });

  return getSignedUrl(getS3Client(), command, {
    expiresIn: env.s3.presignExpiresSeconds,
  });
}