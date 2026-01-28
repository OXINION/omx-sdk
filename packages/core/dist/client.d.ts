/**
 * @omx-sdk/core
 * Core client module for OMX SDK
 */
import { CoreAuth } from "./core.js";
import { OmxConfig } from "./types.js";
/**
 * Main OMX Client class that manages authentication and shared state
 */
export declare class OmxClient {
    core: CoreAuth;
    config: OmxConfig;
    constructor(config: OmxConfig);
    /**
     * @deprecated Use .core instead. Will be removed in v2.0.0
     */
    get auth(): CoreAuth;
    /**
     * Helper to make authenticated requests directly
     */
    request<T = any>(endpoint: string, options?: any): Promise<T>;
}
/**
 * The sole initializer for the OMX SDK
 */
export declare function createOmxClient(config: OmxConfig): OmxClient;
//# sourceMappingURL=client.d.ts.map