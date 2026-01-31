export class WebhookManager {
    client;
    constructor(client) {
        this.client = client;
    }
    async sendWebhook(data) {
        return this.client.makeRequest('/webhooks/send', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    async create(config) {
        return this.client.makeRequest('/webhooks', {
            method: 'POST',
            body: JSON.stringify(config),
        });
    }
    async list() {
        return this.client.makeRequest('/webhooks');
    }
    async delete(id) {
        return this.client.makeRequest(`/webhooks/${id}`, {
            method: 'DELETE',
        });
    }
}
//# sourceMappingURL=index.js.map