import { createClient, type RedisClientType } from "redis";
import IORedis from "ioredis";

import { env } from "@/lib/config/env";

let redisClientPromise: Promise<RedisClientType> | undefined;
let queueClient: IORedis | undefined;

export function buildRedisPrefix(nodeEnv: string) {
  return `zira:${nodeEnv}:`;
}

export async function getRedis(url = env.redis.url) {
  if (!redisClientPromise) {
    const client = createClient({ url });
    redisClientPromise = client.connect().then(() => client);
  }

  return redisClientPromise;
}

export function getQueueRedis(url = env.redis.url) {
  if (!queueClient) {
    queueClient = new IORedis(url, {
      keyPrefix: env.redis.prefix,
      maxRetriesPerRequest: null,
    });
  }

  return queueClient;
}