import { ApiRequestOptions, ApiResponse, AuthConfig } from './types.js';
/**
 * Core authentication manager for OMX SDK
 * Handles JWT token fetching, caching, and automatic refresh with Supabase Edge Function
 */
export declare const SUPABASE_FN_BASE_URL = "https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1";
export declare class CoreAuth {
    private config;
    private readonly supabaseFnUrl;
    private cachedToken;
    private refreshPromise;
    constructor(config: AuthConfig);
    /**
     * Validate the authentication configuration
     */
    private validateConfig;
    /**
     * Get a valid JWT token, fetching or refreshing as needed
     */
    getToken(forceRefresh?: boolean): Promise<string>;
    /**
     * Check if the current cached token is valid
     */
    private isTokenValid;
    /**
     * Fetch a new JWT token from Supabase Edge Function
     */
    private fetchNewToken;
    /**
     * Create a JWTToken object from response
     */
    private createJWTToken;
    /**
     * Cache the JWT token with expiration info
     */
    private cacheToken;
    /**
     * Handle Supabase Edge Function errors
     */
    private handleSupabaseError;
    /**
     * Make an authenticated API request with automatic token refresh
     */
    makeAuthenticatedRequest<T = any>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
    /**
     * Handle HTTP response and convert to ApiResponse
     */
    private handleResponse;
    /**
     * Utility method to sleep for a given number of milliseconds
     */
    private sleep;
    /**
     * Clear cached token (useful for logout or token invalidation)
     */
    clearToken(): void;
    /**
     * Get current token info (without the actual token for security)
     */
    getTokenInfo(): {
        isValid: boolean;
        expiresAt: number | null;
        cachedAt: number | null;
    };
    /**
     * Update configuration (will clear cached token)
     */
    updateConfig(updates: Partial<AuthConfig>): void;
    /**
     * Dispose of resources and clear cache
     */
    dispose(): void;
}
//# sourceMappingURL=core.d.ts.map