export const nodeEnvValues = ["development", "test", "production"] as const;
export type NodeEnv = (typeof nodeEnvValues)[number];

export const systemRoleValues = ["owner", "admin", "member", "guest"] as const;
export type SystemRole = (typeof systemRoleValues)[number];

export const uploadScopeValues = [
  "task",
  "channel",
  "project",
  "timesheet",
  "avatar",
  "misc",
] as const;
export type UploadScope = (typeof uploadScopeValues)[number];

export const defaultProjectColumns = [
  { id: "backlog", name: "Backlog", order: 0 },
  { id: "in-progress", name: "In Progress", order: 1 },
  { id: "review", name: "Review", order: 2 },
  { id: "done", name: "Done", order: 3 },
] as const;