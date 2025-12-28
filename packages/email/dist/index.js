/**
 * @omx-sdk/email
 * Email sending functionality for omx-sdk
 */
export class EmailClient {
    constructor(omx) {
        this.omx = omx;
    }
    /**
     * Send a single email
     */
    async send(message) {
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
        }
        catch (error) {
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
    async sendBulk(messages, options) {
        const batchSize = options?.batchSize || 10;
        const delay = options?.delay || 1000;
        const results = [];
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
    async sendTemplate(template, recipients, variables) {
        try {
            const mergedVariables = { ...template.variables, ...variables };
            const processedContent = this.processTemplate(template, mergedVariables);
            const message = {
                to: recipients,
                from: this.omx.config.email?.defaultFrom,
                subject: processedContent.subject,
                body: processedContent.body,
                html: processedContent.html,
            };
            return await this.send(message);
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Template processing failed",
                statusCode: 500,
            };
        }
    }
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    async getDeliveryStatus(messageId) {
        return this.omx.request(`email-service/status/${messageId}`);
    }
    async getStats(dateFrom, dateTo) {
        return this.omx.request("email-service/stats", {
            method: "POST",
            body: { dateFrom, dateTo },
        });
    }
    validateMessage(message) {
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
    preparePayload(message) {
        return {
            to: message.to,
            from: message.from || this.omx.config.email?.defaultFrom,
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
    processTemplate(template, variables) {
        return {
            subject: `Template: ${template.name}`,
            body: `Hello, this is a template email with variables: ${JSON.stringify(variables)}`,
            html: `<h1>Template: ${template.name}</h1><p>Variables: ${JSON.stringify(variables)}</p>`,
        };
    }
    generateMessageId() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
/**
 * Attacher function: Attach Email module to an existing OmxClient
 */
export function email(omx) {
    return new EmailClient(omx);
}
//# sourceMappingURL=index.js.map