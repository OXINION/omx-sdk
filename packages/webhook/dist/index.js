/**
 * @omx-sdk/webhook
 * Webhook management functionality for omx-sdk
 */
export class WebhookClient {
    constructor(omx) {
        this.subscriptions = new Map();
        this.omx = omx;
    }
    /**
     * Send a webhook request
     */
    async send(payload, retryOptions) {
        const startTime = Date.now();
        let lastError = null;
        const maxAttempts = retryOptions?.maxAttempts || this.omx.config.webhook?.retryAttempts || 3;
        const baseDelay = retryOptions?.delay || this.omx.config.webhook?.retryDelay || 1000;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                // Use OmxClient for authenticated requests if needed,
                // or direct fetch if it's an external webhook
                const response = await fetch(payload.url, {
                    method: payload.method || "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...payload.headers,
                    },
                    body: payload.data ? JSON.stringify(payload.data) : undefined,
                    signal: payload.timeout
                        ? AbortSignal.timeout(payload.timeout)
                        : undefined,
                });
                const data = await response.json().catch(() => ({}));
                const duration = Date.now() - startTime;
                if (!response.ok)
                    throw new Error(`HTTP ${response.status}`);
                return {
                    success: true,
                    status: response.status,
                    data,
                    duration,
                    attempt,
                };
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error("Unknown error");
                if (attempt === maxAttempts)
                    break;
                const delay = this.calculateRetryDelay(attempt, baseDelay, retryOptions);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
        const duration = Date.now() - startTime;
        return {
            success: false,
            error: lastError?.message || "Request failed",
            duration,
            attempt: maxAttempts,
        };
    }
    async createSubscription(url, events, secret) {
        const result = await this.omx.request("webhook-service/subscribe", {
            method: "POST",
            body: { url, events, secret },
        });
        const subscription = {
            id: result.id,
            url,
            events,
            secret,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.subscriptions.set(subscription.id, subscription);
        return subscription;
    }
    async updateSubscription(id, updates) {
        await this.omx.request(`webhook-service/${id}`, {
            method: "PATCH",
            body: updates,
        });
        const subscription = this.subscriptions.get(id);
        if (!subscription)
            throw new Error(`Subscription not found: ${id}`);
        const updated = { ...subscription, ...updates, updatedAt: new Date() };
        this.subscriptions.set(id, updated);
        return updated;
    }
    async deleteSubscription(id) {
        await this.omx.request(`webhook-service/${id}`, {
            method: "DELETE",
        });
        return this.subscriptions.delete(id);
    }
    getSubscriptions() {
        return Array.from(this.subscriptions.values());
    }
    calculateRetryDelay(attempt, baseDelay, options) {
        const backoff = options?.backoff || "exponential";
        const maxDelay = options?.maxDelay || 30000;
        const delay = backoff === "exponential"
            ? baseDelay * Math.pow(2, attempt - 1)
            : baseDelay * attempt;
        return Math.min(delay, maxDelay);
    }
}
/**
 * Attacher function: Attach Webhook module to an existing OmxClient
 */
export function webhook(omx) {
    return new WebhookClient(omx);
}
//# sourceMappingURL=index.js.map