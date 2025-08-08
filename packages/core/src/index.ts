/**
 * @omx-sdk/core
 * Core module for OMX SDK with authentication and shared utilities
 */

export * from "./client.js";
export { CoreAuth, SUPABASE_FN_BASE_URL } from "./core.js";
export * from "./errors.js";
export * from "./types.js";

// Import for convenience function
import { CoreAuth } from "./core.js";
import type { AuthConfig } from "./types.js";

// Convenience function to create CoreAuth instance
export function createCoreAuth(config: AuthConfig) {
	return new CoreAuth(config);
}
