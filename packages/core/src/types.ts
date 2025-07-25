/**
 * Core authentication types for the OMX SDK
 */

export interface AuthConfig {
  clientId: string;
  secretKey: string;
  tokenCacheTtl?: number; // Time to live in milliseconds (default: 55 minutes)
  maxRetries?: number; // Maximum retry attempts (default: 3)
  retryDelay?: number; // Delay between retries in milliseconds (default: 1000)
}

export interface JWTToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number; // Calculated expiration timestamp
  scope?: string;
}

export interface CachedToken {
  token: JWTToken;
  cachedAt: number;
  expiresAt: number;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
  statusCode?: number;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AuthError;
  status: number;
  headers: Headers;
}

export interface SupabaseRpcResponse {
  token?: string; // JWT token from edge function
  access_token?: string; // Alternative field name
  token_type?: string;
  expires_in?: number;
  error?: string; // Error message from edge function
}

export interface SupabaseErrorResponse {
  error: string;
  message?: string;
  details?: string;
  hint?: string;
}
