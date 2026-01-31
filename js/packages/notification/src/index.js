export class NotificationManager {
    client;
    constructor(client) {
        this.client = client;
    }
    async sendPushNotification(data) {
        return this.client.makeRequest('/notifications/push', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    async sendBulkNotifications(notifications) {
        return this.client.makeRequest('/notifications/bulk', {
            method: 'POST',
            body: JSON.stringify({ notifications }),
        });
    }
    async registerPushToken(tokenData) {
        return this.client.makeRequest('/notifications/tokens', {
            method: 'POST',
            body: JSON.stringify(tokenData),
        });
    }
    async unregisterPushToken(userId, deviceToken) {
        return this.client.makeRequest('/notifications/tokens', {
            method: 'DELETE',
            body: JSON.stringify({ userId, deviceToken }),
        });
    }
    async getTemplates() {
        return this.client.makeRequest('/notifications/templates');
    }
    async sendFromTemplate(templateId, userId, data) {
        return this.client.makeRequest('/notifications/template', {
            method: 'POST',
            body: JSON.stringify({ templateId, userId, data }),
        });
    }
}
//# sourceMappingURL=index.js.map