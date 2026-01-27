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

// Send bulk campaign
await omx.email.sendCampaign({
  subject: "Monthly Newsletter",
  template: "newsletter_template",
  recipients: ["segment:loyal_customers"],
  scheduledAt: "2024-01-15T10:00:00Z",
});

// Create email template
await omx.email.createTemplate({
  name: "welcome_template",
  subject: "Welcome {{firstName}}!",
  html: "<h1>Welcome {{firstName}}!</h1><p>Use code {{discountCode}}</p>",
  variables: ["firstName", "discountCode"],
});
```

## What This Module Does

- ✅ **Transactional Emails** - Send individual emails
- ✅ **Email Campaigns** - Bulk email marketing
- ✅ **Template Management** - Create reusable email templates

## What This Module Does NOT Do

- ❌ **Push Notifications** - Use `@omx-sdk/notification` instead
- ❌ **SMS Marketing** - Use dedicated SMS modules
- ❌ **Email List Management** - Use CRM integrations
