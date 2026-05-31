import mongoose from "mongoose";

import { env } from "@/lib/config/env";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var __ziraMongooseCache: MongooseCache | undefined;
}

const cache = globalThis.__ziraMongooseCache ?? {
  connection: null,
  promise: null,
};

globalThis.__ziraMongooseCache = cache;

export async function connectMongo(connectionString = env.mongo.uri) {
  if (cache.connection) {
    return cache.connection;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(connectionString, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }

  cache.connection = await cache.promise;
  return cache.connection;
}

export async function disconnectMongo() {
  if (!cache.connection) {
    return;
  }

  await mongoose.disconnect();
  cache.connection = null;
  cache.promise = null;
}