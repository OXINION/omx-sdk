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

export class WebhookManager {
  constructor(private client: OMXClient) {}

  async sendWebhook(data: WebhookPayload): Promise<void> {
    return this.client.makeRequest<void>('/webhooks/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async create(config: WebhookConfig): Promise<Webhook> {
    return this.client.makeRequest<Webhook>('/webhooks', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async list(): Promise<Webhook[]> {
    return this.client.makeRequest<Webhook[]>('/webhooks');
  }

  async delete(id: string): Promise<void> {
    return this.client.makeRequest<void>(`/webhooks/${id}`, {
      method: 'DELETE',
    });
  }
}