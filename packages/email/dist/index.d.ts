export interface EmailConfig {
    clientId: string;
    secretKey: string;
    baseUrl?: string;
    timeout?: number;
    defaultFrom?: string;
}
export interface EmailAttachment {
    filename: string;
    content: string | Uint8Array;
    contentType?: string;
    encoding?: 'base64' | 'binary';
}
export interface EmailMessage {
    to: string | string[];
    from?: string;
    subject: string;
    body: string;
    html?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: EmailAttachment[];
    replyTo?: string;
    priority?: 'high' | 'normal' | 'low';
}
export interface EmailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
    statusCode?: number;
}
export interface EmailTemplate {
    id: string;
    name: string;
    variables: Record<string, unknown>;
}
export interface BulkEmailOptions {
    batchSize?: number;
    delay?: number;
}
export declare class EmailClient {
    private config;
    constructor(config: EmailConfig);
    /**
     * Send a single email
     */
    send(message: EmailMessage): Promise<EmailResponse>;
    /**
     * Send bulk emails
     */
    sendBulk(messages: EmailMessage[], options?: BulkEmailOptions): Promise<EmailResponse[]>;
    /**
     * Send email using a template
     */
    sendTemplate(template: EmailTemplate, recipients: string | string[], variables?: Record<string, unknown>): Promise<EmailResponse>;
    /**
     * Validate email address format
     */
    validateEmail(email: string): boolean;
    /**
     * Get delivery status of an email
     */
    getDeliveryStatus(messageId: string): Promise<{
        messageId: string;
        status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
        timestamp?: Date;
        error?: string;
    }>;
    /**
     * Get email statistics
     */
    getStats(dateFrom?: Date, dateTo?: Date): Promise<{
        sent: number;
        delivered: number;
        failed: number;
        bounced: number;
        opened?: number;
        clicked?: number;
    }>;
    /**
     * Validate email message
     */
    private validateMessage;
    /**
     * Prepare email payload for API
     */
    private preparePayload;
    /**
     * Make API call (simulated)
     */
    private makeApiCall;
    /**
     * Process email template
     */
    private processTemplate;
    /**
     * Generate unique message ID
     */
    private generateMessageId;
    /**
     * Sleep utility
     */
    private sleep;
    /**
     * Get client configuration
     */
    getConfig(): Readonly<EmailConfig>;
}
export declare function createEmailClient(config: EmailConfig): EmailClient;
//# sourceMappingURL=index.d.ts.map