# @omx-sdk/email

Email marketing automation module for the OMX platform.

<https://www.npmjs.com/package/@omx-sdk/email>

## Installation

### Option 1: Individual Package

```bash
npm install @omx-sdk/email @omx-sdk/core
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

// Email module is available as omx.email
```

## Methods

```js
// Send transactional email
const result = await omx.email.send({
  to: "customer@example.com",
  subject: "Welcome to our store!",
  template: "welcome_template",
  variables: { firstName: "John", discountCode: "WELCOME10" },
});

// Create and send email campaign (email-only bulk sending)
const campaign = await omx.email.createCampaign({
  name: "Monthly Newsletter",
  subject: "Special Offers Inside!",
  template: "newsletter_template",
  recipients: ["segment:loyal_customers"],
  scheduledAt: "2024-01-15T10:00:00Z",
});

// Send the email campaign
await omx.email.sendCampaign(campaign.id);

// Create email template
await omx.email.createTemplate({
  name: "welcome_template",
  subject: "Welcome {{firstName}}!",
  html: "<h1>Welcome {{firstName}}!</h1><p>Use code {{discountCode}}</p>",
  variables: ["firstName", "discountCode"],
});
```

## What This Module Does

- ✅ **Transactional Emails** - Send individual one-off emails
- ✅ **Email-Only Campaigns** - Bulk email marketing (email channel only)
- ✅ **Template Management** - Create reusable email templates
- ✅ **Email Campaign Stats** - Track opens, clicks, bounces

## What This Module Does NOT Do

- ❌ **Multi-Channel Campaigns** - Use `@omx-sdk/campaign` for email+push+webhook campaigns
- ❌ **Location-Based Triggers** - Use `@omx-sdk/campaign` with `@omx-sdk/geotrigger`
- ❌ **Push Notifications** - Use `@omx-sdk/notification` instead
- ❌ **SMS Marketing** - Use dedicated SMS modules

## When to Use Email vs Campaign

**Use `@omx-sdk/email`:**
- Simple email newsletters
- Transactional emails (receipts, confirmations)
- Email-only marketing blasts
- Template-based email sending

**Use `@omx-sdk/campaign`:**
- Multi-channel marketing (email + push + webhook)
- Location-triggered campaigns (store visit → push + email)
- Complex automation workflows
- A/B testing across channels
