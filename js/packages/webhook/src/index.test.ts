import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebhookManager } from './index';
import { OMXClient } from '@omx-sdk/core';

describe('WebhookManager', () => {
  let mockClient: OMXClient;
  let webhookManager: WebhookManager;

  beforeEach(() => {
    mockClient = {
      makeRequest: vi.fn()
    } as any;
    webhookManager = new WebhookManager(mockClient);
  });

  it('should create webhook manager', () => {
    expect(webhookManager).toBeDefined();
  });

  it('should create webhook', async () => {
    const config = {
      url: 'https://example.com/webhook',
      events: ['geotrigger.enter']
    };

    const mockResponse = { id: 'webhook-123', ...config };
    vi.mocked(mockClient.makeRequest).mockResolvedValue(mockResponse);

    const result = await webhookManager.create(config);

    expect(mockClient.makeRequest).toHaveBeenCalledWith('/webhooks', {
      method: 'POST',
      body: JSON.stringify(config)
    });
    expect(result).toEqual(mockResponse);
  });
});