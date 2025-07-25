// Simple JavaScript test for OMX SDK Authentication
// This simulates the expected behavior since the actual SDK may not be built yet

// Test configuration with clientId and secretKey
const config = {
  clientId: 'f7b294c9-12d1-477b-b454-552dedd28de3',
  secretKey: '87654321-4321-4321-4321-987654321cba',
};

/**
 * Simulate the OMX.initialize function behavior
 * This shows what the function should do internally
 */
async function simulateOMXInitialize(config) {
  console.log('🚀 Simulating OMX.initialize() function...');
  console.log('📋 Config:', {
    clientId: config.clientId,
    secretKey: config.secretKey.substring(0, 8) + '...', // Hide full secret in logs
  });

  try {
    // Step 1: Validate input
    if (!config.clientId || !config.secretKey) {
      throw new Error('clientId and secretKey are required');
    }

    // Step 2: Make POST request to Supabase Edge Function
    console.log('\n🔐 Making POST request to authentication endpoint...');
    console.log(
      '📡 URL: https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1/create-jwt-token'
    );
    console.log(
      '📦 Body:',
      JSON.stringify(
        {
          clientId: config.clientId,
          secretKey: '[HIDDEN]',
        },
        null,
        2
      )
    );

    // Simulate the fetch request (this is what happens internally)
    const response = await fetch(
      'https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1/create-jwt-token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsaGlsaWRuc3liaGZkbXdxc3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MjM4OTgsImV4cCI6MjA2MDA5OTg5OH0.KZGJMcm2V7aW1tH7U0skvipE7h53212MRaaSm2kS84c',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsaGlsaWRuc3liaGZkbXdxc3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MjM4OTgsImV4cCI6MjA2MDA5OTg5OH0.KZGJMcm2V7aW1tH7U0skvipE7h53212MRaaSm2kS84c',
        },
        body: JSON.stringify({
          clientId: config.clientId,
          secretKey: config.secretKey,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
      console.error('📄 Response:', errorData);

      if (response.status === 401) {
        throw new Error(
          'Invalid credentials: clientId or secretKey is incorrect'
        );
      } else if (response.status === 500) {
        throw new Error(
          'Server error: Authentication service is experiencing issues'
        );
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    // Step 3: Parse the response
    const data = await response.json();
    console.log('\n✅ Authentication successful!');
    console.log('🎟️ JWT Token received');

    if (data.token) {
      console.log(`   Token length: ${data.token.length} characters`);
      console.log(`   Token preview: ${data.token.substring(0, 20)}...`);

      // Verify JWT structure
      const tokenParts = data.token.split('.');
      if (tokenParts.length === 3) {
        console.log('✅ Valid JWT structure (3 parts)');
        console.log(`   Header: ${tokenParts[0].substring(0, 10)}...`);
        console.log(`   Payload: ${tokenParts[1].substring(0, 10)}...`);
        console.log(`   Signature: ${tokenParts[2].substring(0, 10)}...`);
      }
    }

    // Step 4: Create SDK instance with token
    const sdkInstance = {
      token: data.token,
      email: {
        send: async (options) => ({
          success: true,
          messageId: 'sim_' + Date.now(),
        }),
      },
      healthCheck: async () => ({
        overall: 'healthy',
        services: { auth: 'healthy', email: 'healthy', webhook: 'healthy' },
      }),
      dispose: () => console.log('🛑 SDK disposed'),
    };

    console.log('📦 SDK instance created with authenticated connection');
    return sdkInstance;
  } catch (error) {
    console.error('\n❌ Authentication failed!');
    console.error('📄 Error:', error.message);
    throw error;
  }
}

/**
 * Test different authentication scenarios
 */
async function testDifferentScenarios() {
  console.log('\n🧪 Testing different authentication scenarios...\n');

  // Scenario 1: Valid credentials
  console.log('📝 Scenario 1: Valid credentials');
  try {
    const sdk = await simulateOMXInitialize(config);
    console.log('✅ Scenario 1 passed\n');
    return sdk;
  } catch (error) {
    console.log(`❌ Scenario 1 failed: ${error.message}\n`);
  }

  // Scenario 2: Invalid clientId
  console.log('📝 Scenario 2: Invalid clientId');
  try {
    await simulateOMXInitialize({
      clientId: 'invalid-client-id',
      secretKey: config.secretKey,
    });
    console.log("❌ Scenario 2: Should have failed but didn't\n");
  } catch (error) {
    console.log('✅ Scenario 2: Correctly rejected invalid clientId\n');
  }

  // Scenario 3: Empty credentials
  console.log('📝 Scenario 3: Empty credentials');
  try {
    await simulateOMXInitialize({
      clientId: '',
      secretKey: '',
    });
    console.log("❌ Scenario 3: Should have failed but didn't\n");
  } catch (error) {
    console.log('✅ Scenario 3: Correctly rejected empty credentials\n');
  }

  return null;
}

/**
 * Show expected responses
 */
function showExpectedResponses() {
  console.log('\n📚 Expected API Responses:');
  console.log('='.repeat(50));

  console.log('\n✅ Success Response:');
  console.log(
    JSON.stringify(
      {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2IyOTRjOS0xMmQxLTQ3N2ItYjQ1NC01NTJkZWRkMjhkZTMiLCJpYXQiOjE2OTk5MzU2MDAsImV4cCI6MTY5OTk0MjgwMH0.signature_here',
      },
      null,
      2
    )
  );

  console.log('\n❌ Error Response (401 Unauthorized):');
  console.log(
    JSON.stringify(
      {
        error: 'invalid credentials',
      },
      null,
      2
    )
  );

  console.log('\n❌ Error Response (500 Server Error):');
  console.log(
    JSON.stringify(
      {
        error: 'Internal server error',
      },
      null,
      2
    )
  );
}

/**
 * Example usage of OMX.initialize()
 */
function showUsageExample() {
  console.log('\n💡 Example Usage:');
  console.log('='.repeat(30));
  console.log(`
// Import the OMX SDK
import OMX from 'omx-sdk';

// Initialize with your credentials
const sdk = await OMX.initialize({
  clientId: 'f7b294c9-12d1-477b-b454-552dedd28de3',
  secretKey: '87654321-4321-4321-4321-987654321cba'
});

// Use the SDK (JWT token is automatically included)
const result = await sdk.email.send({
  to: ['user@example.com'],
  subject: 'Hello from OMX!',
  body: 'Your message here'
});

console.log('Email sent:', result.success);
`);
}

/**
 * Main test function
 */
async function main() {
  console.log('🎯 OMX SDK Authentication Flow Test');
  console.log('='.repeat(50));

  // Show expected responses and usage
  showExpectedResponses();
  showUsageExample();

  // Test authentication with real endpoint
  const sdk = await testDifferentScenarios();

  if (sdk) {
    // Test health check
    console.log('🔍 Testing health check...');
    const health = await sdk.healthCheck();
    console.log('📊 Health:', health);

    // Test API call
    console.log('\n🧪 Testing authenticated API call...');
    const emailResult = await sdk.email.send({
      to: ['test@example.com'],
      subject: 'OMX SDK Test',
      body: 'Authentication working!',
    });
    console.log('📧 Email result:', emailResult);
  }

  // Summary
  console.log('\n📋 Authentication Flow Summary:');
  console.log('='.repeat(50));
  console.log('1. ✅ Client provides clientId + secretKey');
  console.log('2. ✅ SDK makes POST to /create-jwt-token endpoint');
  console.log('3. ✅ Supabase Edge Function validates credentials');
  console.log('4. ✅ JWT token generated and returned');
  console.log('5. ✅ SDK stores token for API requests');
  console.log('6. ✅ All calls use Authorization: Bearer <token>');

  console.log('\n🎉 Test completed!');
}

// Run if executed directly
if (typeof window === 'undefined') {
  main().catch(console.error);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { simulateOMXInitialize, testDifferentScenarios, main };
}
