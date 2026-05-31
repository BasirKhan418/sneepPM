import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/shared/api-error";
import { parseEnv } from "@/lib/config/env";

const developmentEnv = {
  NODE_ENV: "development",
  APP_URL: "http://localhost:3000",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  GATEWAY_URL: "http://localhost:4000",
  NEXT_PUBLIC_GATEWAY_URL: "http://localhost:4000",
  MONGO_URI: "mongodb://localhost:27017/zira",
  REDIS_URL: "redis://localhost:6379",
  AWS_REGION: "ap-south-1",
  AWS_S3_BUCKET: "zira-local",
  AWS_ACCESS_KEY_ID: "local-key",
  AWS_SECRET_ACCESS_KEY: "local-secret",
  EMAIL_HOST: "smtp.example.com",
  EMAIL_PORT: "587",
  EMAIL_USER: "team@example.com",
  EMAIL_PASSWORD: "password",
  EMAIL_FROM: "Zira <team@example.com>",
} satisfies NodeJS.ProcessEnv;

describe("parseEnv", () => {
  it("normalizes aliases into a single runtime shape", () => {
    const env = parseEnv(developmentEnv);

    expect(env.mongo.uri).toBe("mongodb://localhost:27017/zira");
    expect(env.redis.url).toBe("redis://localhost:6379");
    expect(env.redis.prefix).toBe("zira:development:");
    expect(env.smtp.enabled).toBe(true);
    expect(env.s3.bucket).toBe("zira-local");
  });

  it("uses development defaults for missing local infrastructure values", () => {
    const env = parseEnv({ NODE_ENV: "development" });

    expect(env.mongo.uri).toBe("mongodb://localhost:27017/zira");
    expect(env.redis.url).toBe("redis://localhost:6379");
    expect(env.app.url).toBe("http://localhost:3000");
  });

  it("fails fast in production when required secrets are missing", () => {
    expect(() => parseEnv({ NODE_ENV: "production" })).toThrow(ApiError);
  });
});