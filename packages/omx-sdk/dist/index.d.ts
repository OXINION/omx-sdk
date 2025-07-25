export * from '@omx-sdk/beacon';
export * from '@omx-sdk/email';
export * from '@omx-sdk/geotrigger';
export * from '@omx-sdk/push-notification';
export * from '@omx-sdk/webhook';
import { BeaconConfig, BeaconManager } from '@omx-sdk/beacon';
import { EmailClient, EmailConfig } from '@omx-sdk/email';
import { GeoTrigger, GeotriggerConfig } from '@omx-sdk/geotrigger';
import { PushConfig, PushNotificationManager } from '@omx-sdk/push-notification';
import { WebhookClient, WebhookConfig } from '@omx-sdk/webhook';
export interface OMXConfig {
    clientId: string;
    secretKey: string;
    baseUrl?: string;
    timeout?: number;
    geotrigger?: Partial<GeotriggerConfig>;
    email?: Partial<EmailConfig>;
    webhook?: Partial<WebhookConfig>;
    beacon?: Partial<BeaconConfig>;
    pushNotification?: Partial<PushConfig>;
}
export declare class OMXSDK {
    private config;
    private _geotrigger?;
    private _email?;
    private _webhook?;
    private _beacon?;
    private _pushNotification?;
    private _jwtToken?;
    constructor(config: OMXConfig);
    /**
     * Static method to initialize the SDK
     */
    static initialize(config: OMXConfig): Promise<OMXSDK>;
    /**
     * Fetch JWT token from Edge Function
     */
    private _fetchJwtToken;
    /**
     * Initialize all services
     */
    private init;
    /**
     * Get geotrigger client instance
     */
    get geotrigger(): GeoTrigger;
    /**
     * Get email client instance
     */
    get email(): EmailClient;
    /**
     * Get webhook client instance
     */
    get webhook(): WebhookClient;
    /**
     * Get beacon manager instance
     */
    get beacon(): BeaconManager;
    /**
     * Get push notification manager instance
     */
    get pushNotification(): PushNotificationManager;
    /**
     * Initialize all services that require initialization
     */
    initialize(): Promise<void>;
    /**
     * Get the current configuration
     */
    getConfig(): Readonly<OMXConfig>;
    /**
     * Update configuration
     */
    updateConfig(updates: Partial<OMXConfig>): void;
    /**
     * Check health status of all services
     */
    healthCheck(): Promise<{
        overall: 'healthy' | 'degraded' | 'unhealthy';
        services: {
            geotrigger: 'healthy' | 'unhealthy';
            email: 'healthy' | 'unhealthy';
            webhook: 'healthy' | 'unhealthy';
            beacon: 'healthy' | 'unhealthy';
            pushNotification: 'healthy' | 'unhealthy';
        };
    }>;
    /**
     * Get aggregated analytics from all services
     */
    getAnalytics(): {
        geotrigger: {
            isMonitoring: boolean;
        };
        email: ReturnType<EmailClient['getStats']> | null;
        webhook: {
            subscriptions: number;
        };
        beacon: ReturnType<BeaconManager['getAnalytics']> | null;
        pushNotification: ReturnType<PushNotificationManager['getAnalytics']> | null;
    };
    /**
     * Cleanup and dispose of resources
     */
    dispose(): void;
    /**
     * Get the current JWT token (for debugging/testing)
     */
    getJwtToken(): string | undefined;
}
export declare function createOMXSDK(config: OMXConfig): OMXSDK;
export declare const VERSION = "1.0.0";
export default OMXSDK;
//# sourceMappingURL=index.d.ts.map