export class GeoTriggerManager {
    client;
    constructor(client) {
        this.client = client;
    }
    async create(config) {
        return this.client.makeRequest('/geotriggers', {
            method: 'POST',
            body: JSON.stringify(config),
        });
    }
    async list() {
        return this.client.makeRequest('/geotriggers');
    }
    async get(id) {
        return this.client.makeRequest(`/geotriggers/${id}`);
    }
    async update(id, config) {
        return this.client.makeRequest(`/geotriggers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(config),
        });
    }
    async delete(id) {
        return this.client.makeRequest(`/geotriggers/${id}`, {
            method: 'DELETE',
        });
    }
}
//# sourceMappingURL=index.js.map