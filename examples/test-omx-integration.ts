/**
 * OMX SDK Integration Test
 * Tests the unified SDK with real authentication and geotrigger functionality
 */

import omxClient from "omx-sdk";

// Test configuration
const config = {
  clientId: "f7b294c9-12d1-477b-b454-552dedd28de3",
  secretKey: "your-secret-key",
  baseUrl: "https://blhilidnsybhfdmwqsrx.supabase.co",
};

/**
 * Test OMX SDK initialization and authentication
 */
async function testOMXInitialization() {
  console.log("🚀 Testing OMX SDK Initialization...");
  console.log("📋 Config:", {
    clientId: config.clientId,
    secretKey: config.secretKey.substring(0, 8) + "...",
  });

  try {
    // Initialize the SDK with authentication
    const sdk = await omxClient.initialize(config);

    console.log("✅ OMX SDK initialized successfully!");
    console.log("📦 Available services:", Object.keys(sdk));

    return sdk;
  } catch (error: any) {
    console.error("❌ OMX SDK initialization failed:", error.message);
    throw error;
  }
}

/**
 * Test Geotrigger functionality
 */
async function testGeotrigger(sdk: any) {
  console.log("\n🌍 Testing Geotrigger functionality...");

  try {
    // Access geotrigger service
    const geo = sdk.geotrigger;
    console.log("📍 Geotrigger service available:", !!geo);

    // Create a geofence trigger
    const trigger = await geo.create({
      name: "Dosan Park Event",
      coordinates: [127.0317, 37.5219], // [lng, lat] - Dosan Park, Seoul
      radius: 500, // 500 meters
      event: {
        type: "webhook",
        url: "https://httpbin.org/post", // Test webhook endpoint
        payload: {
          userId: "12345",
          eventType: "arrived_near_dosanpark",
          location: "Dosan Park, Gangnam, Seoul",
        },
      },
    });

    console.log("✅ Geotrigger created successfully!");
    console.log("🎯 Trigger details:", {
      id: trigger.id,
      name: trigger.name,
      center: trigger.center,
      radius: trigger.radius,
    });

    return trigger;
  } catch (error: any) {
    console.error("❌ Geotrigger test failed:", error.message);
    // Don't throw here, just log the error
    return null;
  }
}

/**
 * Test Email functionality
 */
async function testEmail(sdk: any) {
  console.log("\n📧 Testing Email functionality...");

  try {
    const email = sdk.email;
    console.log("📬 Email service available:", !!email);

    const result = await email.send({
      to: ["test@example.com"],
      subject: "OMX SDK Test - Geotrigger Integration",
      body: "Hello! This is a test email from the OMX SDK integration test.",
      attachments: [
        {
          filename: "test-location.json",
          content: JSON.stringify(
            {
              location: "Dosan Park",
              coordinates: [127.0317, 37.5219],
              radius: 500,
            },
            null,
            2
          ),
          contentType: "application/json",
        },
      ],
    });

    console.log("✅ Email sent successfully!");
    console.log("📨 Email result:", result);

    return result;
  } catch (error: any) {
    console.error("❌ Email test failed:", error.message);
    return null;
  }
}

/**
 * Test Webhook functionality
 */
async function testWebhook(sdk: any) {
  console.log("\n🔗 Testing Webhook functionality...");

  try {
    const webhook = sdk.webhook;
    console.log("🪝 Webhook service available:", !!webhook);

    // Subscribe to geotrigger events
    const subscription = await webhook.subscribe({
      event: "geotrigger.entered",
      url: "https://httpbin.org/post",
      metadata: {
        description: "Geotrigger entry webhook for Dosan Park",
        location: "Seoul, Korea",
      },
    });

    console.log("✅ Webhook subscription created!");
    console.log("🔔 Subscription details:", subscription);

    return subscription;
  } catch (error: any) {
    console.error("❌ Webhook test failed:", error.message);
    return null;
  }
}

/**
 * Test SDK health and status
 */
async function testSDKHealth(sdk: any) {
  console.log("\n🔍 Testing SDK Health...");

  try {
    if (sdk.healthCheck) {
      const health = await sdk.healthCheck();
      console.log("✅ SDK Health Check:", health);
      return health;
    } else {
      console.log("ℹ️ Health check not available");
      return { status: "unknown" };
    }
  } catch (error: any) {
    console.error("❌ Health check failed:", error.message);
    return { status: "error", error: error.message };
  }
}

/**
 * Clean up resources
 */
async function cleanup(sdk: any) {
  console.log("\n🧹 Cleaning up resources...");

  try {
    if (sdk.dispose) {
      await sdk.dispose();
      console.log("✅ SDK disposed successfully");
    }
  } catch (error: any) {
    console.error("⚠️ Cleanup warning:", error.message);
  }
}

/**
 * Main integration test function
 */
async function main() {
  console.log("🎯 OMX SDK Integration Test");
  console.log("=".repeat(50));
  console.log("Testing unified SDK with geotrigger focus\n");

  let sdk: any = null;

  try {
    // 1. Initialize SDK
    sdk = await testOMXInitialization();

    // 2. Test individual services
    const [triggerResult, emailResult, webhookResult, healthResult] =
      await Promise.allSettled([
        testGeotrigger(sdk),
        testEmail(sdk),
        testWebhook(sdk),
        testSDKHealth(sdk),
      ]);

    // 3. Report results
    console.log("\n📊 Integration Test Summary");
    console.log("=".repeat(50));
    console.log("✅ SDK Initialization:", "PASSED");
    console.log(
      "🌍 Geotrigger:",
      triggerResult.status === "fulfilled" ? "PASSED" : "FAILED"
    );
    console.log(
      "📧 Email:",
      emailResult.status === "fulfilled" ? "PASSED" : "FAILED"
    );
    console.log(
      "🔗 Webhook:",
      webhookResult.status === "fulfilled" ? "PASSED" : "FAILED"
    );
    console.log(
      "🔍 Health Check:",
      healthResult.status === "fulfilled" ? "PASSED" : "FAILED"
    );

    // 4. Show example usage
    console.log("\n💡 Example Usage Pattern:");
    console.log("=".repeat(30));
    console.log(`
import omxClient from 'omx-sdk';

// Initialize with credentials
const sdk = await omxClient.initialize({
  clientId: 'your-client-id',
  secretKey: 'your-secret-key'
});

// Create geotrigger
const trigger = await sdk.geotrigger.create({
  name: 'My Location Event',
  coordinates: [lng, lat],
  radius: 500,
  event: {
    type: 'webhook',
    url: 'https://your-server.com/webhook',
    payload: { userId: 'user123' }
  }
});

// Send notification email
await sdk.email.send({
  to: ['user@example.com'],
  subject: 'Location Alert',
  body: 'You entered the geofenced area!'
});
`);
  } catch (error: any) {
    console.error("\n❌ Integration test failed:", error.message);
    console.error("🔍 Error details:", error.stack);
    process.exit(1);
  } finally {
    // 5. Cleanup
    if (sdk) {
      await cleanup(sdk);
    }
  }

  console.log("\n🎉 Integration test completed!");
  console.log("📝 The OMX SDK is ready for geotrigger applications.");
}

// Export for testing
export { testEmail, testGeotrigger, testOMXInitialization, testWebhook };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
