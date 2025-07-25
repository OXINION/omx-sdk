/**
 * @omx-sdk/core
 * Core module for OMX SDK with authentication and shared utilities
 */
export * from './client.js';
export { CoreAuth } from './core.js';
export * from './errors.js';
export * from './types.js';
import { CoreAuth } from './core.js';
import type { AuthConfig } from './types.js';
export declare function createCoreAuth(config: AuthConfig): CoreAuth;
//# sourceMappingURL=index.d.ts.map