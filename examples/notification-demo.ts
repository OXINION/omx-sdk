import { createOMXClient } from "omx-sdk";

/**
 * Demo showing how to use the notification package
 * via the unified OMX SDK.
 */
async function main() {
  console.log("🚀 Starting Notification SDK Demo...");

  // 1. Initialize the SDK
  // In a real app, get these from your Oxinion dashboard
  const omx = createOMXClient({
    clientId: "demo-client-id",
    secretKey: "demo-secret-key",
    baseUrl:
      "https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1/notification-service",
  });

  try {
    // Note: In this demo, initialize() will attempt to fetch a real JWT.
    // Since we're using dummy keys, it might fail unless we mock it or use real keys.
    // For demonstration, we'll show the API usage.

    console.log("📦 Registering device...");
    await omx.notification.registerDevice({
      platform: "web",
      deviceToken: "dummy-fcm-token-123456",
    });
    console.log("✅ Device registered");

    console.log("📝 Subscribing to categories...");
    await omx.notification.subscribeCategories(["news", "promotions"]);
    console.log("✅ Subscribed to news and promotions");

    console.log("📤 Sending notification intent...");
    await omx.notification.sendIntent({
      title: "Special Offer!",
      body: "Get 20% off your next purchase with code OMX20",
      categories: ["promotions"],
      data: {
        discountCode: "OMX20",
        expires: "2025-12-31",
      },
    });
    console.log("✅ Notification intent sent");

    console.log("📝 Unsubscribing from categories...");
    await omx.notification.unsubscribeCategories(["promotions"]);
    console.log("✅ Unsubscribed from promotions");
  } catch (error) {
    console.error(
      "❌ Demo failed:",
      error instanceof Error ? error.message : error
    );
  }
}

main();
