export class ApiError extends Error {
  public code: string;
  public requestId?: string;
  public details?: unknown;
  public status: number;

  constructor(status: number, message: string, code: string, requestId?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
  }
}
