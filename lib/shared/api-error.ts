export const apiErrorCodes = [
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "VALIDATION_ERROR",
  "CONFLICT",
  "RATE_LIMITED",
  "INVITE_EXPIRED",
  "INVITE_REVOKED",
  "UPLOAD_TOO_LARGE",
  "UNSUPPORTED_FILE_TYPE",
  "INTERNAL_ERROR",
] as const;

export type ApiErrorCode = (typeof apiErrorCodes)[number];

const defaultStatuses: Record<ApiErrorCode, number> = {
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INVITE_EXPIRED: 410,
  INVITE_REVOKED: 410,
  UPLOAD_TOO_LARGE: 413,
  UNSUPPORTED_FILE_TYPE: 415,
  INTERNAL_ERROR: 500,
};

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;
  details?: Record<string, unknown>;

  constructor(
    code: ApiErrorCode,
    message: string,
    options?: { status?: number; details?: Record<string, unknown> },
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = options?.status ?? defaultStatuses[code];
    this.details = options?.details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}