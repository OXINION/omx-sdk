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
export class OmxClient {
  public auth: CoreAuth;
  private _supabase: ReturnType<typeof createClient> | null = null;
  public config: OmxConfig;

  constructor(config: OmxConfig) {
    this.config = config;
    this.auth = new CoreAuth(config);
  }

  /**
   * Get an authenticated Supabase client
   */
  async getSupabase(): Promise<ReturnType<typeof createClient>> {
    const jwt = await this.auth.getToken();
    
    if (!this.config.supabaseUrl) {
      throw new Error("supabaseUrl is required in OmxConfig");
    }
    if (!this.config.supabaseAnonKey) {
      throw new Error("supabaseAnonKey is required in OmxConfig");
    }
    
    const supabaseUrl = this.config.supabaseUrl;
    const anonKey = this.config.supabaseAnonKey;

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
    } else {
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
  async request<T = any>(endpoint: string, options: any = {}): Promise<T> {
    if (!this.config.baseUrl) {
      throw new Error("baseUrl is required in OmxConfig for making requests");
    }
    
    const baseUrl = this.config.baseUrl;
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${baseUrl}/${endpoint}`;

    const response = await this.auth.makeAuthenticatedRequest<T>(url, options);
    if (!response.success) {
      throw new Error(response.error?.message || "Request failed");
    }
    return response.data as T;
  }
}

/**
 * The sole initializer for the OMX SDK
 */
export function createOmxClient(config: OmxConfig): OmxClient {
  return new OmxClient(config);
}
