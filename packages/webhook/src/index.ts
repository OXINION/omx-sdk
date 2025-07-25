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

export class WebhookClient {
  private config: WebhookConfig;
  private subscriptions: Map<string, WebhookSubscription> = new Map();

  constructor(config: WebhookConfig) {
    this.config = config;
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
      retryOptions?.maxAttempts || this.config.retryAttempts || 3;
    const baseDelay = retryOptions?.delay || this.config.retryDelay || 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.makeRequest(payload);
        const duration = Date.now() - startTime;

        return {
          success: true,
          status: response.status,
          data: response.data,
          duration,
          attempt,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        // Don't retry on the last attempt
        if (attempt === maxAttempts) {
          break;
        }

        // Calculate retry delay
        const delay = this.calculateRetryDelay(
          attempt,
          baseDelay,
          retryOptions
        );
        await this.sleep(delay);
      }
    }

    const duration = Date.now() - startTime;
    return {
      success: false,
      error: lastError?.message || 'Request failed',
      duration,
      attempt: maxAttempts,
    };
  }

  /**
   * Create a webhook subscription
   */
  async createSubscription(
    url: string,
    events: string[],
    secret?: string
  ): Promise<WebhookSubscription> {
    const subscription: WebhookSubscription = {
      id: this.generateId(),
      url,
      events,
      secret,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.subscriptions.set(subscription.id, subscription);

    // Simulate API call to register webhook
    try {
      await this.makeApiCall('/webhooks/subscribe', {
        url,
        events,
        secret,
      });
    } catch (error) {
      this.subscriptions.delete(subscription.id);
      throw error;
    }

    return subscription;
  }

  /**
   * Update a webhook subscription
   */
  async updateSubscription(
    id: string,
    updates: Partial<
      Pick<WebhookSubscription, 'url' | 'events' | 'secret' | 'active'>
    >
  ): Promise<WebhookSubscription> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) {
      throw new Error(`Subscription not found: ${id}`);
    }

    const updatedSubscription = {
      ...subscription,
      ...updates,
      updatedAt: new Date(),
    };

    this.subscriptions.set(id, updatedSubscription);

    // Simulate API call
    await this.makeApiCall(`/webhooks/${id}`, updates);

    return updatedSubscription;
  }

  /**
   * Delete a webhook subscription
   */
  async deleteSubscription(id: string): Promise<boolean> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) {
      return false;
    }

    // Simulate API call
    await this.makeApiCall(`/webhooks/${id}`, {}, 'DELETE');

    this.subscriptions.delete(id);
    return true;
  }

  /**
   * Get all subscriptions
   */
  getSubscriptions(): WebhookSubscription[] {
    return Array.from(this.subscriptions.values());
  }

  /**
   * Get a specific subscription
   */
  getSubscription(id: string): WebhookSubscription | undefined {
    return this.subscriptions.get(id);
  }

  /**
   * Test a webhook URL
   */
  async testWebhook(
    url: string,
    testEvent?: WebhookEvent
  ): Promise<WebhookResponse> {
    const payload: WebhookPayload = {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'OMX-SDK-Webhook/1.0',
      },
      data: testEvent || {
        id: this.generateId(),
        type: 'test',
        data: { message: 'This is a test webhook' },
        timestamp: new Date(),
        source: 'omx-sdk',
      },
    };

    return this.send(payload);
  }

  /**
   * Verify webhook signature
   */
  verifySignature(
    payload: string,
    signature: string,
    secret: string,
    algorithm: 'sha256' | 'sha1' = 'sha256'
  ): boolean {
    // This is a simplified version - in a real implementation,
    // you would use actual cryptographic libraries
    const expectedSignature = this.generateSignature(
      payload,
      secret,
      algorithm
    );
    return this.secureCompare(signature, expectedSignature);
  }

  /**
   * Generate webhook signature
   */
  generateSignature(
    payload: string,
    secret: string,
    algorithm: 'sha256' | 'sha1' = 'sha256'
  ): string {
    // Simplified signature generation - use actual crypto libraries in production
    const data = secret + payload;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `${algorithm}=${Math.abs(hash).toString(16)}`;
  }

  /**
   * Simulate webhook event delivery
   */
  async deliverEvent(event: WebhookEvent): Promise<WebhookDelivery[]> {
    const deliveries: WebhookDelivery[] = [];

    for (const subscription of this.subscriptions.values()) {
      if (!subscription.active || !subscription.events.includes(event.type)) {
        continue;
      }

      const delivery: WebhookDelivery = {
        id: this.generateId(),
        subscriptionId: subscription.id,
        eventId: event.id,
        url: subscription.url,
        status: 'pending',
        attempts: 0,
        maxAttempts: this.config.retryAttempts || 3,
      };

      try {
        const payload: WebhookPayload = {
          url: subscription.url,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'OMX-SDK-Webhook/1.0',
            ...(subscription.secret && {
              'X-Webhook-Signature': this.generateSignature(
                JSON.stringify(event),
                subscription.secret
              ),
            }),
          },
          data: event,
        };

        const response = await this.send(payload);
        delivery.status = response.success ? 'success' : 'failed';
        delivery.response = response;
        delivery.attempts = response.attempt || 1;
        delivery.lastAttemptAt = new Date();
      } catch (error) {
        delivery.status = 'failed';
        delivery.attempts = 1;
        delivery.lastAttemptAt = new Date();
      }

      deliveries.push(delivery);
    }

    return deliveries;
  }

  /**
   * Make HTTP request
   */
  private async makeRequest(payload: WebhookPayload): Promise<{
    status: number;
    data: unknown;
  }> {
    // Simulate HTTP request
    await this.sleep(Math.random() * 200 + 50);

    console.log(
      `Making request to ${payload.url} with method ${payload.method || 'POST'}`
    );

    // Simulate occasional failures
    if (Math.random() < 0.1) {
      throw new Error('Network error');
    }

    // Simulate different response codes
    const status = Math.random() < 0.95 ? 200 : 500;
    if (status !== 200) {
      throw new Error(`HTTP ${status}`);
    }

    return {
      status,
      data: { received: true, timestamp: new Date().toISOString() },
    };
  }

  /**
   * Make API call to webhook service
   */
  private async makeApiCall(
    endpoint: string,
    data: unknown,
    method = 'POST'
  ): Promise<unknown> {
    const url = `${this.config.baseUrl || 'https://api.oxinion.com/webhooks'}${endpoint}`;

    // Simulate API call
    await this.sleep(Math.random() * 300 + 100);

    console.log(`${method} ${url}`, data);

    // Simulate occasional failures
    if (Math.random() < 0.05) {
      throw new Error('API call failed');
    }

    return { success: true };
  }

  /**
   * Calculate retry delay with backoff
   */
  private calculateRetryDelay(
    attempt: number,
    baseDelay: number,
    options?: RetryOptions
  ): number {
    const backoff = options?.backoff || 'exponential';
    const maxDelay = options?.maxDelay || 30000;

    let delay: number;
    if (backoff === 'exponential') {
      delay = baseDelay * Math.pow(2, attempt - 1);
    } else {
      delay = baseDelay * attempt;
    }

    return Math.min(delay, maxDelay);
  }

  /**
   * Secure string comparison to prevent timing attacks
   */
  private secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get client configuration
   */
  getConfig(): Readonly<WebhookConfig> {
    return { ...this.config };
  }
}

// Export default instance creation helper
export function createWebhookClient(config: WebhookConfig): WebhookClient {
  return new WebhookClient(config);
}
