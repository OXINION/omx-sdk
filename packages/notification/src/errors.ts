/**
 * Base error class for all notification-related errors.
 */
export class NotificationError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: unknown;

  constructor(
    code: string,
    message: string,
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.name = "NotificationError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Error thrown when a network request to the backend fails.
 */
export class NotificationNetworkError extends NotificationError {
  constructor(message: string, details?: unknown) {
    super("NETWORK_ERROR", message, undefined, details);
    this.name = "NotificationNetworkError";
  }
}

/**
 * Error thrown when the backend returns a non-2xx status code.
 */
export class NotificationApiError extends NotificationError {
  constructor(message: string, statusCode: number, details?: unknown) {
    super("API_ERROR", message, statusCode, details);
    this.name = "NotificationApiError";
  }
}

/**
 * Error thrown when the provided configuration is invalid.
 */
export class NotificationConfigError extends NotificationError {
  constructor(message: string) {
    super("CONFIG_ERROR", message);
    this.name = "NotificationConfigError";
  }
}
