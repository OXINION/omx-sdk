# @omx-sdk/campaign

Marketing campaign management module for creating, managing, and tracking multi-channel campaigns.

<https://www.npmjs.com/package/@omx-sdk/campaign>

## Installation

### Option 1: Individual Package

```bash
npm install @omx-sdk/campaign @omx-sdk/core
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

// Campaign module is available as omx.campaign
```

## Methods

```js
// Create marketing campaign
const newCampaign = await omx.campaign.create({
  name: "Summer Sale 2024",
  description: "Promote summer products with location-based offers",
  channels: ["email", "push_notification"],
  schedule: {
    startDate: "2024-06-01T00:00:00Z",
    endDate: "2024-08-31T23:59:59Z",
  },
  targeting: {
    segments: ["summer_shoppers", "location:downtown"],
    geofences: ["store_123", "mall_456"],
  },
});

// Update campaign settings
await omx.campaign.update("campaign_123", {
  status: "active",
  budget: { limit: 5000, spent: 1250 },
});

// Pause/resume campaign
await omx.campaign.pause("campaign_123");
await omx.campaign.resume("campaign_123");

// Get all campaigns
const campaigns = await omx.campaign.list({
  status: "active",
  sortBy: "created_date",
  limit: 20,
});
```

## What This Module Does

- ✅ **Multi-Channel Campaigns** - Orchestrate email + push + webhook + coupons
- ✅ **Location-Based Triggers** - Integrate with geotriggers and beacons
- ✅ **Audience Targeting** - Target specific customer segments and locations
- ✅ **Campaign Automation** - Schedule, pause, resume campaign lifecycle
- ✅ **Performance Tracking** - Monitor campaign metrics and ROI across channels

## What This Module Does NOT Do

- ❌ **Email-Only Bulk Sending** - Use `@omx-sdk/email` for simple email blasts
- ❌ **Content Creation** - Create email/notification templates in respective modules
- ❌ **Customer Segmentation** - Use CRM tools for audience building
- ❌ **Payment Processing** - Handle transactions in your e-commerce system

## Campaign vs Email Campaign

**Campaign Module** (this module):
```js
// Multi-channel marketing automation
const campaign = await omx.campaign.create({
  channels: ["email", "push_notification", "webhook"],  // Multiple channels
  targeting: { geofences: ["store_123"] },  // Location-based
  actions: [
    { type: "email", config: { template: "welcome" } },
    { type: "notification", config: { title: "Welcome!" } },
    { type: "webhook", config: { url: "https://..." } }
  ]
});
```

**Email Module** (simpler):
```js
// Email-only bulk sending
const campaign = await omx.email.createCampaign({
  subject: "Newsletter",  // Email-specific fields only
  template: "newsletter_template",
  recipients: ["segment:all_users"]
});
```
