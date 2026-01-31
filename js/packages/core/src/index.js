export class OMXClient {
    config;
    baseUrl = 'https://omx.oxinion.com/v1';
    constructor(config = {}) {
        this.config = {
            clientId: config.clientId || process.env['OMX_CLIENT_ID'] || '',
            secretKey: config.secretKey || process.env['OMX_SECRET_KEY'] || ''
        };
        if (!this.config.clientId) {
            throw new Error('OMX Client ID is required. Provide via config or OMX_CLIENT_ID environment variable.');
        }
        if (!this.config.secretKey) {
            throw new Error('OMX Secret Key is required. Provide via config or OMX_SECRET_KEY environment variable.');
        }
    }
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
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
    get apiUrl() {
        return this.baseUrl;
    }
}
export function createOmxClient(config = {}) {
    return new OMXClient(config);
}
// Legacy export for backwards compatibility
export const createOMXClient = createOmxClient;
//# sourceMappingURL=index.js.map