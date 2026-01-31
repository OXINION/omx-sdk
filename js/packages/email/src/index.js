export class EmailManager {
    client;
    constructor(client) {
        this.client = client;
    }
    async send(data) {
        return this.client.makeRequest('/emails/send', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    async sendBulk(emails) {
        return this.client.makeRequest('/emails/send-bulk', {
            method: 'POST',
            body: JSON.stringify({ emails }),
        });
    }
    async getStatus(messageId) {
        return this.client.makeRequest(`/emails/${messageId}/status`);
    }
    async getTemplates() {
        return this.client.makeRequest('/emails/templates');
    }
    async createTemplate(template) {
        return this.client.makeRequest('/emails/templates', {
            method: 'POST',
            body: JSON.stringify(template),
        });
    }
    async updateTemplate(id, template) {
        return this.client.makeRequest(`/emails/templates/${id}`, {
            method: 'PUT',
            body: JSON.stringify(template),
        });
    }
    async deleteTemplate(id) {
        return this.client.makeRequest(`/emails/templates/${id}`, {
            method: 'DELETE',
        });
    }
    async createCampaign(campaign) {
        return this.client.makeRequest('/emails/campaigns', {
            method: 'POST',
            body: JSON.stringify(campaign),
        });
    }
    async getCampaigns() {
        return this.client.makeRequest('/emails/campaigns');
    }
    async sendCampaign(campaignId) {
        return this.client.makeRequest(`/emails/campaigns/${campaignId}/send`, {
            method: 'POST',
        });
    }
    async getCampaignStats(campaignId) {
        return this.client.makeRequest(`/emails/campaigns/${campaignId}/stats`);
    }
}
//# sourceMappingURL=index.js.map