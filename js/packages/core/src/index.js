import { DEFAULT_BASE_URL } from '@omx-sdk/shared';

export class OMXClient {
    config;
    constructor(config) {
        this.config = {
            baseUrl: DEFAULT_BASE_URL,
            ...config
        };
    }
    async makeRequest(endpoint, options = {}) {
        const url = `${this.config.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.secretKey}`,
            'X-Client-ID': this.config.clientId,
            ...options.headers,
        };
        const response = await fetch(url, {
            ...options,
            headers,
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }
    get clientId() {
        return this.config.clientId;
    }
    get secretKey() {
        return this.config.secretKey;
    }
    get baseUrl() {
        return this.config.baseUrl || DEFAULT_BASE_URL;
    }
}
export function createOMXClient(config) {
    return new OMXClient(config);
}
//# sourceMappingURL=index.js.map