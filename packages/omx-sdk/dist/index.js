/**
 * @omx-sdk/omx-sdk
 * Unified entry point for the OMX SDK
 */
import { OmxClient as BaseClient } from "@omx-sdk/core";
import { beacon } from "@omx-sdk/beacon";
import { campaign } from "@omx-sdk/campaign";
import { email } from "@omx-sdk/email";
import { geoTrigger } from "@omx-sdk/geotrigger";
import { notification } from "@omx-sdk/notification";
import { webhook } from "@omx-sdk/webhook";
/**
 * Enhanced OMX Client for the unified SDK with all modules pre-attached
 */
export class OMXClient extends BaseClient {
    /**
     * Geotrigger module
     */
    get geoTrigger() {
        if (!this._geotrigger)
            this._geotrigger = geoTrigger(this);
        return this._geotrigger;
    }
    /**
     * Email module
     */
    get email() {
        if (!this._email)
            this._email = email(this);
        return this._email;
    }
    /**
     * Webhook module
     */
    get webhook() {
        if (!this._webhook)
            this._webhook = webhook(this);
        return this._webhook;
    }
    /**
     * Beacon module
     */
    get beacon() {
        if (!this._beacon)
            this._beacon = beacon(this);
        return this._beacon;
    }
    /**
     * Notification module
     */
    get notification() {
        if (!this._notification)
            this._notification = notification(this);
        return this._notification;
    }
    /**
     * Campaign module
     */
    get campaign() {
        if (!this._campaign)
            this._campaign = campaign(this);
        return this._campaign;
    }
}
/**
 * Unified initializer for the OMX SDK
 */
export function createOmxClient(config) {
    return new OMXClient(config);
}
// Re-export core functionality
export * from "@omx-sdk/core";
// Re-export type definitions for convenience
export * from "@omx-sdk/beacon";
export * from "@omx-sdk/campaign";
export * from "@omx-sdk/email";
export * from "@omx-sdk/geotrigger";
export * from "@omx-sdk/notification";
export * from "@omx-sdk/webhook";
// Version information
export const VERSION = "1.0.4";
// Default export
export default createOmxClient;
//# sourceMappingURL=index.js.map