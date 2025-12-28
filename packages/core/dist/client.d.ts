/**
 * @omx-sdk/core
 * Core client module for OMX SDK
 */
import { createClient } from "@supabase/supabase-js";
import { CoreAuth } from "./core.js";
import { OmxConfig } from "./types.js";
/**
 * Main OMX Client class that manages authentication and shared state
 */
export declare class OmxClient {
    auth: CoreAuth;
    private _supabase;
    config: OmxConfig;
    constructor(config: OmxConfig);
    /**
     * Get an authenticated Supabase client
     */
    getSupabase(): Promise<ReturnType<typeof createClient>>;
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