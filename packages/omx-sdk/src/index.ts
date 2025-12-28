// Re-export all individual packages
export * from "@omx-sdk/beacon";
export * from "@omx-sdk/campaign";
export * from "@omx-sdk/email";
export * from "@omx-sdk/geotrigger";
export * from "@omx-sdk/notification";
export * from "@omx-sdk/webhook";

// Import types and classes for the unified SDK
import {
  BeaconConfig,
  BeaconManager,
  createBeaconManager,
} from "@omx-sdk/beacon";
import { CampaignClient, createCampaignClient } from "@omx-sdk/campaign";
import { initClient } from "@omx-sdk/core";
import { EmailClient, EmailConfig, createEmailClient } from "@omx-sdk/email";
import { GeotriggerClient, createGeotrigger } from "@omx-sdk/geotrigger";
import {
  NotificationClient,
  NotificationOptions,
  createNotificationClient,
} from "@omx-sdk/notification";
import {
  WebhookClient,
  WebhookConfig,
  createWebhookClient,
} from "@omx-sdk/webhook";

// Unified SDK configuration
// Unified SDK configuration
export interface OMXConfig {
  clientId: string;
  secretKey: string;
  baseUrl?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  timeout?: number;

  // Service-specific configurations
  geotrigger?: any;
  email?: Partial<EmailConfig>;
  webhook?: Partial<WebhookConfig>;
  beacon?: Partial<BeaconConfig>;
  notification?: Partial<NotificationOptions>;
  campaign?: { teamId?: string; baseUrl?: string };
}

// Unified SDK class
export class OMXClient {
  private config: OMXConfig;
  private _geotrigger?: GeotriggerClient;
  private _email?: EmailClient;
  private _webhook?: WebhookClient;
  private _beacon?: BeaconManager;
  private _notification?: NotificationClient;
  private _campaign?: CampaignClient;
  private _jwtToken?: string;

  constructor(config: OMXConfig) {
    this.config = config;
  }

  /**
   * Static method to initialize the SDK
   */
  static async initialize(config: OMXConfig): Promise<OMXClient> {
    const sdk = new OMXClient(config);
    await sdk.init();
    return sdk;
  }

  /**
   * Fetch JWT token from Edge Function
   */
  private async _fetchJwtToken(): Promise<void> {
    const defaultSupabaseUrl = "https://blhilidnsybhfdmwqsrx.supabase.co";
    const defaultAnonKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsaGlsaWRuc3liaGZkbXdxc3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MjM4OTgsImV4cCI6MjA2MDA5OTg5OH0.KZGJMcm2V7aW1tH7U0skvipE7h53212MRaaSm2kS84c";

    const sUrl = this.config.supabaseUrl || defaultSupabaseUrl;
    const sAnonKey = this.config.supabaseAnonKey || defaultAnonKey;

    const base =
      this.config.baseUrl?.replace(/\/$/, "") || sUrl.replace(/\/$/, "");

    // Construct the edge function URL
    // If baseUrl is provided and looks like a Supabase project URL, use it
    let edgeUrl: string;
    if (base.includes(".supabase.co")) {
      edgeUrl = `${base}/functions/v1/create-jwt-token`;
    } else {
      // If it's a custom domain, assume the standard path
      edgeUrl = `${base}/create-jwt-token`;
    }

    const res = await fetch(edgeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sAnonKey}`,
        apikey: sAnonKey,
      },
      body: JSON.stringify({
        clientId: this.config.clientId,
        secretKey: this.config.secretKey,
      }),
    });

    const data = await res.json();
    if (res.ok && data.token) {
      this._jwtToken = data.token;
    } else {
      throw new Error(
        data.error || `Failed to fetch JWT token from ${edgeUrl}`
      );
    }
  }

  /**
   * Initialize all services
   */
  private async init(): Promise<void> {
    console.log("Initializing OMX SDK...");
    await this._fetchJwtToken();

    // Initialize Supabase client with JWT token
    if (this._jwtToken) {
      initClient(this._jwtToken, {
        supabaseUrl: this.config.supabaseUrl,
        anonKey: this.config.supabaseAnonKey,
      });
      console.log("✅ OMX client initialized with JWT token");
    } else {
      throw new Error("JWT token is required for initialization");
    }

    // Base configuration with defaults from main config
    const baseConfig = {
      clientId: this.config.clientId,
      secretKey: this.config.secretKey,
      baseUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      jwtToken: this._jwtToken,
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

    this._webhook = createWebhookClient({
      ...baseConfig,
      ...this.config.webhook,
    });

    this._beacon = createBeaconManager({
      ...baseConfig,
      ...this.config.beacon,
    });

    this._notification = createNotificationClient(() => this._jwtToken || "", {
      baseUrl:
        this.config.baseUrl ||
        (this.config.supabaseUrl
          ? `${this.config.supabaseUrl}/functions/v1/notification-service`
          : "https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1/notification-service"),
      ...this.config.notification,
    });

    this._campaign = createCampaignClient({
      clientId: this.config.clientId,
      secretKey: this.config.secretKey,
      ...this.config.campaign,
      baseUrl:
        this.config.campaign?.baseUrl ||
        this.config.baseUrl ||
        this.config.supabaseUrl,
    });

    console.log("OMX SDK initialized successfully");
  }

  /**
   * Get geotrigger client instance
   */
  get geotrigger(): GeotriggerClient {
    if (!this._geotrigger) {
      throw new Error(
        "Geotrigger service not initialized. Call OMX.initialize() first."
      );
    }
    return this._geotrigger;
  }

  /**
   * Get email client instance
   */
  get email(): EmailClient {
    if (!this._email) {
      throw new Error(
        "Email service not initialized. Call OMX.initialize() first."
      );
    }
    return this._email;
  }

  /**
   * Get webhook client instance
   */
  get webhook(): WebhookClient {
    if (!this._webhook) {
      throw new Error(
        "Webhook service not initialized. Call OMX.initialize() first."
      );
    }
    return this._webhook;
  }

  /**
   * Get beacon manager instance
   */
  get beacon(): BeaconManager {
    if (!this._beacon) {
      throw new Error(
        "Beacon service not initialized. Call OMX.initialize() first."
      );
    }
    return this._beacon;
  }

  /**
   * Get notification client instance
   */
  get notification(): NotificationClient {
    if (!this._notification) {
      throw new Error(
        "Notification service not initialized. Call OMX.initialize() first."
      );
    }
    return this._notification;
  }

  /**
   * Get campaign client instance
   */
  get campaign(): CampaignClient {
    if (!this._campaign) {
      throw new Error(
        "Campaign service not initialized. Call OMX.initialize() first."
      );
    }
    return this._campaign;
  }

  /**
   * Initialize all services that require initialization
   */
  async initialize(): Promise<void> {
    const promises: Promise<void>[] = [];

    // Initialize services that require async initialization
    if (this._beacon) {
      promises.push(this.beacon.initialize());
    }

    // Wait for all initializations to complete
    await Promise.all(promises);
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<OMXConfig> {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<OMXConfig>): void {
    this.config = { ...this.config, ...updates };

    // Reset instances to pick up new config
    this._geotrigger = undefined;
    this._email = undefined;
    this._webhook = undefined;
    this._beacon = undefined;
    this._notification = undefined;
  }

  /**
   * Check health status of all services
   */
  async healthCheck(): Promise<{
    overall: "healthy" | "degraded" | "unhealthy";
    services: {
      geotrigger: "healthy" | "unhealthy";
      email: "healthy" | "unhealthy";
      webhook: "healthy" | "unhealthy";
      beacon: "healthy" | "unhealthy";
      notification: "healthy" | "unhealthy";
    };
  }> {
    const results = {
      geotrigger: "healthy" as "healthy" | "unhealthy",
      email: "healthy" as "healthy" | "unhealthy",
      webhook: "healthy" as "healthy" | "unhealthy",
      beacon: "healthy" as "healthy" | "unhealthy",
      notification: "healthy" as "healthy" | "unhealthy",
      campaign: "healthy" as "healthy" | "unhealthy",
    };

    // Simple health checks
    try {
      // Check if services can be instantiated
      this.geotrigger;
      this.email;
      this.webhook;
      this.beacon;
      this.notification;
      this.campaign;

      // Check geolocation support
      if (!navigator.geolocation) {
        results.geotrigger = "unhealthy";
      }
    } catch (error) {
      console.error("Health check failed:", error);
      // Mark relevant services as unhealthy based on error
    }

    const unhealthyCount = Object.values(results).filter(
      (status) => status === "unhealthy"
    ).length;
    const overall =
      unhealthyCount === 0
        ? "healthy"
        : unhealthyCount <= 2
          ? "degraded"
          : "unhealthy";

    return {
      overall,
      services: results,
    };
  }

  /**
   * Get aggregated analytics from all services
   */
  getAnalytics(): {
    geotrigger: { isMonitoring: boolean };
    email: any | null;
    webhook: { subscriptions: number };
    beacon: any | null;
    notification: any | null;
    campaign: any | null;
  } {
    return {
      geotrigger: {
        isMonitoring: this._geotrigger?.isMonitoring() || false,
      },
      email: null, // Email stats require API call
      webhook: {
        subscriptions: this._webhook?.getSubscriptions().length || 0,
      },
      beacon: this._beacon?.getAnalytics() || null,
      notification: null, // Notification stats require API call
      campaign: null, // Campaign stats require API call
    };
  }

  /**
   * Cleanup and dispose of resources
   */
  dispose(): void {
    // Stop any ongoing operations
    if (this._geotrigger?.isMonitoring()) {
      this._geotrigger.stopMonitoring();
    }

    if (this._beacon?.isCurrentlyScanning()) {
      this._beacon.stopScanning();
    }

    // Clear instances
    this._geotrigger = undefined;
    this._email = undefined;
    this._webhook = undefined;
    this._beacon = undefined;
    this._notification = undefined;
    this._campaign = undefined;
  }

  /**
   * Get the current JWT token (for debugging/testing)
   */
  public getJwtToken(): string | undefined {
    return this._jwtToken;
  }
}

// Export convenience function to create SDK instance
export function createOMXClient(config: OMXConfig): OMXClient {
  return new OMXClient(config);
}

// Alias for OMXClient
export { OMXClient as omxClient };

// Export version information
export const VERSION = "1.0.2";

// Export default as the main SDK class
export default OMXClient;
