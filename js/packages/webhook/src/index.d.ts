import { OMXClient } from '@omx-sdk/core';
export interface WebhookPayload {
    url: string;
    payload: Record<string, any>;
}
export interface Webhook {
    id: string;
    url: string;
    events: string[];
    status: string;
}
export interface WebhookConfig {
    url: string;
    events: string[];
}
export declare class WebhookManager {
    private client;
    constructor(client: OMXClient);
    sendWebhook(data: WebhookPayload): Promise<void>;
    create(config: WebhookConfig): Promise<Webhook>;
    list(): Promise<Webhook[]>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map