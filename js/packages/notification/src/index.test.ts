import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationManager } from './index.js';
import { OMXClient } from '@omx-sdk/core';

describe('NotificationManager', () => {
  let notificationManager: NotificationManager;
  let mockClient: OMXClient;

  beforeEach(() => {
    mockClient = {
      makeRequest: vi.fn(),
    } as any;
    notificationManager = new NotificationManager(mockClient);
  });

  it('should send push notification', async () => {
    const notificationData = {
      userId: 'user123',
      title: 'Test Notification',
      body: 'This is a test notification',
      data: { key: 'value' }
    };
    
    const expectedResult = {
      messageId: 'msg123',
      status: 'sent'
    };

    (mockClient.makeRequest as any).mockResolvedValue(expectedResult);

    const result = await notificationManager.sendPushNotification(notificationData);

    expect(mockClient.makeRequest).toHaveBeenCalledWith('/notifications/push', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
    expect(result).toEqual(expectedResult);
  });

  it('should register push token', async () => {
    const tokenData = {
      userId: 'user123',
      deviceToken: 'token123',
      platform: 'ios' as const
    };

    (mockClient.makeRequest as any).mockResolvedValue(undefined);

    await notificationManager.registerPushToken(tokenData);

    expect(mockClient.makeRequest).toHaveBeenCalledWith('/notifications/tokens', {
      method: 'POST',
      body: JSON.stringify(tokenData),
    });
  });
});