import { NextResponse } from "next/server";

import { env } from "@/lib/config/env";

export async function GET() {
  return NextResponse.json({
    name: "zira",
    status: "ok",
    runtime: {
      nodeEnv: env.nodeEnv,
      appUrl: env.app.url,
      gatewayUrl: env.app.gatewayUrl,
    },
    services: {
      mongoConfigured: Boolean(env.mongo.uri),
      redisConfigured: Boolean(env.redis.url),
      smtpConfigured: env.smtp.enabled,
      s3Configured: Boolean(env.s3.bucket && env.s3.region),
    },
  });
}