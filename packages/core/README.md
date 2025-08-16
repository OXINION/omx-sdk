# @omx-sdk/core

Core module for OMX SDK providing authentication, configuration, and shared utilities across all OMX services.

## Features

- 🔐 **JWT Token Management** - Automatic fetching and caching of JWT tokens from Supabase Edge Function
- 🔄 **Automatic Token Refresh** - Handles token expiration and renewal seamlessly
- 🚀 **Authenticated API Requests** - Built-in HTTP client with automatic token injection
- 🛡️ **Comprehensive Error Handling** - Graceful handling of auth errors, network issues, and rate limiting
- ⚡ **Caching & Performance** - Intelligent token caching with configurable TTL
- 🔧 **TypeScript Support** - Full type safety and IntelliSense support
- 🌐 **Retry Logic** - Exponential backoff and configurable retry strategies
- 🔒 **Secure by Design** - No sensitive Supabase credentials exposed to client

## Installation

```bash
npm install @omx-sdk/core
# or
pnpm add @omx-sdk/core
# or
yarn add @omx-sdk/core
```

## Quick Start

### 1. Supabase Edge Function Setup

Create a Supabase Edge Function at `/functions/create-jwt-token/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const { clientId, secretKey } = await req.json();

    // Validate credentials against your database
    const { data: business, error } = await supabaseClient
      .from("businesses")
      .select("*")
      .eq("client_id", clientId)
      .eq("secret_key", secretKey)
      .eq("is_active", true)
      .single();

    if (error || !business) {
      return new Response(
        JSON.stringify({ error: "Invalid client credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate JWT token
    const payload = {
      sub: business.id,
      business_id: business.id,
      client_id: business.client_id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      iss: "omx-auth",
      scope: business.permissions,
    };

    const token = await jwt.sign(payload, Deno.env.get("JWT_SECRET"));

    return new Response(
      JSON.stringify({
        token: token,
        token_type: "Bearer",
        expires_in: 3600,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

### 2. Basic Usage

```typescript
import { CoreAuth, AuthConfig } from "@omx-sdk/core";

// Configure authentication
const config: AuthConfig = {
  clientId: "your-business-client-id",
  secretKey: "your-business-secret-key",
  supabaseFnUrl:
    "https://your-project.supabase.co/functions/v1/create-jwt-token", // Optional: uses default if not provided
  tokenCacheTtl: 50 * 60 * 1000, // Cache for 50 minutes (optional)
};

// Initialize authentication
const auth = new CoreAuth(config);

// Get JWT token (automatically cached)
const token = await auth.getToken();

// Make authenticated API requests
const response = await auth.makeAuthenticatedRequest(
  "https://api.yourdomain.com/data",
  {
    method: "GET",
  }
);

if (response.success) {
  console.log("Data:", response.data);
} else {
  console.error("Error:", response.error);
}
```

## API Reference

### CoreAuth Class

#### Constructor

```typescript
new CoreAuth(config: AuthConfig)
```

#### Methods

##### getToken(forceRefresh?: boolean): Promise<string>

Gets a valid JWT token, automatically handling caching and refresh.

```typescript
// Get cached token (if valid)
const token = await auth.getToken();

// Force refresh token
const freshToken = await auth.getToken(true);
```

##### makeAuthenticatedRequest<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>>

Makes an authenticated HTTP request with automatic token handling.

```typescript
const response = await auth.makeAuthenticatedRequest("/api/users", {
  method: "POST",
  body: { name: "John Doe", email: "john@example.com" },
  timeout: 10000,
  retries: 3,
});
```

##### getTokenInfo(): TokenInfo

Returns information about the current cached token.

```typescript
const info = auth.getTokenInfo();
console.log("Token valid:", info.isValid);
console.log("Expires at:", new Date(info.expiresAt));
```

##### clearToken(): void

Clears the cached token (useful for logout).

```typescript
auth.clearToken();
```

##### updateConfig(updates: Partial<AuthConfig>): void

Updates the configuration and clears cached tokens.

```typescript
auth.updateConfig({
  clientId: "new-client-id",
  secretKey: "new-secret-key",
});
```

##### dispose(): void

Cleans up resources and clears cache.

```typescript
auth.dispose();
```

### Configuration Options

```typescript
interface AuthConfig {
  clientId: string; // Business client ID
  secretKey: string; // Business secret key
  supabaseFnUrl?: string; // Supabase Edge Function URL (optional - uses default production URL)
  tokenCacheTtl?: number; // Token cache TTL in ms (default: 55 minutes)
  maxRetries?: number; // Max retry attempts (default: 3)
  retryDelay?: number; // Retry delay in ms (default: 1000)
}
```

### API Request Options

```typescript
interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number; // Request timeout in ms
  retries?: number; // Override default retry count
}
```

## Error Handling

The module provides comprehensive error handling with specific error types:

```typescript
import {
  InvalidCredentialsError,
  TokenExpiredError,
  NetworkError,
  RateLimitError,
  ConfigurationError,
} from "@omx-sdk/core";

try {
  const response = await auth.makeAuthenticatedRequest("/api/data");
} catch (error) {
  if (error instanceof InvalidCredentialsError) {
    console.error("Invalid credentials:", error.message);
  } else if (error instanceof TokenExpiredError) {
    console.error("Token expired:", error.message);
  } else if (error instanceof NetworkError) {
    console.error("Network error:", error.message);
  } else if (error instanceof RateLimitError) {
    console.error("Rate limited. Retry after:", error.details?.retryAfter);
  }
}
```

## Examples

### Example 1: Basic Token Management

```typescript
import { CoreAuth } from "@omx-sdk/core";

const auth = new CoreAuth({
  clientId: "business-123",
  secretKey: "secret-456",
  supabaseFnUrl:
    "https://your-project.supabase.co/functions/v1/create-jwt-token", // Optional
});

// Get token
const token = await auth.getToken();

// Check token status
const tokenInfo = auth.getTokenInfo();
console.log("Token expires:", new Date(tokenInfo.expiresAt));
```

### Example 2: Making API Requests

```typescript
// GET request
const users = await auth.makeAuthenticatedRequest("/api/users");

// POST request with data
const newUser = await auth.makeAuthenticatedRequest("/api/users", {
  method: "POST",
  body: {
    name: "John Doe",
    email: "john@example.com",
  },
});

// PUT request with custom headers
const updated = await auth.makeAuthenticatedRequest("/api/users/123", {
  method: "PUT",
  headers: {
    "X-Custom-Header": "value",
  },
  body: { name: "Jane Doe" },
});
```

### Example 3: Error Handling

```typescript
try {
  const response = await auth.makeAuthenticatedRequest("/api/protected");

  if (response.success) {
    console.log("Success:", response.data);
  } else {
    console.error("API Error:", response.error);
  }
} catch (error) {
  if (error instanceof NetworkError) {
    console.error("Network issue - retrying...");
    // Implement retry logic
  } else if (error instanceof RateLimitError) {
    const waitTime = error.details?.retryAfter || 60000;
    console.log(`Rate limited - waiting ${waitTime}ms`);
    // Wait and retry
  }
}
```

## Advanced Usage

### Custom Retry Logic

```typescript
const response = await auth.makeAuthenticatedRequest("/api/critical-data", {
  method: "POST",
  body: criticalData,
  timeout: 30000, // 30 second timeout
  retries: 5, // 5 retry attempts
});
```

### Token Refresh Monitoring

```typescript
// Monitor token status
setInterval(() => {
  const tokenInfo = auth.getTokenInfo();
  if (!tokenInfo.isValid) {
    console.log("Token expired, will refresh on next request");
  }
}, 60000); // Check every minute
```

### Multiple Business Configurations

```typescript
const businessAuth = new Map();

// Configure multiple businesses
const businesses = [
  { id: "business1", clientId: "client1", secretKey: "secret1" },
  { id: "business2", clientId: "client2", secretKey: "secret2" },
];

businesses.forEach((business) => {
  businessAuth.set(
    business.id,
    new CoreAuth({
      clientId: business.clientId,
      secretKey: business.secretKey,
      supabaseUrl: "https://project.supabase.co",
    })
  );
});

// Use specific business auth
const auth = businessAuth.get("business1");
const data = await auth.makeAuthenticatedRequest("/api/business-data");
```

## Best Practices

1. **Edge Function Security**: Use Supabase Edge Functions to keep sensitive database credentials secure
2. **Token Caching**: Use appropriate cache TTL (default 55 minutes recommended)
3. **Error Handling**: Always handle specific error types appropriately
4. **Resource Cleanup**: Call `dispose()` when done to clean up resources
5. **Environment Configuration**: Use different Edge Function URLs for dev/staging/production
6. **Rate Limiting**: Implement proper backoff strategies for rate-limited APIs
7. **Monitoring**: Log authentication failures and token refresh events

## Security Features

- 🔒 **No Exposed Credentials**: Supabase URL and keys are not exposed to client
- 🛡️ **Edge Function Isolation**: Authentication logic runs in secure Supabase environment
- 🔐 **JWT Token Security**: Short-lived tokens with automatic refresh
- 🚫 **No Client-Side Secrets**: All sensitive operations happen server-side

## Requirements

- Node.js 16+ or modern browser environment
- Supabase project with RPC function configured
- TypeScript 4.5+ (for TypeScript projects)

## License

MIT

## Support

For issues and questions, please visit our [GitHub repository](https://github.com/your-org/omx-sdk).
