export interface WebhookConfig {
    clientId: string;
    secretKey: string;
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
    retryDelay?: number;
}
export interface WebhookPayload {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
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
    status: 'pending' | 'success' | 'failed' | 'retrying';
    attempts: number;
    maxAttempts: number;
    lastAttemptAt?: Date;
    nextRetryAt?: Date;
    response?: WebhookResponse;
}
export interface RetryOptions {
    maxAttempts?: number;
    delay?: number;
    backoff?: 'linear' | 'exponential';
    maxDelay?: number;
}
export declare class WebhookClient {
    private config;
    private subscriptions;
    constructor(config: WebhookConfig);
    /**
     * Send a webhook request
     */
    send(payload: WebhookPayload, retryOptions?: RetryOptions): Promise<WebhookResponse>;
    /**
     * Create a webhook subscription
     */
    createSubscription(url: string, events: string[], secret?: string): Promise<WebhookSubscription>;
    /**
     * Update a webhook subscription
     */
    updateSubscription(id: string, updates: Partial<Pick<WebhookSubscription, 'url' | 'events' | 'secret' | 'active'>>): Promise<WebhookSubscription>;
    /**
     * Delete a webhook subscription
     */
    deleteSubscription(id: string): Promise<boolean>;
    /**
     * Get all subscriptions
     */
    getSubscriptions(): WebhookSubscription[];
    /**
     * Get a specific subscription
     */
    getSubscription(id: string): WebhookSubscription | undefined;
    /**
     * Test a webhook URL
     */
    testWebhook(url: string, testEvent?: WebhookEvent): Promise<WebhookResponse>;
    /**
     * Verify webhook signature
     */
    verifySignature(payload: string, signature: string, secret: string, algorithm?: 'sha256' | 'sha1'): boolean;
    /**
     * Generate webhook signature
     */
    generateSignature(payload: string, secret: string, algorithm?: 'sha256' | 'sha1'): string;
    /**
     * Simulate webhook event delivery
     */
    deliverEvent(event: WebhookEvent): Promise<WebhookDelivery[]>;
    /**
     * Make HTTP request
     */
    private makeRequest;
    /**
     * Make API call to webhook service
     */
    private makeApiCall;
    /**
     * Calculate retry delay with backoff
     */
    private calculateRetryDelay;
    /**
     * Secure string comparison to prevent timing attacks
     */
    private secureCompare;
    /**
     * Generate unique ID
     */
    private generateId;
    /**
     * Sleep utility
     */
    private sleep;
    /**
     * Get client configuration
     */
    getConfig(): Readonly<WebhookConfig>;
}
export declare function createWebhookClient(config: WebhookConfig): WebhookClient;
//# sourceMappingURL=index.d.ts.map