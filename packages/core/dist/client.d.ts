/**
 * @omx-sdk/core
 * Core client module for OMX SDK with Supabase integration
 */
import { createClient } from '@supabase/supabase-js';
/**
 * Initialize Supabase client with JWT token
 */
export declare function initClient(jwt: string): void;
/**
 * Proxy to ensure client is initialized before use
 */
export declare const omxClient: ReturnType<typeof createClient>;
/**
 * Check if client is initialized
 */
export declare function isClientInitialized(): boolean;
/**
 * Get current client instance (for debugging)
 */
export declare function getClient(): import("@supabase/supabase-js").SupabaseClient<unknown, never, import("@supabase/supabase-js/dist/module/lib/types").GenericSchema>;
//# sourceMappingURL=client.d.ts.map