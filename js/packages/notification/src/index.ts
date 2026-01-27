import { OMXClient } from '@omx-sdk/core';

export interface NotificationData {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface NotificationResult {
  messageId: string;
  status: string;
}

export interface PushTokenData {
  userId: string;
  deviceToken: string;
  platform: 'ios' | 'android' | 'web';
}

export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export class NotificationManager {
  constructor(private client: OMXClient) {}

  async sendPushNotification(data: NotificationData): Promise<NotificationResult> {
    return this.client.makeRequest<NotificationResult>('/notifications/push', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendBulkNotifications(notifications: NotificationData[]): Promise<NotificationResult[]> {
    return this.client.makeRequest<NotificationResult[]>('/notifications/bulk', {
      method: 'POST',
      body: JSON.stringify({ notifications }),
    });
  }

  async registerPushToken(tokenData: PushTokenData): Promise<void> {
    return this.client.makeRequest<void>('/notifications/tokens', {
      method: 'POST',
      body: JSON.stringify(tokenData),
    });
  }

  async unregisterPushToken(userId: string, deviceToken: string): Promise<void> {
    return this.client.makeRequest<void>('/notifications/tokens', {
      method: 'DELETE',
      body: JSON.stringify({ userId, deviceToken }),
    });
  }

  async getTemplates(): Promise<NotificationTemplate[]> {
    return this.client.makeRequest<NotificationTemplate[]>('/notifications/templates');
  }

  async sendFromTemplate(templateId: string, userId: string, data?: Record<string, any>): Promise<NotificationResult> {
    return this.client.makeRequest<NotificationResult>('/notifications/template', {
      method: 'POST',
      body: JSON.stringify({ templateId, userId, data }),
    });
  }
}