# Integration Guide: Core Authentication Module

This guide shows how to integrate the `@omx-sdk/core` module into your existing OMX SDK packages.

## 1. Update Package Dependencies

First, add the core dependency to your main SDK package:

```json
// packages/omx-sdk/package.json
{
  "dependencies": {
    "@omx-sdk/core": "workspace:*"
    // ... other dependencies
  }
}
```

## 2. Update OMX SDK Configuration

Modify the main SDK configuration to include Supabase settings:

```typescript
// packages/omx-sdk/src/index.ts

// Import the core auth module
import { CoreAuth, AuthConfig } from "@omx-sdk/core";

// Updated SDK configuration interface
export interface OMXConfig {
  clientId: string;
  secretKey: string;

  // Supabase configuration
  supabaseUrl: string;

  // Optional authentication settings
  tokenCacheTtl?: number;
  maxRetries?: number;
  retryDelay?: number;

  // Existing optional settings
  baseUrl?: string;
  timeout?: number;

  // Service-specific configurations
  geotrigger?: Partial<GeotriggerConfig>;
  email?: Partial<EmailConfig>;
  webhook?: Partial<WebhookConfig>;
  beacon?: Partial<BeaconConfig>;
  pushNotification?: Partial<PushConfig>;
}
```

## 3. Update OMXSDK Class

Integrate CoreAuth into the main SDK class:

```typescript
// packages/omx-sdk/src/index.ts

export class OMXSDK {
  private config: OMXConfig;
  private coreAuth: CoreAuth;
  private _geotrigger?: Geotrigger;
  private _email?: EmailClient;
  // ... other services

  constructor(config: OMXConfig) {
    this.config = config;

    // Initialize core authentication
    this.coreAuth = new CoreAuth({
      clientId: config.clientId,
      secretKey: config.secretKey,
      supabaseUrl: config.supabaseUrl,
      supabaseAnonKey: config.supabaseAnonKey,
      tokenCacheTtl: config.tokenCacheTtl,
      maxRetries: config.maxRetries,
      retryDelay: config.retryDelay,
    });
  }

  /**
   * Static method to initialize the SDK
   */
  static async initialize(config: OMXConfig): Promise<OMXSDK> {
    const sdk = new OMXSDK(config);
    await sdk.init();
    return sdk;
  }

  /**
   * Initialize all services
   */
  private async init(): Promise<void> {
    console.log("Initializing OMX SDK...");

    // Get initial JWT token to validate credentials
    try {
      await this.coreAuth.getToken();
      console.log("✅ Authentication successful");
    } catch (error) {
      console.error("❌ Authentication failed:", error);
      throw error;
    }

    // Base configuration with authentication client
    const baseConfig = {
      clientId: this.config.clientId,
      secretKey: this.config.secretKey,
      baseUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      authClient: this.coreAuth, // Pass auth client to services
    };

    // Initialize services with merged configurations
    this._geotrigger = createGeotrigger({
      ...baseConfig,
      ...this.config.geotrigger,
    });

    this._email = createEmailClient({
      ...baseConfig,
      ...this.config.email,
    });

    // ... initialize other services

    console.log("OMX SDK initialized successfully");
  }

  /**
   * Get the core authentication instance
   */
  get auth(): CoreAuth {
    return this.coreAuth;
  }

  /**
   * Make an authenticated API request
   */
  async makeAuthenticatedRequest<T = any>(
    url: string,
    options?: import("@omx-sdk/core").ApiRequestOptions
  ): Promise<import("@omx-sdk/core").ApiResponse<T>> {
    return this.coreAuth.makeAuthenticatedRequest<T>(url, options);
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<OMXConfig>): void {
    this.config = { ...this.config, ...updates };

    // Update auth config if auth-related settings changed
    if (
      updates.clientId ||
      updates.secretKey ||
      updates.supabaseUrl ||
      updates.supabaseAnonKey
    ) {
      this.coreAuth.updateConfig({
        clientId: updates.clientId || this.config.clientId,
        secretKey: updates.secretKey || this.config.secretKey,
        supabaseUrl: updates.supabaseUrl || this.config.supabaseUrl,
        supabaseAnonKey: updates.supabaseAnonKey || this.config.supabaseAnonKey,
        tokenCacheTtl: updates.tokenCacheTtl,
        maxRetries: updates.maxRetries,
        retryDelay: updates.retryDelay,
      });
    }

    // Reset service instances to pick up new config
    this._geotrigger = undefined;
    this._email = undefined;
    // ... reset other services
  }

  /**
   * Cleanup and dispose of resources
   */
  dispose(): void {
    // Stop any ongoing operations
    if (this._geotrigger?.isMonitoring()) {
      this._geotrigger.stopMonitoring();
    }

    // ... cleanup other services

    // Dispose auth client
    this.coreAuth.dispose();

    // Clear instances
    this._geotrigger = undefined;
    this._email = undefined;
    // ... clear other services
  }
}
```

## 4. Update Sub-Package Configurations

Update individual packages to use the CoreAuth client:

```typescript
// packages/email/src/index.ts

import { CoreAuth } from "@omx-sdk/core";

export interface EmailConfig {
  clientId: string;
  secretKey: string;
  baseUrl?: string;
  timeout?: number;
  defaultFrom?: string;
  authClient?: CoreAuth; // Optional auth client for authenticated requests
}

export class EmailClient {
  private config: EmailConfig;
  private authClient?: CoreAuth;

  constructor(config: EmailConfig) {
    this.config = config;
    this.authClient = config.authClient;
  }

  async send(message: EmailMessage): Promise<EmailResponse> {
    const url = `${this.config.baseUrl || "https://api.oxinion.com"}/email/send`;

    if (this.authClient) {
      // Use authenticated request if auth client is available
      const response = await this.authClient.makeAuthenticatedRequest(url, {
        method: "POST",
        body: message,
      });

      return {
        success: response.success,
        messageId: response.data?.messageId,
        error: response.error?.message,
      };
    } else {
      // Fallback to direct API call with client credentials
      console.log("API Call to", url, message);
      // ... existing implementation
    }
  }
}
```

## 5. Updated Example Usage

With the integrated authentication, your examples become simpler:

```typescript
// examples/example.ts

import OMX from "omx-sdk";

const config = {
  clientId: "your-client-id",
  secretKey: "your-secret-key",
  supabaseUrl: "https://your-project.supabase.co",
  supabaseAnonKey: "your-supabase-anon-key",
  baseUrl: "https://api.oxinion.com", // Optional, for your API endpoints
};

async function main() {
  try {
    // Initialize SDK (will authenticate automatically)
    const omx = await OMX.initialize(config);
    console.log("🚀 OMX SDK initialized and authenticated");

    // All service calls now use authenticated requests automatically
    const emailResult = await omx.email.send({
      to: "user@example.com",
      subject: "Test Email",
      body: "Hello from OMX SDK with authentication!",
    });

    // Direct authenticated API calls
    const customApiResponse = await omx.makeAuthenticatedRequest(
      "/api/custom-endpoint",
      {
        method: "POST",
        body: { data: "custom data" },
      }
    );

    // Access auth info
    const tokenInfo = omx.auth.getTokenInfo();
    console.log("Token expires at:", new Date(tokenInfo.expiresAt!));
  } catch (error) {
    console.error("❌ SDK initialization or operation failed:", error);
  }
}

main();
```

## 6. Environment Configuration

Create environment-specific configurations:

```typescript
// config/environments.ts

export const environments = {
  development: {
    supabaseUrl: "https://dev-project.supabase.co",
    supabaseAnonKey: "dev-anon-key",
    baseUrl: "https://dev-api.yourdomain.com",
  },
  staging: {
    supabaseUrl: "https://staging-project.supabase.co",
    supabaseAnonKey: "staging-anon-key",
    baseUrl: "https://staging-api.yourdomain.com",
  },
  production: {
    supabaseUrl: "https://prod-project.supabase.co",
    supabaseAnonKey: "prod-anon-key",
    baseUrl: "https://api.yourdomain.com",
  },
};

export function getEnvironmentConfig(env: string = "development") {
  return (
    environments[env as keyof typeof environments] || environments.development
  );
}
```

## 7. Error Handling in Services

Update your services to handle authentication errors:

```typescript
// packages/webhook/src/index.ts

import {
  AuthenticationError,
  InvalidCredentialsError,
  NetworkError,
} from "@omx-sdk/core";

export class WebhookClient {
  // ... existing code

  async createSubscription(
    url: string,
    events: string[],
    secret?: string
  ): Promise<WebhookSubscription> {
    try {
      if (this.authClient) {
        const response = await this.authClient.makeAuthenticatedRequest(
          "/api/webhooks/subscribe",
          {
            method: "POST",
            body: { url, events, secret },
          }
        );

        if (response.success) {
          return response.data;
        } else {
          throw new Error(
            response.error?.message || "Failed to create webhook subscription"
          );
        }
      }

      // Fallback implementation...
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new Error(
          "Invalid credentials. Please check your clientId and secretKey."
        );
      } else if (error instanceof NetworkError) {
        throw new Error(
          "Network error while creating webhook subscription. Please try again."
        );
      } else {
        throw error;
      }
    }
  }
}
```

## 8. Testing with Authentication

Update your tests to mock the authentication:

```typescript
// packages/omx-sdk/src/__tests__/omx-sdk.test.ts

import { OMXSDK } from "../index";
import { CoreAuth } from "@omx-sdk/core";

// Mock CoreAuth
jest.mock("@omx-sdk/core");

describe("OMXSDK", () => {
  beforeEach(() => {
    const mockCoreAuth = {
      getToken: jest.fn().mockResolvedValue("mock-token"),
      makeAuthenticatedRequest: jest.fn().mockResolvedValue({
        success: true,
        data: { result: "success" },
      }),
      dispose: jest.fn(),
    };

    (CoreAuth as jest.Mock).mockImplementation(() => mockCoreAuth);
  });

  it("should initialize with authentication", async () => {
    const config = {
      clientId: "test-client",
      secretKey: "test-secret",
      supabaseUrl: "https://test.supabase.co",
      supabaseAnonKey: "test-anon-key",
    };

    const sdk = await OMXSDK.initialize(config);
    expect(sdk).toBeInstanceOf(OMXSDK);
  });
});
```

This integration guide provides a complete blueprint for incorporating the CoreAuth module into your existing OMX SDK architecture while maintaining backward compatibility and adding powerful authentication capabilities.
