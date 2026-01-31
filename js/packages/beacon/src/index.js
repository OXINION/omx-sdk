export class BeaconManager {
    client;
    constructor(client) {
        this.client = client;
    }
    async create(config) {
        return this.client.makeRequest('/beacons', {
            method: 'POST',
            body: JSON.stringify(config),
        });
    }
    async list() {
        return this.client.makeRequest('/beacons');
    }
    async get(id) {
        return this.client.makeRequest(`/beacons/${id}`);
    }
    async update(id, config) {
        return this.client.makeRequest(`/beacons/${id}`, {
            method: 'PUT',
            body: JSON.stringify(config),
        });
    }
    async delete(id) {
        return this.client.makeRequest(`/beacons/${id}`, {
            method: 'DELETE',
        });
    }
    async activate(id) {
        return this.client.makeRequest(`/beacons/${id}/activate`, {
            method: 'POST',
        });
    }
    async deactivate(id) {
        return this.client.makeRequest(`/beacons/${id}/deactivate`, {
            method: 'POST',
        });
    }
    async createTrigger(config) {
        return this.client.makeRequest('/beacon-triggers', {
            method: 'POST',
            body: JSON.stringify(config),
        });
    }
    async getTriggers(beaconId) {
        return this.client.makeRequest(`/beacons/${beaconId}/triggers`);
    }
    async deleteTrigger(triggerId) {
        return this.client.makeRequest(`/beacon-triggers/${triggerId}`, {
            method: 'DELETE',
        });
    }
    async reportDetection(detection) {
        return this.client.makeRequest('/beacon-detections', {
            method: 'POST',
            body: JSON.stringify({
                ...detection,
                timestamp: new Date().toISOString(),
            }),
        });
    }
    async getDetectionHistory(beaconId, startDate, endDate) {
        const params = new URLSearchParams();
        if (startDate)
            params.append('startDate', startDate);
        if (endDate)
            params.append('endDate', endDate);
        const queryString = params.toString();
        const endpoint = queryString ? `/beacons/${beaconId}/detections?${queryString}` : `/beacons/${beaconId}/detections`;
        return this.client.makeRequest(endpoint);
    }
}
//# sourceMappingURL=index.js.map