# @omx-sdk/notification

Push notification module for sending targeted notifications through the OMX platform.

<https://www.npmjs.com/package/@omx-sdk/notification>

## Installation

### Option 1: Individual Package

```bash
npm install @omx-sdk/notification @omx-sdk/core
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
  secretKey: "your_secret_key"
});

// Notification module is available as omx.notification
```

## Methods

```js
// Send push notification
const notification = await omx.notification.send({
  title: "Special Offer",
  message: "Get 20% off your next purchase!",
  recipients: ["user123", "user456"],
  data: { couponCode: "SAVE20" }
});

// Send to audience segments
await omx.notification.sendToSegment({
  title: "Location-based Alert",
  message: "Welcome to downtown!",
  segment: "downtown_visitors",
  deepLink: "myapp://offers"
});

// Get notification history
const history = await omx.notification.getHistory({
  limit: 50,
  status: "delivered"
});

// Check notification status
const status = await omx.notification.getStatus(notificationId);
```

## What This Module Does

- ✅ **Push Notifications** - Send targeted notifications
- ✅ **Audience Segmentation** - Send to user groups
- ✅ **Delivery Tracking** - Monitor notification status
- ✅ **Deep Linking** - Navigate users to specific content

## What This Module Does NOT Do

- ❌ **Email Marketing** - Use `@omx-sdk/email` instead
- ❌ **SMS Messaging** - Use dedicated SMS modules
- ❌ **In-app Messages** - Use UI notification libraries
