import { OMXClient } from "@omx-sdk/core";

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

export interface EmailData {
  to: string | string[];
  subject: string;
  content: string;
  templateId?: string;
}

export interface EmailResult {
  messageId: string;
  status: string;
}

export class NotificationManager {
  constructor(private client: OMXClient) {}

  async sendPushNotification(
    data: NotificationData,
  ): Promise<NotificationResult> {
    return this.client.makeRequest<NotificationResult>("/notifications/push", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async sendEmail(data: EmailData): Promise<EmailResult> {
    return this.client.makeRequest<EmailResult>("/notifications/email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
