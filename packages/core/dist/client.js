/**
 * @omx-sdk/core
 * Core client module for OMX SDK
 */
import { createClient } from "@supabase/supabase-js";
import { CoreAuth } from "./core.js";
/**
 * Main OMX Client class that manages authentication and shared state
 */
export class OmxClient {
    constructor(config) {
        this._supabase = null;
        this.config = config;
        this.auth = new CoreAuth(config);
    }
    /**
     * Get an authenticated Supabase client
     */
    async getSupabase() {
        const jwt = await this.auth.getToken();
        const supabaseUrl = this.config.supabaseUrl || "https://blhilidnsybhfdmwqsrx.supabase.co";
        const anonKey = this.config.supabaseAnonKey ||
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsaGlsaWRuc3liaGZkbXdxc3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MjM4OTgsImV4cCI6MjA2MDA5OTg5OH0.KZGJMcm2V7aW1tH7U0skvipE7h53212MRaaSm2kS84c";
        // Re-create client if JWT changed or not yet created
        // Simplified for now: always create a fresh proxy or check if existing one is valid
        // For now, let's just create it if it doesn't exist
        if (!this._supabase) {
            this._supabase = createClient(supabaseUrl, anonKey, {
                global: {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                },
            });
        }
        else {
            // Update headers if already exists
            // Note: supabase-js doesn't easily allow updating headers on an existing client instance's global headers
            // but we can create a new one as it's lightweight.
            this._supabase = createClient(supabaseUrl, anonKey, {
                global: {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                },
            });
        }
        return this._supabase;
    }
    /**
     * Helper to make authenticated requests directly
     */
    async request(endpoint, options = {}) {
        const baseUrl = this.config.baseUrl ||
            "https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1";
        const url = endpoint.startsWith("http")
            ? endpoint
            : `${baseUrl}/${endpoint}`;
        const response = await this.auth.makeAuthenticatedRequest(url, options);
        if (!response.success) {
            throw new Error(response.error?.message || "Request failed");
        }
        return response.data;
    }
}
/**
 * The sole initializer for the OMX SDK
 */
export function createOmxClient(config) {
    return new OmxClient(config);
}
//# sourceMappingURL=client.js.map