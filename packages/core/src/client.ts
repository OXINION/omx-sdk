/**
 * @omx-sdk/core
 * Core client module for OMX SDK
 */

import { CoreAuth } from "./core.js";
import { OmxConfig } from "./types.js";

/**
 * Main OMX Client class that manages authentication and shared state
 */
export class OmxClient {
  public core: CoreAuth;
  public config: OmxConfig;

  constructor(config: OmxConfig) {
    this.config = config;
    this.core = new CoreAuth(config);
  }

  /**
   * @deprecated Use .core instead. Will be removed in v2.0.0
   */
  get auth(): CoreAuth {
    return this.core;
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

    const response = await this.core.makeAuthenticatedRequest<T>(url, options);
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
