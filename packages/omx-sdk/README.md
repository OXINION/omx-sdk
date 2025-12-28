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
- `@omx-sdk/notification` - Premium cross-platform notification support
- `@omx-sdk/campaign` - Management of marketing campaigns

## Quick Start

### Unified SDK Usage

```typescript
import { createOmxClient } from "omx-sdk";

// Create SDK instance with global configuration
const sdk = createOmxClient({
  clientId: "your-client-id",
  secretKey: "your-secret-key",
  baseUrl: "https://api.oxinion.com", // optional global base URL
  timeout: 10000,

  // Service-specific overrides
  email: {
    defaultFrom: "noreply@yourcompany.com",
  },
  beacon: {
    scanInterval: 2000,
  },
  notification: {
    baseUrl:
      "https://your-project.supabase.co/functions/v1/notification-service",
  },
});

// Initialize services that require setup (fetches JWT automatically)
await sdk.initialize();

// Use individual services
const geotrigger = sdk.geoTrigger;
const email = sdk.email;
const webhook = sdk.webhook;
const beacon = sdk.beacon;
const notification = sdk.notification;
```

### Individual Package Usage

You can also install and use individual packages:

```bash
npm install @omx-sdk/email @omx-sdk/geotrigger @omx-sdk/notification
```

```typescript
import { createOmxClient } from "@omx-sdk/core";
import { email } from "@omx-sdk/email";
import { geoTrigger } from "@omx-sdk/geotrigger";
import { notification } from "@omx-sdk/notification";

// Create the core client
const omx = createOmxClient({ clientId: "id", secretKey: "key" });

// Attach individual services
const emailClient = email(omx);
const geotriggerClient = geoTrigger(omx);
const notificationClient = notification(omx, { baseUrl: "..." });
```

## Complete Example

```typescript
import { createOmxClient } from "omx-sdk";

async function main() {
  // Initialize the SDK
  const sdk = createOmxClient({
    clientId: "your-client-id",
    secretKey: "your-secret-key",
    notification: {
      baseUrl:
        "https://your-project.supabase.co/functions/v1/notification-service",
    },
  });

  // Initialize services (fetches JWT automatically)
  await sdk.initialize();

  // 1. Setup geofencing
  const geotrigger = sdk.geoTrigger;
  // ... geofencing logic

  // 2. Setup notifications
  const notification = sdk.notification;

  // Register device
  await notification.registerDevice({
    platform: "web",
    deviceToken: "device-token-from-browser",
  });

  // Subscribe to interests
  await notification.subscribeCategories(["tech", "finance"]);

  // Send notification intent
  await notification.sendIntent({
    title: "New Article!",
    body: "Check out our latest post on TypeScript SDKs.",
    categories: ["tech"],
  });

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
  clientId: string;
  secretKey: string;
  baseUrl?: string;
  timeout?: number;

  // Service-specific configurations (all optional)
  geotrigger?: any;
  email?: Partial<EmailConfig>;
  webhook?: Partial<WebhookConfig>;
  beacon?: Partial<BeaconConfig>;
  notification?: Partial<NotificationOptions>;
}
```

## Available Services

### 5. Notifications (`sdk.notification`)

Premium cross-platform notification delivery via Supabase Edge Functions.

```typescript
// Register device
await sdk.notification.registerDevice({
  platform: "ios",
  deviceToken: "apns-token-here",
});

// Manage subscriptions
await sdk.notification.subscribeCategories(["sports"]);

// Send intent
await sdk.notification.sendIntent({
  title: "Goal!",
  body: "Your team just scored.",
  categories: ["sports"],
});
```

## Browser Support

- **Geotrigger**: All modern browsers with geolocation support
- **Email**: All browsers (server-side operations)
- **Webhook**: All browsers
- **Beacon**: Chrome 56+, Edge 79+ (Web Bluetooth required)
- **Notifications**: Chrome 42+, Firefox 44+, Safari 16+, iOS/Android via transport

## License

MIT

```typescript
const sdk = createOmxClient({
  clientId: "your-client-id",
  secretKey: "your-secret-key",

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

  // Notification settings
  notification: {
    baseUrl:
      "https://your-project.supabase.co/functions/v1/notification-service",
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
  geoTrigger: analytics.geoTrigger.isMonitoring,
  webhook: analytics.webhook.subscriptions,
  beacon: analytics.beacon?.totalBeacons,
  notification: analytics.notification,
});
```

## Available Services

### 1. Geotrigger (`sdk.geotrigger`)

Location-based triggers and geofencing.

```typescript
// Add geofence region
sdk.geoTrigger.addRegion({
  id: "office",
  center: { latitude: 37.7749, longitude: -122.4194 },
  radius: 100,
});

// Start monitoring
await sdk.geoTrigger.startMonitoring((event) => {
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
import { createOmxClient, OMXConfig, GeotriggerEvent } from "omx-sdk";

const config: OMXConfig = {
  clientId: "your-client-id",
  secretKey: "your-secret-key",
};

const sdk = createOmxClient(config);

sdk.geoTrigger.startMonitoring((event: GeotriggerEvent) => {
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
