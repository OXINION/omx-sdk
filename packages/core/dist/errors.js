/**
 * Custom error classes for authentication
 */
export class AuthenticationError extends Error {
    constructor(code, message, statusCode, details) {
        super(message);
        this.name = 'AuthenticationError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }
    toAuthError() {
        return {
            code: this.code,
            message: this.message,
            statusCode: this.statusCode,
            details: this.details,
        };
    }
}
export class TokenExpiredError extends AuthenticationError {
    constructor(message = 'JWT token has expired') {
        super('TOKEN_EXPIRED', message, 401);
        this.name = 'TokenExpiredError';
    }
}
export class InvalidCredentialsError extends AuthenticationError {
    constructor(message = 'Invalid client credentials') {
        super('INVALID_CREDENTIALS', message, 401);
        this.name = 'InvalidCredentialsError';
    }
}
export class NetworkError extends AuthenticationError {
    constructor(message = 'Network request failed', details) {
        super('NETWORK_ERROR', message, undefined, details);
        this.name = 'NetworkError';
    }
}
export class RateLimitError extends AuthenticationError {
    constructor(message = 'Rate limit exceeded', retryAfter) {
        super('RATE_LIMIT_EXCEEDED', message, 429, { retryAfter });
        this.name = 'RateLimitError';
    }
}
export class ConfigurationError extends AuthenticationError {
    constructor(message = 'Invalid configuration') {
        super('CONFIGURATION_ERROR', message);
        this.name = 'ConfigurationError';
    }
}
//# sourceMappingURL=errors.js.map