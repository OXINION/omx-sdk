# omx-sdk

The unified SDK for Oxinion services integration. This meta-package provides access to all OMX SDK packages through a single, convenient interface.

## Installation

```bash
npm install omx-sdk
# or
pnpm add omx-sdk
```

This will install the main SDK along with all sub-packages:

- `@omx-sdk/geotrigger` - Geolocation trigger functionality
- `@omx-sdk/email` - Email sending capabilities
- `@omx-sdk/webhook` - Webhook handling and management
- `@omx-sdk/beacon` - Bluetooth beacon integration
- `@omx-sdk/push-notification` - Web push notification support

## Quick Start

### Unified SDK Usage

```typescript
import OMX from "omx-sdk";

// Create SDK instance with global configuration
const omx = OMX({
  apiKey: "your-api-key",
  baseUrl: "https://api.oxinion.com", // optional global base URL
  timeout: 10000, // optional global timeout

  // Service-specific overrides
  email: {
    defaultFrom: "noreply@yourcompany.com",
  },
  beacon: {
    scanInterval: 2000,
  },
  pushNotification: {
    vapidPublicKey: "your-vapid-public-key",
    serviceWorkerPath: "/custom-sw.js",
  },
});

// Initialize services that require setup
await sdk.initialize();

// Use individual services
const geotrigger = sdk.geotrigger;
const email = sdk.email;
const webhook = sdk.webhook;
const beacon = sdk.beacon;
const pushNotification = sdk.pushNotification;
```

### Individual Package Usage

You can also install and use individual packages:

```bash
npm install @omx-sdk/email @omx-sdk/geotrigger
```

```typescript
import { createEmailClient } from "@omx-sdk/email";
import { createGeotrigger } from "@omx-sdk/geotrigger";

const emailClient = createEmailClient({ apiKey: "your-api-key" });
const geotrigger = createGeotrigger({ apiKey: "your-api-key" });
```

## Complete Example

```typescript
import { createOMXSDK } from "omx-sdk";

async function main() {
  // Initialize the SDK
  const sdk = createOMXSDK({
    apiKey: "your-api-key",
    email: {
      defaultFrom: "notifications@yourcompany.com",
    },
    pushNotification: {
      vapidPublicKey: "your-vapid-public-key",
    },
  });

  // Initialize services
  await sdk.initialize();

  // Check health status
  const health = await sdk.healthCheck();
  console.log("SDK Health:", health);

  // 1. Setup geofencing
  const geotrigger = sdk.geotrigger;
  geotrigger.addRegion({
    id: "store",
    center: { latitude: 37.7749, longitude: -122.4194 },
    radius: 100,
    name: "Store Location",
  });

  await geotrigger.startMonitoring((event) => {
    console.log("Geofence event:", event);

    // Send email notification
    sdk.email.send({
      to: "customer@example.com",
      subject: "Welcome!",
      body: `You've ${event.type}ed our store location.`,
    });
  });

  // 2. Setup push notifications
  const pushManager = sdk.pushNotification;
  const subscription = await pushManager.subscribe();

  if (subscription.success) {
    console.log("Push notifications subscribed");
  }

  // 3. Setup webhook handlers
  const webhook = sdk.webhook;
  await webhook.createSubscription("https://yourapp.com/webhook", [
    "user.created",
    "order.completed",
  ]);

  // 4. Test webhook
  const testResult = await webhook.testWebhook("https://yourapp.com/test");
  console.log("Webhook test:", testResult);

  // 5. Setup beacon monitoring (if supported)
  const beacon = sdk.beacon;
  beacon.addRegion({
    id: "entrance",
    uuid: "B0702880-A295-A8AB-F734-031A98A512DE",
    major: 1,
    minor: 1,
  });

  beacon.addEventListener("enter", (event) => {
    console.log("Beacon detected:", event);
  });

  await beacon.startScanning();

  // Get aggregated analytics
  const analytics = sdk.getAnalytics();
  console.log("SDK Analytics:", analytics);
}

main().catch(console.error);
```

## Configuration

### OMXConfig

The main configuration object supports global settings and service-specific overrides:

```typescript
interface OMXConfig {
  apiKey: string; // Required: Your OMX API key
  baseUrl?: string; // Optional: Global base URL
  timeout?: number; // Optional: Global timeout

  // Service-specific configurations (all optional)
  geotrigger?: Partial<GeotriggerConfig>;
  email?: Partial<EmailConfig>;
  webhook?: Partial<WebhookConfig>;
  beacon?: Partial<BeaconConfig>;
  pushNotification?: Partial<PushConfig>;
}
```

### Service Configuration Examples

```typescript
const sdk = createOMXSDK({
  apiKey: "your-api-key",

  // Geotrigger settings
  geotrigger: {
    baseUrl: "https://geo.api.oxinion.com",
    timeout: 15000,
  },

  // Email settings
  email: {
    defaultFrom: "notifications@yourcompany.com",
    baseUrl: "https://email.api.oxinion.com",
  },

  // Webhook settings
  webhook: {
    retryAttempts: 5,
    retryDelay: 2000,
  },

  // Beacon settings
  beacon: {
    scanInterval: 1000,
  },

  // Push notification settings
  pushNotification: {
    vapidPublicKey: "BM...",
    serviceWorkerPath: "/custom-sw.js",
  },
});
```

## Health Monitoring

```typescript
// Check the health of all services
const health = await sdk.healthCheck();

console.log("Overall health:", health.overall); // 'healthy' | 'degraded' | 'unhealthy'
console.log("Service status:", health.services);

// Example response:
// {
//   overall: 'healthy',
//   services: {
//     geotrigger: 'healthy',
//     email: 'healthy',
//     webhook: 'healthy',
//     beacon: 'unhealthy', // Not supported in this browser
//     pushNotification: 'healthy'
//   }
// }
```

## Analytics

```typescript
// Get aggregated analytics from all services
const analytics = sdk.getAnalytics();

console.log("Analytics:", {
  geotrigger: analytics.geotrigger.isMonitoring,
  webhook: analytics.webhook.subscriptions,
  beacon: analytics.beacon?.totalBeacons,
  pushNotification: analytics.pushNotification?.totalSubscriptions,
});
```

## Available Services

### 1. Geotrigger (`sdk.geotrigger`)

Location-based triggers and geofencing.

```typescript
// Add geofence region
sdk.geotrigger.addRegion({
  id: "office",
  center: { latitude: 37.7749, longitude: -122.4194 },
  radius: 100,
});

// Start monitoring
await sdk.geotrigger.startMonitoring((event) => {
  console.log("Geofence event:", event.type, event.regionId);
});
```

### 2. Email (`sdk.email`)

Email sending with templates and bulk support.

```typescript
// Send email
await sdk.email.send({
  to: "user@example.com",
  subject: "Welcome!",
  body: "Thank you for signing up.",
  html: "<h1>Welcome!</h1><p>Thank you for signing up.</p>",
});
```

### 3. Webhook (`sdk.webhook`)

Webhook management and event delivery.

```typescript
// Create subscription
await sdk.webhook.createSubscription("https://yourapp.com/webhook", [
  "user.created",
  "order.completed",
]);

// Send webhook
await sdk.webhook.send({
  url: "https://external-service.com/webhook",
  method: "POST",
  data: { event: "test", timestamp: Date.now() },
});
```

### 4. Beacon (`sdk.beacon`)

Bluetooth beacon detection and proximity monitoring.

```typescript
// Add beacon region
sdk.beacon.addRegion({
  id: "store-entrance",
  uuid: "B0702880-A295-A8AB-F734-031A98A512DE",
  major: 1,
});

// Start scanning
await sdk.beacon.startScanning();
```

### 5. Push Notifications (`sdk.pushNotification`)

Web push notification management.

```typescript
// Subscribe to push notifications
const result = await sdk.pushNotification.subscribe();

// Send notification
if (result.success) {
  const subscription = await sdk.pushNotification.getSubscription();
  await sdk.pushNotification.sendNotification(subscription!, {
    title: "Hello!",
    body: "This is a test notification",
  });
}
```

## Configuration Management

```typescript
// Get current configuration
const config = sdk.getConfig();

// Update configuration (will recreate service instances)
sdk.updateConfig({
  timeout: 20000,
  email: {
    defaultFrom: "updated@yourcompany.com",
  },
});
```

## Cleanup

```typescript
// Clean up resources when done
sdk.dispose();
```

## Error Handling

```typescript
try {
  await sdk.initialize();

  const health = await sdk.healthCheck();
  if (health.overall === "unhealthy") {
    console.warn("Some services are not available");
  }

  // Use services...
} catch (error) {
  console.error("SDK error:", error);
} finally {
  sdk.dispose();
}
```

## TypeScript Support

The SDK is built with TypeScript and provides full type definitions:

```typescript
import { OMXSDK, OMXConfig, GeotriggerEvent } from "omx-sdk";

const config: OMXConfig = {
  apiKey: "your-api-key",
};

const sdk = new OMXSDK(config);

sdk.geotrigger.startMonitoring((event: GeotriggerEvent) => {
  // Full type safety
  console.log(event.type, event.regionId);
});
```

## Browser Support

- **Geotrigger**: All modern browsers with geolocation support
- **Email**: All browsers (server-side operations)
- **Webhook**: All browsers
- **Beacon**: Chrome 56+, Edge 79+ (Web Bluetooth required)
- **Push Notifications**: Chrome 42+, Firefox 44+, Safari 16+

## Security

- Always use HTTPS in production
- Keep your API keys secure
- Use VAPID keys for push notifications
- Validate webhook signatures
- Request permissions appropriately

## License

MIT

## Support

For issues and questions:

- Check individual package documentation
- Review the examples in this README
- File issues on the GitHub repository
