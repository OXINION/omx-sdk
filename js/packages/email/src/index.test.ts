import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationManager } from './index';
import { OMXClient } from '@omx-sdk/core';

describe('NotificationManager', () => {
  let mockClient: OMXClient;
  let notificationManager: NotificationManager;

  beforeEach(() => {
    mockClient = {
      makeRequest: vi.fn()
    } as any;
    notificationManager = new NotificationManager(mockClient);
  });

  it('should create notification manager', () => {
    expect(notificationManager).toBeDefined();
  });

  it('should send push notification', async () => {
    const data = {
      userId: 'user-123',
      title: 'Test Notification',
      body: 'Test message'
    };

    const mockResponse = { messageId: 'msg-123', status: 'sent' };
    vi.mocked(mockClient.makeRequest).mockResolvedValue(mockResponse);

    const result = await notificationManager.sendPushNotification(data);

    expect(mockClient.makeRequest).toHaveBeenCalledWith('/notifications/push', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    expect(result).toEqual(mockResponse);
  });

  it('should send email', async () => {
    const data = {
      to: 'test@example.com',
      subject: 'Test Subject',
      content: 'Test content'
    };

    const mockResponse = { messageId: 'email-123', status: 'sent' };
    vi.mocked(mockClient.makeRequest).mockResolvedValue(mockResponse);

    const result = await notificationManager.sendEmail(data);

    expect(mockClient.makeRequest).toHaveBeenCalledWith('/notifications/email', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    expect(result).toEqual(mockResponse);
  });
});
