export class CampaignManager {
    client;
    constructor(client) {
        this.client = client;
    }
    async create(config) {
        return this.client.makeRequest('/campaigns', {
            method: 'POST',
            body: JSON.stringify(config),
        });
    }
    async list(status) {
        const params = status ? `?status=${status}` : '';
        return this.client.makeRequest(`/campaigns${params}`);
    }
    async get(id) {
        return this.client.makeRequest(`/campaigns/${id}`);
    }
    async update(id, config) {
        return this.client.makeRequest(`/campaigns/${id}`, {
            method: 'PUT',
            body: JSON.stringify(config),
        });
    }
    async delete(id) {
        return this.client.makeRequest(`/campaigns/${id}`, {
            method: 'DELETE',
        });
    }
    async activate(id) {
        return this.client.makeRequest(`/campaigns/${id}/activate`, {
            method: 'POST',
        });
    }
    async pause(id) {
        return this.client.makeRequest(`/campaigns/${id}/pause`, {
            method: 'POST',
        });
    }
    async resume(id) {
        return this.client.makeRequest(`/campaigns/${id}/resume`, {
            method: 'POST',
        });
    }
    async complete(id) {
        return this.client.makeRequest(`/campaigns/${id}/complete`, {
            method: 'POST',
        });
    }
    async getStats(id, period) {
        const params = period ? `?period=${period}` : '';
        return this.client.makeRequest(`/campaigns/${id}/stats${params}`);
    }
    async getExecutions(id, limit = 100, offset = 0) {
        return this.client.makeRequest(`/campaigns/${id}/executions?limit=${limit}&offset=${offset}`);
    }
    async triggerManual(id, userIds) {
        return this.client.makeRequest(`/campaigns/${id}/trigger`, {
            method: 'POST',
            body: JSON.stringify({ userIds }),
        });
    }
    async clone(id, newName) {
        return this.client.makeRequest(`/campaigns/${id}/clone`, {
            method: 'POST',
            body: JSON.stringify({ name: newName }),
        });
    }
    async testCampaign(id, testUserId) {
        return this.client.makeRequest(`/campaigns/${id}/test`, {
            method: 'POST',
            body: JSON.stringify({ userId: testUserId }),
        });
    }
}
//# sourceMappingURL=index.js.map