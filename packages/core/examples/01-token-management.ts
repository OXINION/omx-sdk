/**
 * Example 1: Basic JWT Token Management with Supabase
 */

import { AuthConfig, CoreAuth } from '@omx-sdk/core';

// Configuration for your business
const config: AuthConfig = {
  clientId: 'your-business-client-id',
  secretKey: 'your-business-secret-key',
};

async function fetchAndCacheJWTExample() {
  try {
    // Initialize the core auth
    const auth = new CoreAuth(config);

    console.log('🔐 Fetching JWT token...');

    // Get a JWT token (will be cached automatically)
    const token = await auth.getToken();
    console.log('✅ Token received and cached');

    // Check token info
    const tokenInfo = auth.getTokenInfo();
    console.log('📊 Token info:', {
      isValid: tokenInfo.isValid,
      expiresAt: new Date(tokenInfo.expiresAt!).toISOString(),
      cachedAt: new Date(tokenInfo.cachedAt!).toISOString(),
    });

    // Get token again (should use cached version)
    console.log('🔄 Getting token again (from cache)...');
    const cachedToken = await auth.getToken();
    console.log('✅ Token retrieved from cache');

    // Force refresh token
    console.log('🔄 Forcing token refresh...');
    const refreshedToken = await auth.getToken(true);
    console.log('✅ Token refreshed');

    // Clean up
    auth.dispose();
  } catch (error) {
    console.error('❌ Authentication failed:', error);
  }
}

export { fetchAndCacheJWTExample };
