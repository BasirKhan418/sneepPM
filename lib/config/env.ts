import { z } from "zod";

import { ApiError } from "@/lib/shared/api-error";
import { nodeEnvValues, type NodeEnv } from "@/lib/shared/contracts";

const rawEnvSchema = z.object({
  NODE_ENV: z.enum(nodeEnvValues).default("development"),
  APP_URL: z.string().trim().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().trim().url().optional(),
  GATEWAY_URL: z.string().trim().url().optional(),
  NEXT_PUBLIC_GATEWAY_URL: z.string().trim().url().optional(),
  JWT_SECRET: z.string().trim().min(1).optional(),
  NEXTAUTH_SECRET: z.string().trim().min(1).optional(),
  PASSWORD_PEPPER: z.string().trim().min(1).optional(),
  CRON_SECRET: z.string().trim().min(1).optional(),
  MONGO_URI: z.string().trim().min(1).optional(),
  MONGODB_URI: z.string().trim().min(1).optional(),
  REDIS_HOST: z.string().trim().min(1).optional(),
  REDIS_PORT: z.coerce.number().int().positive().optional(),
  REDIS_USER: z.string().trim().optional(),
  REDIS_PASSWORD: z.string().trim().optional(),
  REDIS_URL: z.string().trim().min(1).optional(),
  VALKEY_URL: z.string().trim().min(1).optional(),
  EMAIL_HOST: z.string().trim().optional(),
  EMAIL_PORT: z.coerce.number().int().positive().optional(),
  EMAIL_USER: z.string().trim().optional(),
  EMAIL_PASSWORD: z.string().trim().optional(),
  EMAIL_USER_V2: z.string().trim().optional(),
  EMAIL_FROM: z.string().trim().optional(),
  AWS_REGION: z.string().trim().optional(),
  AWS_ACCESS_KEY_ID: z.string().trim().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().trim().optional(),
  AWS_S3_BUCKET: z.string().trim().optional(),
  S3_BUCKET: z.string().trim().optional(),
  S3_REGION: z.string().trim().optional(),
  S3_UPLOAD_MAX_BYTES: z.coerce.number().int().positive().optional(),
  S3_PRESIGN_EXPIRES_SECONDS: z.coerce.number().int().positive().optional(),
  AI_PROVIDER: z.string().trim().optional(),
  OPENAI_API_KEY: z.string().trim().optional(),
  ANTHROPIC_API_KEY: z.string().trim().optional(),
  INVITE_TOKEN_TTL_DAYS: z.coerce.number().int().positive().optional(),
  MEETING_REMINDER_MINUTES: z.coerce.number().int().positive().optional(),
  PRESENCE_HEARTBEAT_SECONDS: z.coerce.number().int().positive().optional(),
  PRESENCE_IDLE_SECONDS: z.coerce.number().int().positive().optional(),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().optional(),
  RETENTION_DAYS: z.coerce.number().int().positive().optional(),
});

export type Env = {
  nodeEnv: NodeEnv;
  isDevelopment: boolean;
  isTest: boolean;
  isProduction: boolean;
  app: {
    url: string;
    publicUrl: string;
    gatewayUrl: string;
    publicGatewayUrl: string;
  };
  auth: {
    jwtSecret: string;
    nextAuthSecret: string;
    passwordPepper: string;
    cronSecret: string;
  };
  mongo: {
    uri: string;
  };
  redis: {
    host: string;
    port: number;
    user?: string;
    password?: string;
    url: string;
    prefix: string;
  };
  smtp: {
    enabled: boolean;
    host: string;
    port: number;
    user: string;
    password: string;
    userV2?: string;
    from: string;
  };
  s3: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    uploadMaxBytes: number;
    presignExpiresSeconds: number;
  };
  ai: {
    provider: string;
    openaiApiKey?: string;
    anthropicApiKey?: string;
  };
  security: {
    inviteTokenTtlDays: number;
    meetingReminderMinutes: number;
    presenceHeartbeatSeconds: number;
    presenceIdleSeconds: number;
    rateLimitWindowSeconds: number;
    retentionDays: number;
  };
};

function pickFirst(...values: Array<string | undefined>) {
  return values.find((value) => Boolean(value && value.length > 0));
}

function buildRedisUrl(options: {
  host: string;
  port: number;
  user?: string;
  password?: string;
}) {
  const credentials = options.user
    ? `${encodeURIComponent(options.user)}${options.password ? `:${encodeURIComponent(options.password)}` : ""}@`
    : options.password
      ? `:${encodeURIComponent(options.password)}@`
      : "";

  return `redis://${credentials}${options.host}:${options.port}`;
}

function requireInProduction(nodeEnv: NodeEnv, missingKeys: string[]) {
  if (nodeEnv !== "production" || missingKeys.length === 0) {
    return;
  }

  throw new ApiError(
    "VALIDATION_ERROR",
    `Missing required environment variables: ${missingKeys.join(", ")}`,
    { details: { missingKeys } },
  );
}

export function parseEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = rawEnvSchema.safeParse(source);

  if (!parsed.success) {
    throw new ApiError("VALIDATION_ERROR", "Environment validation failed", {
      details: { issues: parsed.error.flatten() },
    });
  }

  const raw = parsed.data;
  const nodeEnv = raw.NODE_ENV;
  const isProduction = nodeEnv === "production";

  const appUrl = raw.APP_URL ?? "http://localhost:3000";
  const publicAppUrl = raw.NEXT_PUBLIC_APP_URL ?? appUrl;
  const gatewayUrl = raw.GATEWAY_URL ?? "http://localhost:4000";
  const publicGatewayUrl = raw.NEXT_PUBLIC_GATEWAY_URL ?? gatewayUrl;
  const mongoUri = pickFirst(raw.MONGO_URI, raw.MONGODB_URI) ?? "mongodb://localhost:27017/zira";
  const redisHost = raw.REDIS_HOST ?? "localhost";
  const redisPort = raw.REDIS_PORT ?? 6379;
  const redisUrl =
    pickFirst(raw.REDIS_URL, raw.VALKEY_URL) ??
    buildRedisUrl({
      host: redisHost,
      port: redisPort,
      user: raw.REDIS_USER,
      password: raw.REDIS_PASSWORD,
    });

  const auth = {
    jwtSecret: raw.JWT_SECRET ?? (isProduction ? "" : "dev-jwt-secret"),
    nextAuthSecret:
      raw.NEXTAUTH_SECRET ?? raw.JWT_SECRET ?? (isProduction ? "" : "dev-nextauth-secret"),
    passwordPepper: raw.PASSWORD_PEPPER ?? (isProduction ? "" : "dev-password-pepper"),
    cronSecret: raw.CRON_SECRET ?? (isProduction ? "" : "dev-cron-secret"),
  };

  const smtp = {
    host: raw.EMAIL_HOST ?? "localhost",
    port: raw.EMAIL_PORT ?? 587,
    user: raw.EMAIL_USER ?? "",
    password: raw.EMAIL_PASSWORD ?? "",
    userV2: raw.EMAIL_USER_V2,
    from: raw.EMAIL_FROM ?? "Zira <team@example.com>",
  };

  const s3 = {
    region: raw.S3_REGION ?? raw.AWS_REGION ?? "ap-south-1",
    accessKeyId: raw.AWS_ACCESS_KEY_ID ?? (isProduction ? "" : "local-access-key"),
    secretAccessKey:
      raw.AWS_SECRET_ACCESS_KEY ?? (isProduction ? "" : "local-secret-access-key"),
    bucket: pickFirst(raw.AWS_S3_BUCKET, raw.S3_BUCKET) ?? (isProduction ? "" : "zira-local"),
    uploadMaxBytes: raw.S3_UPLOAD_MAX_BYTES ?? 209715200,
    presignExpiresSeconds: raw.S3_PRESIGN_EXPIRES_SECONDS ?? 300,
  };

  requireInProduction(nodeEnv, [
    !auth.jwtSecret && "JWT_SECRET",
    !auth.nextAuthSecret && "NEXTAUTH_SECRET",
    !auth.passwordPepper && "PASSWORD_PEPPER",
    !auth.cronSecret && "CRON_SECRET",
    !mongoUri && "MONGO_URI | MONGODB_URI",
    !redisUrl && "REDIS_URL | VALKEY_URL",
    !smtp.host && "EMAIL_HOST",
    !smtp.user && "EMAIL_USER",
    !smtp.password && "EMAIL_PASSWORD",
    !smtp.from && "EMAIL_FROM",
    !s3.region && "AWS_REGION | S3_REGION",
    !s3.accessKeyId && "AWS_ACCESS_KEY_ID",
    !s3.secretAccessKey && "AWS_SECRET_ACCESS_KEY",
    !s3.bucket && "AWS_S3_BUCKET | S3_BUCKET",
  ].filter(Boolean) as string[]);

  return {
    nodeEnv,
    isDevelopment: nodeEnv === "development",
    isTest: nodeEnv === "test",
    isProduction,
    app: {
      url: appUrl,
      publicUrl: publicAppUrl,
      gatewayUrl,
      publicGatewayUrl,
    },
    auth,
    mongo: {
      uri: mongoUri,
    },
    redis: {
      host: redisHost,
      port: redisPort,
      user: raw.REDIS_USER,
      password: raw.REDIS_PASSWORD,
      url: redisUrl,
      prefix: `zira:${nodeEnv}:`,
    },
    smtp: {
      ...smtp,
      enabled: Boolean(smtp.host && smtp.user && smtp.password),
    },
    s3,
    ai: {
      provider: raw.AI_PROVIDER ?? "openai",
      openaiApiKey: raw.OPENAI_API_KEY,
      anthropicApiKey: raw.ANTHROPIC_API_KEY,
    },
    security: {
      inviteTokenTtlDays: raw.INVITE_TOKEN_TTL_DAYS ?? 7,
      meetingReminderMinutes: raw.MEETING_REMINDER_MINUTES ?? 10,
      presenceHeartbeatSeconds: raw.PRESENCE_HEARTBEAT_SECONDS ?? 20,
      presenceIdleSeconds: raw.PRESENCE_IDLE_SECONDS ?? 300,
      rateLimitWindowSeconds: raw.RATE_LIMIT_WINDOW_SECONDS ?? 60,
      retentionDays: raw.RETENTION_DAYS ?? 365,
    },
  };
}

export const env = parseEnv();