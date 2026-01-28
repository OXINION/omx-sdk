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
  delay?: number; // milliseconds between batches
}

export class EmailClient {
  private omx: ReturnType<typeof createOmxClient>;

  constructor(omx: ReturnType<typeof createOmxClient>) {
    this.omx = omx;
  }

  /**
   * Send a single email
   */
  async send(message: EmailMessage): Promise<EmailResponse> {
    try {
      this.validateMessage(message);

      const payload = this.preparePayload(message);

      // Use OmxClient to make the authenticated request
      // Assuming there's an email-sending edge function
      await this.omx.request("email-service", {
        method: "POST",
        body: payload,
      });

      return {
        success: true,
        messageId: this.generateMessageId(),
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        statusCode: 500,
      };
    }
  }

  /**
   * Send bulk emails
   */
  async sendBulk(
    messages: EmailMessage[],
    options?: BulkEmailOptions
  ): Promise<EmailResponse[]> {
    const batchSize = options?.batchSize || 10;
    const delay = options?.delay || 1000;
    const results: EmailResponse[] = [];

    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      const batchPromises = batch.map((message) => this.send(message));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      if (i + batchSize < messages.length && delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    return results;
  }

  /**
   * Send email using a template
   */
  async sendTemplate(
    template: EmailTemplate,
    recipients: string | string[],
    variables?: Record<string, unknown>
  ): Promise<EmailResponse> {
    try {
      const mergedVariables = { ...template.variables, ...variables };
      const processedContent = this.processTemplate(template, mergedVariables);

      const message: EmailMessage = {
        to: recipients,
        from: this.omx.config['email']?.defaultFrom,
        subject: processedContent.subject,
        body: processedContent.body,
        html: processedContent.html,
      };

      return await this.send(message);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Template processing failed",
        statusCode: 500,
      };
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async getDeliveryStatus(messageId: string): Promise<any> {
    return this.omx.request(`email-service/status/${messageId}`);
  }

  async getStats(dateFrom?: Date, dateTo?: Date): Promise<any> {
    return this.omx.request("email-service/stats", {
      method: "POST",
      body: { dateFrom, dateTo },
    });
  }

  private validateMessage(message: EmailMessage): void {
    if (!message.to || (Array.isArray(message.to) && message.to.length === 0)) {
      throw new Error("Recipient email is required");
    }
    if (!message.subject || message.subject.trim() === "") {
      throw new Error("Email subject is required");
    }
    if (!message.body || message.body.trim() === "") {
      throw new Error("Email body is required");
    }

    const recipients = Array.isArray(message.to) ? message.to : [message.to];
    for (const email of recipients) {
      if (!this.validateEmail(email)) {
        throw new Error(`Invalid email address: ${email}`);
      }
    }
  }

  private preparePayload(message: EmailMessage): Record<string, unknown> {
    return {
      to: message.to,
      from: message.from || this.omx.config['email']?.defaultFrom,
      subject: message.subject,
      body: message.body,
      html: message.html,
      cc: message.cc,
      bcc: message.bcc,
      attachments: message.attachments,
      replyTo: message.replyTo,
      priority: message.priority || "normal",
    };
  }

  private processTemplate(
    template: EmailTemplate,
    variables: Record<string, unknown>
  ) {
    return {
      subject: `Template: ${template.name}`,
      body: `Hello, this is a template email with variables: ${JSON.stringify(variables)}`,
      html: `<h1>Template: ${template.name}</h1><p>Variables: ${JSON.stringify(variables)}</p>`,
    };
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Attacher function: Attach Email module to an existing OmxClient
 */
export function email(omx: ReturnType<typeof createOmxClient>): EmailClient {
  return new EmailClient(omx);
}
