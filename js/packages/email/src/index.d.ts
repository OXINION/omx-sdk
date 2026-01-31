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
    content: string;
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
export declare class EmailManager {
    private client;
    constructor(client: OMXClient);
    send(data: EmailData): Promise<EmailResult>;
    sendBulk(emails: EmailData[]): Promise<EmailResult[]>;
    getStatus(messageId: string): Promise<EmailResult>;
    getTemplates(): Promise<EmailTemplate[]>;
    createTemplate(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate>;
    updateTemplate(id: string, template: Partial<Omit<EmailTemplate, 'id'>>): Promise<EmailTemplate>;
    deleteTemplate(id: string): Promise<void>;
    createCampaign(campaign: Omit<EmailCampaign, 'id' | 'stats'>): Promise<EmailCampaign>;
    getCampaigns(): Promise<EmailCampaign[]>;
    sendCampaign(campaignId: string): Promise<EmailCampaign>;
    getCampaignStats(campaignId: string): Promise<EmailCampaign['stats']>;
}
//# sourceMappingURL=index.d.ts.map