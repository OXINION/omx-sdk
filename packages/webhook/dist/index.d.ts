/**
 * @omx-sdk/webhook
 * Webhook management functionality for omx-sdk
 */
import { createOmxClient } from "@omx-sdk/core";
export interface WebhookPayload {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
    data?: unknown;
    timeout?: number;
}
export interface WebhookResponse {
    success: boolean;
    status?: number;
    data?: unknown;
    error?: string;
    duration?: number;
    attempt?: number;
}
export interface WebhookSubscription {
    id: string;
    url: string;
    events: string[];
    secret?: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface WebhookEvent {
    id: string;
    type: string;
    data: unknown;
    timestamp: Date;
    source: string;
}
export interface WebhookDelivery {
    id: string;
    subscriptionId: string;
    eventId: string;
    url: string;
    status: "pending" | "success" | "failed" | "retrying";
    attempts: number;
    maxAttempts: number;
    lastAttemptAt?: Date;
    nextRetryAt?: Date;
    response?: WebhookResponse;
}
export interface RetryOptions {
    maxAttempts?: number;
    delay?: number;
    backoff?: "linear" | "exponential";
    maxDelay?: number;
}
export declare class WebhookClient {
    private omx;
    private subscriptions;
    constructor(omx: ReturnType<typeof createOmxClient>);
    /**
     * Send a webhook request
     */
    send(payload: WebhookPayload, retryOptions?: RetryOptions): Promise<WebhookResponse>;
    createSubscription(url: string, events: string[], secret?: string): Promise<WebhookSubscription>;
    updateSubscription(id: string, updates: Partial<Pick<WebhookSubscription, "url" | "events" | "secret" | "active">>): Promise<WebhookSubscription>;
    deleteSubscription(id: string): Promise<boolean>;
    getSubscriptions(): WebhookSubscription[];
    private calculateRetryDelay;
}
/**
 * Attacher function: Attach Webhook module to an existing OmxClient
 */
export declare function webhook(omx: ReturnType<typeof createOmxClient>): WebhookClient;
//# sourceMappingURL=index.d.ts.map