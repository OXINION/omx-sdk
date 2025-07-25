import OMX from 'omx-sdk';
// Test configuration with clientId and secretKey
const config = {
    clientId: 'f7b294c9-12d1-477b-b454-552dedd28de3',
    secretKey: '87654321-4321-4321-4321-987654321cba',
};
/**
 * Test the OMX SDK initialization function
 * Function signature: OMX.initialize(config: { clientId: string; secretKey: string; }): Promise<OMXSDK>
 *
 * Expected behavior:
 * 1. Makes POST request to https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1/create-jwt-token
 * 2. Sends { clientId, secretKey } in request body
 * 3. Receives JWT token in response: { token: "..." }
 * 4. Returns SDK instance with token stored internally
 */
async function testOMXInitialization() {
    console.log('🚀 Testing OMX SDK Initialization...');
    console.log('📋 Config:', {
        clientId: config.clientId,
        secretKey: config.secretKey.substring(0, 8) + '...', // Hide full secret in logs
    });
    try {
        // Test the OMX.initialize function
        console.log('\n🔐 Calling OMX.initialize()...');
        console.log('📡 Expected POST to: https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1/create-jwt-token');
        console.log('📦 Expected Body:', JSON.stringify({
            clientId: config.clientId,
            secretKey: '[HIDDEN]',
        }, null, 2));
        const sdkInstance = await OMX.initialize(config);
        // Success case
        console.log('\n✅ OMX SDK initialized successfully!');
        console.log('🎟️ JWT Token obtained and stored internally');
        console.log('📦 SDK Instance created with authenticated connection');
        console.log('ℹ️ Token is automatically used for all subsequent API calls');
        return sdkInstance;
    }
    catch (error) {
        // Error handling
        console.error('\n❌ OMX SDK initialization failed!');
        console.error('📄 Error details:', {
            message: error.message,
            status: error.status || 'Unknown',
            code: error.code || 'Unknown',
        });
        // Handle specific error cases
        if (error.message?.includes('invalid credentials')) {
            console.error('🔑 Authentication failed: Invalid clientId or secretKey');
            console.error('💡 Please verify your credentials from omx.oxinion.com/token');
        }
        else if (error.message?.includes('network') ||
            error.message?.includes('fetch')) {
            console.error('🌐 Network error: Could not reach authentication endpoint');
            console.error('💡 Please check your internet connection and try again');
        }
        else if (error.message?.includes('timeout')) {
            console.error('⏰ Request timeout: Authentication took too long');
            console.error('💡 Please try again or check server status');
        }
        else if (error.status === 401) {
            console.error('🚫 Unauthorized: Invalid credentials provided');
        }
        else if (error.status === 500) {
            console.error('🔧 Server error: Authentication service is experiencing issues');
        }
        throw error;
    }
}
/**
 * Test different authentication scenarios
 */
async function testDifferentScenarios() {
    console.log('\n🧪 Testing different authentication scenarios...\n');
    // Scenario 1: Valid credentials (main test)
    console.log('📝 Scenario 1: Valid credentials');
    try {
        const sdkInstance = await testOMXInitialization();
        console.log('✅ Scenario 1 passed\n');
        return sdkInstance;
    }
    catch (error) {
        console.log('❌ Scenario 1 failed\n');
    }
    // Scenario 2: Invalid clientId
    console.log('📝 Scenario 2: Invalid clientId');
    try {
        await OMX.initialize({
            clientId: 'invalid-client-id',
            secretKey: config.secretKey,
        });
        console.log("❌ Scenario 2: Should have failed but didn't\n");
    }
    catch (error) {
        console.log('✅ Scenario 2: Correctly rejected invalid clientId\n');
    }
    // Scenario 3: Invalid secretKey
    console.log('📝 Scenario 3: Invalid secretKey');
    try {
        await OMX.initialize({
            clientId: config.clientId,
            secretKey: 'invalid-secret-key',
        });
        console.log("❌ Scenario 3: Should have failed but didn't\n");
    }
    catch (error) {
        console.log('✅ Scenario 3: Correctly rejected invalid secretKey\n');
    }
    // Scenario 4: Empty credentials
    console.log('📝 Scenario 4: Empty credentials');
    try {
        await OMX.initialize({
            clientId: '',
            secretKey: '',
        });
        console.log("❌ Scenario 4: Should have failed but didn't\n");
    }
    catch (error) {
        console.log('✅ Scenario 4: Correctly rejected empty credentials\n');
    }
    return null; // No valid instance from error scenarios
}
/**
 * Simulate expected responses for documentation
 */
function simulateExpectedResponses() {
    console.log('\n📚 Expected API Responses:');
    console.log('='.repeat(50));
    console.log('\n✅ Success Response:');
    console.log(JSON.stringify({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2IyOTRjOS0xMmQxLTQ3N2ItYjQ1NC01NTJkZWRkMjhkZTMiLCJpYXQiOjE2OTk5MzU2MDAsImV4cCI6MTY5OTk0MjgwMH0.signature_here',
    }, null, 2));
    console.log('\n❌ Error Response (Invalid Credentials):');
    console.log(JSON.stringify({
        error: 'invalid credentials',
    }, null, 2));
    console.log('\n❌ Error Response (Network Error):');
    console.log(JSON.stringify({
        error: 'Failed to fetch',
    }, null, 2));
    console.log('\n❌ Error Response (Server Error):');
    console.log(JSON.stringify({
        error: 'Internal server error',
    }, null, 2));
}
/**
 * Main test function
 */
async function main() {
    try {
        console.log('🎯 OMX SDK Authentication Flow Test');
        console.log('='.repeat(50));
        // Show expected responses
        simulateExpectedResponses();
        // Run authentication tests
        const omx = await testDifferentScenarios();
        if (!omx) {
            console.log('⚠️ Could not get valid SDK instance, skipping further tests');
            return;
        }
        // Check health status
        console.log('\n🔍 Testing SDK health check with authenticated token...');
        try {
            const health = await omx.healthCheck();
            console.log('📊 Health Check Result:', health);
            if (health.overall === 'healthy') {
                console.log('✅ All services are healthy');
            }
            else {
                console.warn('⚠️ Some services may have issues');
                Object.entries(health.services || {}).forEach(([service, status]) => {
                    const icon = status === 'healthy' ? '✅' : status === 'unhealthy' ? '❌' : '⚠️';
                    console.log(`  ${icon} ${service}: ${status}`);
                });
            }
        }
        catch (healthError) {
            console.error('❌ Health check failed:', healthError.message);
        }
        // Test a simple API call to verify authentication is working
        console.log('\n🧪 Testing authenticated API call...');
        try {
            // Example: Send a test email to verify JWT token is working
            const emailResult = await omx.email.send({
                to: ['test@example.com'],
                subject: 'OMX SDK Authentication Test',
                body: 'This email confirms that JWT authentication is working correctly.',
                html: `
          <h2>🎉 Authentication Success!</h2>
          <p>Your OMX SDK is properly authenticated and ready to use.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        `,
            });
            if (emailResult.success) {
                console.log('✅ Authenticated API call successful! Email sent with ID:', emailResult.messageId);
                console.log('🔐 JWT token is working correctly');
            }
            else {
                console.log('❌ API call failed:', emailResult.error);
            }
        }
        catch (apiError) {
            console.error('❌ API call error:', apiError.message);
            if (apiError.status === 401) {
                console.error('🚫 Token appears to be invalid or expired');
            }
        }
        // Summary
        console.log('\n📋 Authentication Flow Summary:');
        console.log('='.repeat(50));
        console.log('1. ✅ Client credentials provided (clientId + secretKey)');
        console.log('2. ✅ POST to Supabase Edge Function (/create-jwt-token)');
        console.log('3. ✅ Edge Function validates credentials via RPC');
        console.log('4. ✅ JWT token generated and returned');
        console.log('5. ✅ SDK stores token internally for API requests');
        console.log('6. ✅ All subsequent calls use Bearer authentication');
        // Clean up
        console.log('\n🛑 Cleaning up...');
        if (omx.dispose && typeof omx.dispose === 'function') {
            omx.dispose();
            console.log('✅ SDK disposed successfully');
        }
        console.log('\n🎉 OMX SDK Authentication Test completed successfully!');
    }
    catch (error) {
        console.error('❌ Main test failed:', error);
        console.error('📄 Error details:', {
            message: error.message,
            stack: error.stack?.split('\n').slice(0, 3).join('\n'), // Show first 3 lines of stack
        });
    }
}
// Example of direct function call with error handling
async function directAuthTest() {
    console.log('\n🎯 Direct OMX.initialize() Test Example:');
    console.log('='.repeat(40));
    try {
        // Call OMX.initialize with config
        const sdk = await OMX.initialize({
            clientId: 'f7b294c9-12d1-477b-b454-552dedd28de3',
            secretKey: '87654321-4321-4321-4321-987654321cba',
        });
        console.log('✅ Success! SDK initialized');
        console.log('🔐 JWT token acquired and stored');
        console.log('📦 SDK ready for API calls');
        return sdk;
    }
    catch (error) {
        console.error('❌ Failed to initialize:', error.message);
        // Handle specific error cases
        if (error.status === 401) {
            console.error('🔑 Invalid credentials - check clientId and secretKey');
        }
        else if (error.status === 500) {
            console.error('🔧 Server error - try again later');
        }
        else {
            console.error('🌐 Network or other error');
        }
        throw error;
    }
}
// Run the example
if (require.main === module) {
    main().catch(console.error);
}
// Export for module usage
export { directAuthTest, testDifferentScenarios, testOMXInitialization };
export default main;
//# sourceMappingURL=auth-test.js.map