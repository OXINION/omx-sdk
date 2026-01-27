// Simple test to verify the import pattern works
import { createOmxClient } from "omx-sdk";

console.log("🚀 Testing OMX SDK import pattern...");

// Configuration for testing
const config = {
  clientId: "test-client-id",
  secretKey: "test-secret-key",
  email: {
    defaultFrom: "test@example.com",
  },
  geotrigger: {
    timeout: 10000,
  },
};

// Test the static initialize method
createOmxClient(config)
  .then((sdk) => {
    console.log("✅ OMX SDK initialized successfully!");
    console.log(`📦 SDK Version: ${sdk.VERSION}`);
    console.log("\n🔧 Available Services:");
    console.log(`  📍 Geotrigger: ${sdk.geoTrigger ? "✅" : "❌"}`);
    console.log(`  📧 Email: ${sdk.email ? "✅" : "❌"}`);
    console.log(`  🪝 Webhook: ${sdk.webhook ? "✅" : "❌"}`);
    console.log(`  📡 Beacon: ${sdk.beacon ? "✅" : "❌"}`);
    console.log(`  🔔 Notification: ${sdk.notification ? "✅" : "❌"}`);

    // Test health check
    console.log("\n🔍 Running health check...");
    return sdk.healthCheck();
  })
  .then((health) => {
    console.log(`📊 Overall Status: ${health.overall}`);
    console.log("📋 Service Status:");
    Object.entries(health.services).forEach(([service, status]) => {
      const icon =
        status === "healthy" ? "✅" : status === "degraded" ? "⚠️" : "❌";
      console.log(`  ${icon} ${service}: ${status}`);
    });

    console.log("\n🎉 Import pattern test completed successfully!");
    console.log(
      '💡 You can now use: import { createOmxClient } from "omx-sdk"; in your TypeScript/ES6 code',
    );
  })
  .catch((error) => {
    console.error("❌ Test failed:", error.message);
  });
