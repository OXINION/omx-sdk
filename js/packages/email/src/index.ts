import { OMXClient } from '@omx-sdk/core';

export interface EmailData {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  content: string;
  htmlContent?: string;
  templateId?: string;
  templateData?: Record<string, any>;
  attachments?: EmailAttachment[];
  priority?: 'low' | 'normal' | 'high';
  replyTo?: string;
  fromName?: string;
}

export interface EmailAttachment {
  filename: string;
  content: string; // base64 encoded
  contentType: string;
}

export interface EmailResult {
  messageId: string;
  status: string;
  deliveredAt?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: string[];
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  templateId?: string;
  recipients: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
}

export class EmailManager {
  constructor(private client: OMXClient) {}

  async send(data: EmailData): Promise<EmailResult> {
    return this.client.makeRequest<EmailResult>('/emails/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendBulk(emails: EmailData[]): Promise<EmailResult[]> {
    return this.client.makeRequest<EmailResult[]>('/emails/send-bulk', {
      method: 'POST',
      body: JSON.stringify({ emails }),
    });
  }

  async getStatus(messageId: string): Promise<EmailResult> {
    return this.client.makeRequest<EmailResult>(`/emails/${messageId}/status`);
  }

  async getTemplates(): Promise<EmailTemplate[]> {
    return this.client.makeRequest<EmailTemplate[]>('/emails/templates');
  }

  async createTemplate(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
    return this.client.makeRequest<EmailTemplate>('/emails/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    });
  }

  async updateTemplate(id: string, template: Partial<Omit<EmailTemplate, 'id'>>): Promise<EmailTemplate> {
    return this.client.makeRequest<EmailTemplate>(`/emails/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(template),
    });
  }

  async deleteTemplate(id: string): Promise<void> {
    return this.client.makeRequest<void>(`/emails/templates/${id}`, {
      method: 'DELETE',
    });
  }

  async createCampaign(campaign: Omit<EmailCampaign, 'id' | 'stats'>): Promise<EmailCampaign> {
    return this.client.makeRequest<EmailCampaign>('/emails/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  }

  async getCampaigns(): Promise<EmailCampaign[]> {
    return this.client.makeRequest<EmailCampaign[]>('/emails/campaigns');
  }

  async sendCampaign(campaignId: string): Promise<EmailCampaign> {
    return this.client.makeRequest<EmailCampaign>(`/emails/campaigns/${campaignId}/send`, {
      method: 'POST',
    });
  }

  async getCampaignStats(campaignId: string): Promise<EmailCampaign['stats']> {
    return this.client.makeRequest<EmailCampaign['stats']>(`/emails/campaigns/${campaignId}/stats`);
  }
}
