export interface OMXClientConfig {
    clientId: string;
    secretKey: string;
    baseUrl?: string;
}
export declare class OMXClient {
    private config;
    constructor(config: OMXClientConfig);
    makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T>;
    get clientId(): string;
    get secretKey(): string;
    get baseUrl(): string;
}
export declare function createOMXClient(config: OMXClientConfig): OMXClient;
//# sourceMappingURL=index.d.ts.map