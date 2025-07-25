// Re-export all individual packages
export * from '@omx-sdk/beacon';
export * from '@omx-sdk/email';
export * from '@omx-sdk/geotrigger';
export * from '@omx-sdk/push-notification';
export * from '@omx-sdk/webhook';

// Import types and classes for the unified SDK
import {
  BeaconConfig,
  BeaconManager,
  createBeaconManager,
} from '@omx-sdk/beacon';
import { initClient } from '@omx-sdk/core';
import { EmailClient, EmailConfig, createEmailClient } from '@omx-sdk/email';
import {
  GeoTrigger,
  GeotriggerConfig,
  createGeotrigger,
} from '@omx-sdk/geotrigger';
import {
  PushConfig,
  PushNotificationManager,
  createPushNotificationManager,
} from '@omx-sdk/push-notification';
import {
  WebhookClient,
  WebhookConfig,
  createWebhookClient,
} from '@omx-sdk/webhook';

// Unified SDK configuration
export interface OMXConfig {
  clientId: string;
  secretKey: string;
  baseUrl?: string;
  timeout?: number;

  // Service-specific configurations
  geotrigger?: Partial<GeotriggerConfig>;
  email?: Partial<EmailConfig>;
  webhook?: Partial<WebhookConfig>;
  beacon?: Partial<BeaconConfig>;
  pushNotification?: Partial<PushConfig>;
}

// Unified SDK class
export class OMXSDK {
  private config: OMXConfig;
  private _geotrigger?: GeoTrigger;
  private _email?: EmailClient;
  private _webhook?: WebhookClient;
  private _beacon?: BeaconManager;
  private _pushNotification?: PushNotificationManager;
  private _jwtToken?: string; // <-- Add JWT token storage

  constructor(config: OMXConfig) {
    this.config = config;
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
   * Fetch JWT token from Edge Function
   */
  private async _fetchJwtToken(): Promise<void> {
    const edgeUrl =
      this.config.baseUrl?.replace(/\/$/, '') ||
      'https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1/create-jwt-token';
    const url = edgeUrl.includes('/create-jwt-token')
      ? edgeUrl
      : edgeUrl + '/functions/v1/create-jwt-token';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsaGlsaWRuc3liaGZkbXdxc3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MjM4OTgsImV4cCI6MjA2MDA5OTg5OH0.KZGJMcm2V7aW1tH7U0skvipE7h53212MRaaSm2kS84c',
        apikey:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsaGlsaWRuc3liaGZkbXdxc3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MjM4OTgsImV4cCI6MjA2MDA5OTg5OH0.KZGJMcm2V7aW1tH7U0skvipE7h53212MRaaSm2kS84c',
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
        data.error || 'Failed to fetch JWT token from Edge Function.'
      );
    }
  }

  /**
   * Initialize all services
   */
  private async init(): Promise<void> {
    console.log('Initializing OMX SDK...');
    await this._fetchJwtToken(); // <-- Fetch JWT first

    // Initialize Supabase client with JWT token
    if (this._jwtToken) {
      initClient(this._jwtToken);
      console.log('✅ OMX client initialized with JWT token');
    } else {
      throw new Error('JWT token is required for initialization');
    }

    // Base configuration with defaults from main config
    const baseConfig = {
      clientId: this.config.clientId,
      secretKey: this.config.secretKey,
      baseUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      jwtToken: this._jwtToken, // <-- Pass JWT to services
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

    this._pushNotification = createPushNotificationManager({
      ...baseConfig,
      ...this.config.pushNotification,
    });

    console.log('OMX SDK initialized successfully');
  }

  /**
   * Get geotrigger client instance
   */
  get geotrigger(): GeoTrigger {
    if (!this._geotrigger) {
      throw new Error(
        'Geotrigger service not initialized. Call OMX.initialize() first.'
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
        'Email service not initialized. Call OMX.initialize() first.'
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
        'Webhook service not initialized. Call OMX.initialize() first.'
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
        'Beacon service not initialized. Call OMX.initialize() first.'
      );
    }
    return this._beacon;
  }

  /**
   * Get push notification manager instance
   */
  get pushNotification(): PushNotificationManager {
    if (!this._pushNotification) {
      throw new Error(
        'Push notification service not initialized. Call OMX.initialize() first.'
      );
    }
    return this._pushNotification;
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

    if (this._pushNotification) {
      promises.push(this.pushNotification.initialize());
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
    this._pushNotification = undefined;
  }

  /**
   * Check health status of all services
   */
  async healthCheck(): Promise<{
    overall: 'healthy' | 'degraded' | 'unhealthy';
    services: {
      geotrigger: 'healthy' | 'unhealthy';
      email: 'healthy' | 'unhealthy';
      webhook: 'healthy' | 'unhealthy';
      beacon: 'healthy' | 'unhealthy';
      pushNotification: 'healthy' | 'unhealthy';
    };
  }> {
    const results = {
      geotrigger: 'healthy' as 'healthy' | 'unhealthy',
      email: 'healthy' as 'healthy' | 'unhealthy',
      webhook: 'healthy' as 'healthy' | 'unhealthy',
      beacon: 'healthy' as 'healthy' | 'unhealthy',
      pushNotification: 'healthy' as 'healthy' | 'unhealthy',
    };

    // Simple health checks
    try {
      // Check if services can be instantiated
      this.geotrigger;
      this.email;
      this.webhook;
      this.beacon;
      this.pushNotification;

      // Check browser compatibility
      if (!PushNotificationManager.isSupported()) {
        results.pushNotification = 'unhealthy';
      }

      // Check geolocation support
      if (!navigator.geolocation) {
        results.geotrigger = 'unhealthy';
      }
    } catch (error) {
      console.error('Health check failed:', error);
      // Mark relevant services as unhealthy based on error
    }

    const unhealthyCount = Object.values(results).filter(
      (status) => status === 'unhealthy'
    ).length;
    const overall =
      unhealthyCount === 0
        ? 'healthy'
        : unhealthyCount <= 2
          ? 'degraded'
          : 'unhealthy';

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
    email: ReturnType<EmailClient['getStats']> | null;
    webhook: { subscriptions: number };
    beacon: ReturnType<BeaconManager['getAnalytics']> | null;
    pushNotification: ReturnType<
      PushNotificationManager['getAnalytics']
    > | null;
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
      pushNotification: this._pushNotification?.getAnalytics() || null,
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
    this._pushNotification = undefined;
  }

  /**
   * Get the current JWT token (for debugging/testing)
   */
  public getJwtToken(): string | undefined {
    return this._jwtToken;
  }
}

// Export convenience function to create SDK instance
export function createOMXSDK(config: OMXConfig): OMXSDK {
  return new OMXSDK(config);
}

// Export version information
export const VERSION = '1.0.0';

// Export default as the main SDK class
export default OMXSDK;
