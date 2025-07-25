const OMX = require('./packages/omx-sdk/dist/index.js');

// Test the import pattern
console.log('Testing OMX SDK import...');
console.log('OMX export:', typeof OMX, Object.keys(OMX));

// Test static initialize method
const testConfig = {
  apiKey: 'test-api-key',
  baseUrl: 'https://api.oxinion.com',
};

// Try both default export and named export
const SDKClass = OMX.default || OMX.OMXSDK || OMX;

console.log('SDK Class:', typeof SDKClass);
console.log('Has initialize method:', typeof SDKClass.initialize);

if (typeof SDKClass.initialize === 'function') {
  SDKClass.initialize(testConfig)
    .then((sdk) => {
      console.log('✅ SDK initialized successfully!');
      console.log('Available services:');
      console.log('- Geotrigger:', !!sdk.geotrigger);
      console.log('- Email:', !!sdk.email);
      console.log('- Webhook:', !!sdk.webhook);
      console.log('- Beacon:', !!sdk.beacon);
      console.log('- Push Notification:', !!sdk.pushNotification);

      // Test health check
      return sdk.healthCheck();
    })
    .then((health) => {
      console.log('🔍 Health check:', health);
      console.log('✅ Import pattern test completed successfully!');
    })
    .catch((error) => {
      console.error('❌ Test failed:', error);
    });
} else {
  console.error('❌ Initialize method not found');
}
