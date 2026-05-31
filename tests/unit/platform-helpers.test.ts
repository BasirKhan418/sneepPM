import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/shared/api-error";
import { buildRedisPrefix } from "@/lib/realtime/redis";
import { buildObjectKey, sanitizeFileName } from "@/lib/s3/client";

describe("platform helpers", () => {
  it("builds environment-scoped redis prefixes", () => {
    expect(buildRedisPrefix("development")).toBe("zira:development:");
    expect(buildRedisPrefix("production")).toBe("zira:production:");
  });

  it("sanitizes file names before building S3 keys", () => {
    expect(sanitizeFileName("Roadmap Draft (v1).pdf")).toBe("roadmap-draft-v1.pdf");
    expect(
      buildObjectKey({
        orgId: "org_123",
        scope: "task",
        resourceId: "task_456",
        fileId: "file_789",
        fileName: "Roadmap Draft (v1).pdf",
      }),
    ).toBe("org/org_123/task/task_456/file_789-roadmap-draft-v1.pdf");
  });

  it("rejects empty storage scopes", () => {
    expect(() =>
      buildObjectKey({
        orgId: "org_123",
        scope: "",
        resourceId: "task_456",
        fileId: "file_789",
        fileName: "notes.md",
      }),
    ).toThrow(ApiError);
  });
});