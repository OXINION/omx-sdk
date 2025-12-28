/**
 * @omx-sdk/email
 * Email sending functionality for omx-sdk
 */
import { createOmxClient } from "@omx-sdk/core";
export interface EmailAttachment {
    filename: string;
    content: string | Uint8Array;
    contentType?: string;
    encoding?: "base64" | "binary";
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
    priority?: "high" | "normal" | "low";
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
    private omx;
    constructor(omx: ReturnType<typeof createOmxClient>);
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
    validateEmail(email: string): boolean;
    getDeliveryStatus(messageId: string): Promise<any>;
    getStats(dateFrom?: Date, dateTo?: Date): Promise<any>;
    private validateMessage;
    private preparePayload;
    private processTemplate;
    private generateMessageId;
}
/**
 * Attacher function: Attach Email module to an existing OmxClient
 */
export declare function email(omx: ReturnType<typeof createOmxClient>): EmailClient;
//# sourceMappingURL=index.d.ts.map