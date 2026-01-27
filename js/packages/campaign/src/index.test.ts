import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CampaignManager } from './index.js';
import { OMXClient } from '@omx-sdk/core';

describe('CampaignManager', () => {
  let campaignManager: CampaignManager;
  let mockClient: OMXClient;

  beforeEach(() => {
    mockClient = {
      makeRequest: vi.fn(),
    } as any;
    campaignManager = new CampaignManager(mockClient);
  });

  it('should create campaign', async () => {
    const campaignConfig = {
      name: 'Test Campaign',
      description: 'A test campaign',
      type: 'geotrigger' as const,
      status: 'draft' as const,
      actions: [
        {
          type: 'notification' as const,
          config: {
            title: 'Welcome!',
            body: 'Thanks for visiting!'
          }
        }
      ]
    };
    
    const expectedResult = {
      id: 'campaign123',
      ...campaignConfig,
      stats: {
        triggered: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0
      },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };

    (mockClient.makeRequest as any).mockResolvedValue(expectedResult);

    const result = await campaignManager.create(campaignConfig);

    expect(mockClient.makeRequest).toHaveBeenCalledWith('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignConfig),
    });
    expect(result).toEqual(expectedResult);
  });

  it('should trigger manual campaign', async () => {
    const campaignId = 'campaign123';
    const userIds = ['user1', 'user2'];

    (mockClient.makeRequest as any).mockResolvedValue(undefined);

    await campaignManager.triggerManual(campaignId, userIds);

    expect(mockClient.makeRequest).toHaveBeenCalledWith(`/campaigns/${campaignId}/trigger`, {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    });
  });
});