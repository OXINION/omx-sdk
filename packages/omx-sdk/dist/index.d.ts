export * from "@omx-sdk/beacon";
export * from "@omx-sdk/campaign";
export * from "@omx-sdk/email";
export * from "@omx-sdk/geotrigger";
export * from "@omx-sdk/notification";
export * from "@omx-sdk/webhook";
import { BeaconConfig, BeaconManager } from "@omx-sdk/beacon";
import { CampaignClient } from "@omx-sdk/campaign";
import { EmailClient, EmailConfig } from "@omx-sdk/email";
import { GeotriggerClient } from "@omx-sdk/geotrigger";
import { NotificationClient, NotificationOptions } from "@omx-sdk/notification";
import { WebhookClient, WebhookConfig } from "@omx-sdk/webhook";
export interface OMXConfig {
    clientId: string;
    secretKey: string;
    baseUrl?: string;
    supabaseUrl?: string;
    supabaseAnonKey?: string;
    timeout?: number;
    geotrigger?: any;
    email?: Partial<EmailConfig>;
    webhook?: Partial<WebhookConfig>;
    beacon?: Partial<BeaconConfig>;
    notification?: Partial<NotificationOptions>;
    campaign?: {
        teamId?: string;
        baseUrl?: string;
    };
}
export declare class OMXClient {
    private config;
    private _geotrigger?;
    private _email?;
    private _webhook?;
    private _beacon?;
    private _notification?;
    private _campaign?;
    private _jwtToken?;
    constructor(config: OMXConfig);
    /**
     * Static method to initialize the SDK
     */
    static initialize(config: OMXConfig): Promise<OMXClient>;
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
    get geotrigger(): GeotriggerClient;
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
     * Get notification client instance
     */
    get notification(): NotificationClient;
    /**
     * Get campaign client instance
     */
    get campaign(): CampaignClient;
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
        overall: "healthy" | "degraded" | "unhealthy";
        services: {
            geotrigger: "healthy" | "unhealthy";
            email: "healthy" | "unhealthy";
            webhook: "healthy" | "unhealthy";
            beacon: "healthy" | "unhealthy";
            notification: "healthy" | "unhealthy";
        };
    }>;
    /**
     * Get aggregated analytics from all services
     */
    getAnalytics(): {
        geotrigger: {
            isMonitoring: boolean;
        };
        email: any | null;
        webhook: {
            subscriptions: number;
        };
        beacon: any | null;
        notification: any | null;
        campaign: any | null;
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
export declare function createOMXClient(config: OMXConfig): OMXClient;
export { OMXClient as omxClient };
export declare const VERSION = "1.0.2";
export default OMXClient;
//# sourceMappingURL=index.d.ts.map