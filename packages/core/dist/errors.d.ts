import { AuthError } from './types.js';
/**
 * Custom error classes for authentication
 */
export declare class AuthenticationError extends Error {
    readonly code: string;
    readonly statusCode?: number;
    readonly details?: any;
    constructor(code: string, message: string, statusCode?: number, details?: any);
    toAuthError(): AuthError;
}
export declare class TokenExpiredError extends AuthenticationError {
    constructor(message?: string);
}
export declare class InvalidCredentialsError extends AuthenticationError {
    constructor(message?: string);
}
export declare class NetworkError extends AuthenticationError {
    constructor(message?: string, details?: any);
}
export declare class RateLimitError extends AuthenticationError {
    constructor(message?: string, retryAfter?: number);
}
export declare class ConfigurationError extends AuthenticationError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map