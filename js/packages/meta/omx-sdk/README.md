# OMX SDK

[![npm version](https://badge.fury.io/js/omx-sdk.svg)](https://badge.fury.io/js/omx-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The official JavaScript/TypeScript SDK for **Oxinion Marketing Exchange (OMX)** - a powerful platform for location-based marketing automation with multi-channel campaign management.

## ✨ Features

- 🌍 **Geotrigger Management** - Create location-based triggers with precision
- 📧 **Email Campaigns** - Send personalized email campaigns
- 🔔 **Push Notifications** - Real-time mobile push notifications
- 📡 **Beacon Integration** - Bluetooth beacon proximity detection
- 🔗 **Webhook Support** - Custom webhook integrations
- 🎯 **Campaign Orchestration** - Visual workflow automation
- 🔐 **Secure Authentication** - Built-in API key management
- 📘 **TypeScript Support** - Full type safety and IntelliSense

## 🚀 Quick Start

### Installation

```bash
npm install omx-sdk
```

### Basic Usage

```javascript
import { createOmxClient } from "omx-sdk";

// Initialize the OMX client with all managers
const omx = createOmxClient({
  clientId: process.env.OMX_CLIENT_ID,
  secretKey: process.env.OMX_SECRET_KEY,
});

// Create a geotrigger
const geoTrigger = await omx.geotrigger.create({
  name: "Coffee Shop Welcome",
  location: {
    lat: 40.7128,
    lng: -74.006,
  },
  radius: 50, // meters
  actions: {
    onEnter: {
      notification: {
        title: "Welcome!",
        body: "Get 20% off your first order!",
      },
    },
  },
});

console.log("Geotrigger created:", geoTrigger.id);
```

### Modular Imports

Import only what you need:

```javascript
// Main client with all managers (recommended)
import { createOmxClient } from "omx-sdk";
const omx = createOmxClient({ clientId: "...", secretKey: "..." });

// Individual managers (for custom setups)
import { GeoTriggerManager } from "omx-sdk/geotrigger";
import { EmailManager } from "omx-sdk/email";
import { NotificationManager } from "omx-sdk/notification";
```

## 📖 API Reference

### Core SDK

```javascript
import { createOmxClient, OMXClient } from "omx-sdk";

const omx = createOmxClient({
  clientId: "your-client-id",
  secretKey: "your-secret-key",
});

// Access all managers
omx.geotrigger; // GeoTrigger management
omx.email; // Email campaigns
omx.notification; // Push notifications
omx.webhook; // Webhook management
omx.beacon; // Beacon integration
omx.campaign; // Campaign orchestration
omx.core; // Low-level HTTP client
```

### Geotrigger Management

```javascript
// Create geotrigger
const trigger = await omx.geotrigger.create({
  name: "Store Entrance",
  location: { lat: 40.7128, lng: -74.006 },
  radius: 100,
  actions: {
    onEnter: {
      /* ... */
    },
    onExit: {
      /* ... */
    },
  },
});

// List geotriggers
const triggers = await omx.geotrigger.list({
  limit: 10,
  offset: 0,
});

// Update geotrigger
await omx.geotrigger.update(trigger.id, {
  name: "Updated Store Entrance",
  radius: 150,
});

// Delete geotrigger
await omx.geotrigger.delete(trigger.id);
```

### Email Campaigns

```javascript
// Send email campaign
const campaign = await omx.email.send({
  to: ["user@example.com"],
  subject: "Welcome to our store!",
  template: "welcome-template",
  data: {
    firstName: "John",
    discount: "20%",
  },
});

// Track email status
const status = await omx.email.getStatus(campaign.id);
```

### Push Notifications

```javascript
// Send push notification
const notification = await omx.notification.send({
  tokens: ["device-token-1", "device-token-2"],
  title: "Special Offer!",
  body: "Limited time: 50% off everything!",
  data: {
    category: "promotion",
    deepLink: "/offers",
  },
});
```

### Webhook Integration

```javascript
// Create webhook
const webhook = await omx.webhook.create({
  url: "https://your-app.com/webhooks/omx",
  events: ["geotrigger.entered", "campaign.completed"],
  secret: "your-webhook-secret",
});
```

### Campaign Management

```javascript
// Create campaign workflow
const campaign = await omx.campaign.create({
  name: "Welcome Series",
  trigger: {
    type: "geotrigger",
    geotriggerId: trigger.id,
  },
  actions: [
    {
      type: "notification",
      delay: 0,
      config: {
        title: "Welcome!",
        body: "Thanks for visiting!",
      },
    },
    {
      type: "email",
      delay: 3600, // 1 hour later
      config: {
        template: "follow-up",
        subject: "We hope you enjoyed your visit",
      },
    },
  ],
});
```

## 🔧 Configuration

### Environment Variables

```bash
# Required
OMX_CLIENT_ID=your-client-id
OMX_SECRET_KEY=your-secret-key

# Optional
OMX_ENVIRONMENT=production
```

### SDK Configuration

```javascript
const omx = createOmxClient({
  clientId: process.env.OMX_CLIENT_ID,
  secretKey: process.env.OMX_SECRET_KEY,

  // Custom headers
  headers: {
    "X-Custom-Header": "value",
  },
});
```

## 🧪 Error Handling

```javascript
import { OMXError, OMXValidationError, OMXAuthError } from "omx-sdk";

try {
  const result = await omx.geotrigger.create(invalidData);
} catch (error) {
  if (error instanceof OMXValidationError) {
    console.log("Validation failed:", error.details);
  } else if (error instanceof OMXAuthError) {
    console.log("Authentication failed:", error.message);
  } else if (error instanceof OMXError) {
    console.log("OMX API error:", error.message, error.code);
  } else {
    console.log("Unexpected error:", error);
  }
}
```

## 📝 TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import {
  OMXClient,
  GeoTrigger,
  EmailCampaign,
  NotificationResult,
  CreateGeoTriggerRequest,
} from "omx-sdk";

const omx: OMXClient = createOmxClient({
  /* ... */
});

const request: CreateGeoTriggerRequest = {
  name: "Typed Geotrigger",
  location: { lat: 40.7128, lng: -74.006 },
  radius: 100,
};

const trigger: GeoTrigger = await omx.geotrigger.create(request);
```

## 🔗 Links

- **Documentation**: [https://docs.omx.oxinion.com](https://docs.omx.oxinion.com)
- **Dashboard**: [https://app.omx.oxinion.com](https://app.omx.oxinion.com)
- **GitHub**: [https://github.com/oxinion/omx-sdk](https://github.com/oxinion/omx-sdk)
- **Support**: [support@oxinion.com](mailto:support@oxinion.com)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Support

- 📧 Email: [support@oxinion.com](mailto:support@oxinion.com)
- 💬 GitHub Issues: [Report a bug](https://github.com/oxinion/omx-sdk/issues)
- 📖 Documentation: [docs.omx.oxinion.com](https://docs.omx.oxinion.com)
