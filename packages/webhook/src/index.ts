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

export class WebhookClient {
  private omx: ReturnType<typeof createOmxClient>;
  private subscriptions: Map<string, WebhookSubscription> = new Map();

  constructor(omx: ReturnType<typeof createOmxClient>) {
    this.omx = omx;
  }

  /**
   * Send a webhook request
   */
  async send(
    payload: WebhookPayload,
    retryOptions?: RetryOptions
  ): Promise<WebhookResponse> {
    const startTime = Date.now();
    let lastError: Error | null = null;

    const maxAttempts =
      retryOptions?.maxAttempts || this.omx.config.webhook?.retryAttempts || 3;
    const baseDelay =
      retryOptions?.delay || this.omx.config.webhook?.retryDelay || 1000;

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

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        return {
          success: true,
          status: response.status,
          data,
          duration,
          attempt,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error");
        if (attempt === maxAttempts) break;

        const delay = this.calculateRetryDelay(
          attempt,
          baseDelay,
          retryOptions
        );
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

  async createSubscription(
    url: string,
    events: string[],
    secret?: string
  ): Promise<WebhookSubscription> {
    const result = await this.omx.request("webhook-service/subscribe", {
      method: "POST",
      body: { url, events, secret },
    });

    const subscription: WebhookSubscription = {
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

  async updateSubscription(
    id: string,
    updates: Partial<
      Pick<WebhookSubscription, "url" | "events" | "secret" | "active">
    >
  ): Promise<WebhookSubscription> {
    await this.omx.request(`webhook-service/${id}`, {
      method: "PATCH",
      body: updates,
    });

    const subscription = this.subscriptions.get(id);
    if (!subscription) throw new Error(`Subscription not found: ${id}`);

    const updated = { ...subscription, ...updates, updatedAt: new Date() };
    this.subscriptions.set(id, updated);
    return updated;
  }

  async deleteSubscription(id: string): Promise<boolean> {
    await this.omx.request(`webhook-service/${id}`, {
      method: "DELETE",
    });
    return this.subscriptions.delete(id);
  }

  getSubscriptions(): WebhookSubscription[] {
    return Array.from(this.subscriptions.values());
  }

  private calculateRetryDelay(
    attempt: number,
    baseDelay: number,
    options?: RetryOptions
  ): number {
    const backoff = options?.backoff || "exponential";
    const maxDelay = options?.maxDelay || 30000;
    const delay =
      backoff === "exponential"
        ? baseDelay * Math.pow(2, attempt - 1)
        : baseDelay * attempt;
    return Math.min(delay, maxDelay);
  }
}

/**
 * Attacher function: Attach Webhook module to an existing OmxClient
 */
export function webhook(omx: ReturnType<typeof createOmxClient>): WebhookClient {
  return new WebhookClient(omx);
}
