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
  delay?: number; // milliseconds between batches
}

export class EmailClient {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  /**
   * Send a single email
   */
  async send(message: EmailMessage): Promise<EmailResponse> {
    try {
      // Validate required fields
      this.validateMessage(message);

      // Prepare the email payload
      const payload = this.preparePayload(message);

      // Simulate API call
      await this.makeApiCall('/send', payload);

      return {
        success: true,
        messageId: this.generateMessageId(),
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
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

      // Process batch in parallel
      const batchPromises = batch.map((message) => this.send(message));
      const batchResults = await Promise.all(batchPromises);

      results.push(...batchResults);

      // Add delay between batches (except for the last batch)
      if (i + batchSize < messages.length && delay > 0) {
        await this.sleep(delay);
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

      // Simulate template processing
      const processedContent = this.processTemplate(template, mergedVariables);

      const message: EmailMessage = {
        to: recipients,
        from: this.config.defaultFrom,
        subject: processedContent.subject,
        body: processedContent.body,
        html: processedContent.html,
      };

      return await this.send(message);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Template processing failed',
        statusCode: 500,
      };
    }
  }

  /**
   * Validate email address format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get delivery status of an email
   */
  async getDeliveryStatus(messageId: string): Promise<{
    messageId: string;
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
    timestamp?: Date;
    error?: string;
  }> {
    try {
      // Simulate API call to check status
      await this.makeApiCall(`/status/${messageId}`);

      return {
        messageId,
        status: 'delivered',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        messageId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Status check failed',
      };
    }
  }

  /**
   * Get email statistics
   */
  async getStats(
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<{
    sent: number;
    delivered: number;
    failed: number;
    bounced: number;
    opened?: number;
    clicked?: number;
  }> {
    try {
      // Simulate API call
      await this.makeApiCall('/stats', { dateFrom, dateTo });

      return {
        sent: 100,
        delivered: 95,
        failed: 3,
        bounced: 2,
        opened: 80,
        clicked: 15,
      };
    } catch (error) {
      throw new Error(
        `Failed to get stats: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate email message
   */
  private validateMessage(message: EmailMessage): void {
    if (!message.to || (Array.isArray(message.to) && message.to.length === 0)) {
      throw new Error('Recipient email is required');
    }

    if (!message.subject || message.subject.trim() === '') {
      throw new Error('Email subject is required');
    }

    if (!message.body || message.body.trim() === '') {
      throw new Error('Email body is required');
    }

    // Validate email addresses
    const recipients = Array.isArray(message.to) ? message.to : [message.to];
    for (const email of recipients) {
      if (!this.validateEmail(email)) {
        throw new Error(`Invalid email address: ${email}`);
      }
    }

    if (message.from && !this.validateEmail(message.from)) {
      throw new Error(`Invalid from email address: ${message.from}`);
    }
  }

  /**
   * Prepare email payload for API
   */
  private preparePayload(message: EmailMessage): Record<string, unknown> {
    return {
      to: message.to,
      from: message.from || this.config.defaultFrom,
      subject: message.subject,
      body: message.body,
      html: message.html,
      cc: message.cc,
      bcc: message.bcc,
      attachments: message.attachments,
      replyTo: message.replyTo,
      priority: message.priority || 'normal',
    };
  }

  /**
   * Make API call (simulated)
   */
  private async makeApiCall(
    endpoint: string,
    data?: unknown
  ): Promise<unknown> {
    const url = `${this.config.baseUrl || 'https://api.oxinion.com/email'}${endpoint}`;

    // Simulate API call delay
    await this.sleep(Math.random() * 500 + 100);

    console.log(`API Call to ${url}`, data);

    // Simulate occasional failures for testing
    if (Math.random() < 0.05) {
      throw new Error('API call failed');
    }

    return { success: true };
  }

  /**
   * Process email template
   */
  private processTemplate(
    template: EmailTemplate,
    variables: Record<string, unknown>
  ): { subject: string; body: string; html?: string } {
    // Simple template variable replacement
    let subject = `Template: ${template.name}`;
    let body = `Hello, this is a template email with variables: ${JSON.stringify(variables)}`;
    let html = `<h1>Template: ${template.name}</h1><p>Variables: ${JSON.stringify(variables)}</p>`;

    return { subject, body, html };
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get client configuration
   */
  getConfig(): Readonly<EmailConfig> {
    return { ...this.config };
  }
}

// Export default instance creation helper
export function createEmailClient(config: EmailConfig): EmailClient {
  return new EmailClient(config);
}
