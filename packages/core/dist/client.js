/**
 * @omx-sdk/core
 * Core client module for OMX SDK with Supabase integration
 */
import { createClient } from '@supabase/supabase-js';
let supabase;
/**
 * Initialize Supabase client with JWT token
 */
export function initClient(jwt) {
    const supabaseUrl = 'https://blhilidnsybhfdmwqsrx.supabase.co';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsaGlsaWRuc3liaGZkbXdxc3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MjM4OTgsImV4cCI6MjA2MDA5OTg5OH0.KZGJMcm2V7aW1tH7U0skvipE7h53212MRaaSm2kS84c';
    supabase = createClient(supabaseUrl, anonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        },
    });
    console.log('✅ Supabase client initialized with JWT token');
}
/**
 * Proxy to ensure client is initialized before use
 */
export const omxClient = new Proxy({}, {
    get(_, key) {
        if (!supabase) {
            throw new Error('OMX client not initialized. Call OMX.initialize() first.');
        }
        return supabase[key];
    },
});
/**
 * Check if client is initialized
 */
export function isClientInitialized() {
    return !!supabase;
}
/**
 * Get current client instance (for debugging)
 */
export function getClient() {
    return supabase;
}
//# sourceMappingURL=client.js.map