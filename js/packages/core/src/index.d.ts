export interface OMXClientConfig {
    clientId?: string;
    secretKey?: string;
}
export declare class OMXClient {
    private config;
    private readonly baseUrl;
    constructor(config?: OMXClientConfig);
    makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T>;
    get clientId(): string;
    get secretKey(): string;
    get apiUrl(): string;
}
export declare function createOmxClient(config?: OMXClientConfig): OMXClient;
export declare const createOMXClient: typeof createOmxClient;
//# sourceMappingURL=index.d.ts.map