#!/usr/bin/env node

/**
 * Demo script for @omx-sdk/core
 * This demonstrates the core aut    console.log('📋 Next steps:');
    console.log('1. Set up Supabase Edge Function (see README.md)');
    console.log('2. Replace demo credentials with real business credentials');
    console.log('3. Update supabaseFnUrl if using different environment');
    console.log('4. Integrate with your OMX SDK services');
    console.log('5. Run authentication with real API endpoints');cation functionality
 */

import { CoreAuth, createCoreAuth } from './dist/index.js';

// Demo configuration (replace with your actual values)
const demoConfig = {
  clientId: 'demo-client-id',
  secretKey: 'demo-secret-key', // In production, get this from omx.oxinion.com dashboard
  tokenCacheTtl: 50 * 60 * 1000, // 50 minutes
  maxRetries: 3,
  retryDelay: 1000,
};

async function runDemo() {
  console.log('🚀 OMX SDK Core Authentication Demo\n');

  try {
    // Example 1: Create authentication instance
    console.log('📦 Creating CoreAuth instance...');
    const auth = new CoreAuth(demoConfig);
    console.log('✅ CoreAuth instance created successfully\n');

    // Example 2: Alternative creation method
    console.log('🔧 Alternative creation using createCoreAuth...');
    const auth2 = createCoreAuth(demoConfig);
    console.log('✅ Alternative creation successful\n');

    // Example 3: Show configuration validation
    console.log('⚙️ Configuration validation example...');
    try {
      const invalidAuth = new CoreAuth({
        clientId: '', // Invalid
        secretKey: 'test',
        supabaseFnUrl: 'invalid-url', // Invalid
      });
    } catch (error) {
      console.log('✅ Configuration validation working:', error.message);
    }
    console.log();

    // Example 4: Token info when no token is cached
    console.log('📊 Token info (no cached token):');
    const initialTokenInfo = auth.getTokenInfo();
    console.log('  Is valid:', initialTokenInfo.isValid);
    console.log('  Expires at:', initialTokenInfo.expiresAt);
    console.log('  Cached at:', initialTokenInfo.cachedAt);
    console.log();

    // Example 5: Simulated API request (will fail gracefully)
    console.log('🌐 Simulated API request example...');
    try {
      const response = await auth.makeAuthenticatedRequest(
        'https://httpbin.org/get',
        {
          method: 'GET',
          timeout: 10000,
          retries: 1, // Reduce retries for demo
        }
      );

      if (response.success) {
        console.log('✅ API request successful:', response.status);
        console.log(
          '📄 Response headers:',
          Object.fromEntries(response.headers.entries())
        );
      } else {
        console.log('❌ API request failed:', response.error?.message);
      }
    } catch (error) {
      console.log(
        '❌ Expected authentication error (demo credentials):',
        error.message
      );
    }
    console.log();

    // Example 6: Configuration update
    console.log('🔄 Configuration update example...');
    auth.updateConfig({
      tokenCacheTtl: 30 * 60 * 1000, // 30 minutes
      maxRetries: 5,
    });
    console.log('✅ Configuration updated successfully\n');

    // Example 7: Clear token
    console.log('🧹 Clear token example...');
    auth.clearToken();
    const clearedTokenInfo = auth.getTokenInfo();
    console.log('✅ Token cleared. Is valid:', clearedTokenInfo.isValid);
    console.log();

    // Example 8: Dispose resources
    console.log('🗑️ Disposing resources...');
    auth.dispose();
    auth2.dispose();
    console.log('✅ Resources disposed successfully\n');

    console.log('🎉 Demo completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up Supabase RPC function (see README.md)');
    console.log('2. Replace demo credentials with real business credentials');
    console.log('3. Integrate with your OMX SDK services');
    console.log('4. Run authentication with real API endpoints');
  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Demo interrupted. Cleaning up...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Demo terminated. Cleaning up...');
  process.exit(0);
});

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo().catch(console.error);
}

export { runDemo };
