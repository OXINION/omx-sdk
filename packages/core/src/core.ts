import {
  AuthenticationError,
  ConfigurationError,
  InvalidCredentialsError,
  NetworkError,
  RateLimitError,
  TokenExpiredError,
} from './errors.js';
import {
  ApiRequestOptions,
  ApiResponse,
  AuthConfig,
  CachedToken,
  JWTToken,
  SupabaseRpcResponse,
} from './types.js';

/**
 * Core authentication manager for OMX SDK
 * Handles JWT token fetching, caching, and automatic refresh with Supabase Edge Function
 */
export class CoreAuth {
  private config: AuthConfig;
  private readonly supabaseFnUrl: string =
    'https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1/create-jwt-token';
  private cachedToken: CachedToken | null = null;
  private refreshPromise: Promise<JWTToken> | null = null;

  constructor(config: AuthConfig) {
    this.validateConfig(config);
    this.config = {
      tokenCacheTtl: 55 * 60 * 1000, // 55 minutes default
      maxRetries: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  /**
   * Validate the authentication configuration
   */
  private validateConfig(config: AuthConfig): void {
    if (!config.clientId || typeof config.clientId !== 'string') {
      throw new ConfigurationError('clientId is required and must be a string');
    }

    if (!config.secretKey || typeof config.secretKey !== 'string') {
      throw new ConfigurationError(
        'secretKey is required and must be a string'
      );
    }
  }

  /**
   * Get a valid JWT token, fetching or refreshing as needed
   */
  public async getToken(forceRefresh = false): Promise<string> {
    // If we have a refresh in progress, wait for it
    if (this.refreshPromise) {
      const token = await this.refreshPromise;
      return token.access_token;
    }

    // Check if we have a valid cached token
    if (!forceRefresh && this.isTokenValid()) {
      return this.cachedToken!.token.access_token;
    }

    // Fetch a new token
    try {
      this.refreshPromise = this.fetchNewToken();
      const token = await this.refreshPromise;
      this.refreshPromise = null;
      return token.access_token;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }

  /**
   * Check if the current cached token is valid
   */
  private isTokenValid(): boolean {
    if (!this.cachedToken) {
      return false;
    }

    const now = Date.now();
    const bufferTime = 60 * 1000; // 1 minute buffer before expiration

    return now < this.cachedToken.expiresAt - bufferTime;
  }

  /**
   * Fetch a new JWT token from Supabase Edge Function
   */
  private async fetchNewToken(): Promise<JWTToken> {
    try {
      const response = await fetch(this.supabaseFnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: this.config.clientId,
          secretKey: this.config.secretKey,
        }),
      });

      if (!response.ok) {
        throw new AuthenticationError(
          `HTTP_${response.status}`,
          `Authentication failed: ${response.statusText}`,
          response.status
        );
      }

      const data = (await response.json()) as SupabaseRpcResponse;

      if (data.error) {
        this.handleSupabaseError(data);
      }

      // Handle both 'token' and 'access_token' field names
      const accessToken = data.token || data.access_token;
      if (!accessToken) {
        throw new AuthenticationError(
          'NO_TOKEN_RESPONSE',
          'No token received from authentication server'
        );
      }

      const token = this.createJWTToken({
        access_token: accessToken,
        token_type: data.token_type || 'Bearer',
        expires_in: data.expires_in || 3600, // Default to 1 hour
      });

      this.cacheToken(token);
      return token;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }

      // Handle network or other errors
      throw new NetworkError(
        `Failed to fetch JWT token: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Create a JWTToken object from response
   */
  private createJWTToken(response: {
    access_token: string;
    token_type: string;
    expires_in: number;
  }): JWTToken {
    const now = Date.now();
    const expiresAt = now + response.expires_in * 1000;

    return {
      access_token: response.access_token,
      token_type: response.token_type,
      expires_in: response.expires_in,
      expires_at: expiresAt,
    };
  }

  /**
   * Cache the JWT token with expiration info
   */
  private cacheToken(token: JWTToken): void {
    const now = Date.now();
    const cacheTtl = Math.min(
      this.config.tokenCacheTtl!,
      token.expires_in * 1000
    );

    this.cachedToken = {
      token,
      cachedAt: now,
      expiresAt: now + cacheTtl,
    };
  }

  /**
   * Handle Supabase Edge Function errors
   */
  private handleSupabaseError(error: SupabaseRpcResponse): never {
    const errorMessage = error.error || 'Authentication failed';

    // Map common error patterns to our error types
    if (
      errorMessage.toLowerCase().includes('invalid') &&
      errorMessage.toLowerCase().includes('credential')
    ) {
      throw new InvalidCredentialsError(errorMessage);
    }

    if (errorMessage.toLowerCase().includes('not found')) {
      throw new AuthenticationError(
        'FUNCTION_NOT_FOUND',
        'Authentication function not found. Please ensure the Edge Function is deployed.',
        404
      );
    }

    throw new AuthenticationError(
      'EDGE_FUNCTION_ERROR',
      errorMessage,
      undefined,
      error
    );
  }

  /**
   * Make an authenticated API request with automatic token refresh
   */
  public async makeAuthenticatedRequest<T = any>(
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 30000,
      retries = this.config.maxRetries!,
    } = options;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Get fresh token for each attempt
        const token = await this.getToken(attempt > 0);

        // Prepare request headers
        const requestHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...headers,
        };

        // Prepare request options
        const requestOptions: RequestInit = {
          method,
          headers: requestHeaders,
          signal: AbortSignal.timeout(timeout),
        };

        // Add body for non-GET requests
        if (body && method !== 'GET') {
          requestOptions.body =
            typeof body === 'string' ? body : JSON.stringify(body);
        }

        // Make the request
        const response = await fetch(url, requestOptions);

        // Handle response
        return await this.handleResponse<T>(response);
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (
          error instanceof InvalidCredentialsError ||
          error instanceof ConfigurationError ||
          (error instanceof AuthenticationError &&
            error.code === 'RPC_NOT_FOUND')
        ) {
          break;
        }

        // Handle rate limiting with exponential backoff
        if (error instanceof RateLimitError && attempt < retries) {
          const retryAfter =
            (error.details?.retryAfter || this.config.retryDelay!) *
            Math.pow(2, attempt);
          await this.sleep(retryAfter);
          continue;
        }

        // Handle token expiration
        if (error instanceof TokenExpiredError && attempt < retries) {
          this.cachedToken = null; // Clear cached token
          await this.sleep(this.config.retryDelay! * Math.pow(2, attempt));
          continue;
        }

        // Handle network errors with exponential backoff
        if (error instanceof NetworkError && attempt < retries) {
          await this.sleep(this.config.retryDelay! * Math.pow(2, attempt));
          continue;
        }

        // If it's the last attempt or non-retryable error, break
        if (attempt === retries) {
          break;
        }
      }
    }

    // All retries failed, throw the last error
    throw lastError || new NetworkError('All retry attempts failed');
  }

  /**
   * Handle HTTP response and convert to ApiResponse
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const { status, headers } = response;

    try {
      // Handle different status codes
      if (status === 401) {
        // Clear cached token on 401
        this.cachedToken = null;
        throw new TokenExpiredError('Authentication token expired or invalid');
      }

      if (status === 429) {
        const retryAfter =
          parseInt(response.headers.get('Retry-After') || '60', 10) * 1000;
        throw new RateLimitError('Rate limit exceeded', retryAfter);
      }

      if (status >= 400) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        throw new AuthenticationError(
          `HTTP_${status}`,
          errorData.message || `HTTP ${status} error`,
          status,
          errorData
        );
      }

      // Parse successful response
      const contentType = response.headers.get('content-type');
      let data: T;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      return {
        success: true,
        data,
        status,
        headers,
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return {
          success: false,
          error: error.toAuthError(),
          status,
          headers,
        };
      }

      throw new NetworkError(
        `Failed to process response: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Utility method to sleep for a given number of milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Clear cached token (useful for logout or token invalidation)
   */
  public clearToken(): void {
    this.cachedToken = null;
  }

  /**
   * Get current token info (without the actual token for security)
   */
  public getTokenInfo(): {
    isValid: boolean;
    expiresAt: number | null;
    cachedAt: number | null;
  } {
    return {
      isValid: this.isTokenValid(),
      expiresAt: this.cachedToken?.expiresAt || null,
      cachedAt: this.cachedToken?.cachedAt || null,
    };
  }

  /**
   * Update configuration (will clear cached token)
   */
  public updateConfig(updates: Partial<AuthConfig>): void {
    this.config = { ...this.config, ...updates };
    this.clearToken();
  }

  /**
   * Dispose of resources and clear cache
   */
  public dispose(): void {
    this.clearToken();
    this.refreshPromise = null;
  }
}
