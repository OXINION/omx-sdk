/**
 * @omx-sdk/omx-sdk
 * Unified entry point for the OMX SDK
 */
import { OmxClient as BaseClient, OmxConfig } from "@omx-sdk/core";
import { BeaconManager } from "@omx-sdk/beacon";
import { CampaignClient } from "@omx-sdk/campaign";
import { EmailClient } from "@omx-sdk/email";
import { GeotriggerClient } from "@omx-sdk/geotrigger";
import { NotificationClient } from "@omx-sdk/notification";
import { WebhookClient } from "@omx-sdk/webhook";
/**
 * Enhanced OMX Client for the unified SDK with all modules pre-attached
 */
export declare class OMXClient extends BaseClient {
    private _beacon?;
    private _campaign?;
    private _email?;
    private _geotrigger?;
    private _notification?;
    private _webhook?;
    /**
     * Geotrigger module
     */
    get geoTrigger(): GeotriggerClient;
    /**
     * Email module
     */
    get email(): EmailClient;
    /**
     * Webhook module
     */
    get webhook(): WebhookClient;
    /**
     * Beacon module
     */
    get beacon(): BeaconManager;
    /**
     * Notification module
     */
    get notification(): NotificationClient;
    /**
     * Campaign module
     */
    get campaign(): CampaignClient;
}
/**
 * Unified initializer for the OMX SDK
 */
export declare function createOmxClient(config: OmxConfig): OMXClient;
export * from "@omx-sdk/core";
export * from "@omx-sdk/beacon";
export * from "@omx-sdk/campaign";
export * from "@omx-sdk/email";
export * from "@omx-sdk/geotrigger";
export * from "@omx-sdk/notification";
export * from "@omx-sdk/webhook";
export declare const VERSION = "1.0.4";
export default createOmxClient;
//# sourceMappingURL=index.d.ts.map