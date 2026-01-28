# @omx-sdk/webhook

Webhook management module for real-time event notifications and third-party integrations.

<https://www.npmjs.com/package/@omx-sdk/webhook>

## Installation

### Option 1: Individual Package

```bash
npm install @omx-sdk/webhook @omx-sdk/core
```

### Option 2: Unified Package (includes all modules)

```bash
npm install omx-sdk
```

## Basic Usage

```js
import { createOmxClient } from "omx-sdk";

// Initialize OMX client (includes all modules)
const omx = createOmxClient({
  clientId: "your_client_id",
  secretKey: "your_secret_key",
});

// Webhook module is available as omx.webhook
```

## Methods

```js
// Create webhook endpoint
const newWebhook = await omx.webhook.create({
  url: "https://your-app.com/webhooks/omx",
  events: ["geofence.enter", "campaign.completed", "notification.sent"],
  secret: "your_webhook_secret",
  active: true,
});

// Update webhook configuration
await omx.webhook.update("webhook_123", {
  events: ["geofence.enter", "geofence.exit"],
  retryPolicy: {
    maxRetries: 3,
    retryDelay: 1000,
  },
});

// Get webhook delivery logs
const deliveries = await omx.webhook.getDeliveries({
  webhookId: "webhook_123",
  status: "failed",
  limit: 50,
});

// Retry failed delivery
await omx.webhook.retry("delivery_456");

// Get all webhooks
const webhooks = await omx.webhook.list({
  active: true,
});
```

## What This Module Does

- ✅ **Webhook Management** - Create and configure webhook endpoints
- ✅ **Event Subscriptions** - Subscribe to OMX platform events
- ✅ **Delivery Tracking** - Monitor webhook delivery status
- ✅ **Retry Logic** - Handle failed deliveries automatically

## What This Module Does NOT Do

- ❌ **Webhook Server** - You need to implement your own endpoint
- ❌ **Event Processing** - Handle incoming webhook data in your app
- ❌ **Authentication** - Webhook security is your responsibility
