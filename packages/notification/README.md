# @omx-sdk/notification

Premium notification transport for Oxinion Marketing Exchange (OMX).

This package provides a lightweight, transport-focused SDK for managing device registrations, category subscriptions, and sending notification intents. It abstracts away the complexity of platform-specific providers (FCM, APNs) and delegates delivery intelligence to Supabase Edge Functions.

## Features

- **Platform Agnostic**: Supports Web, iOS, and Android.
- **Provider-less SDK**: No direct dependency on Firebase or APNs SDKs.
- **Category-based Targeting**: Subscribe to interests, not individual IDs.
- **Secure**: Authentication handled via JWT from `@omx-sdk/core`.
- **Lightweight**: Zero external dependencies other than core transport logic.

## Usage

### Initialization

```typescript
import { createNotificationClient } from "@omx-sdk/notification";
import { createOmxClient } from "@omx-sdk/core";

const omx = createOmxClient({
  clientId: "your-client-id",
  secretKey: "your-client-secret",
});

// Use core client's auth provider to get JWT
const notificationClient = createNotificationClient(
  () => omx.getAccessToken(),
  {
    baseUrl:
      "https://your-project.supabase.co/functions/v1/notification-service",
  }
);
```

### Registering a Device

```typescript
await notificationClient.registerDevice({
  platform: "web",
  deviceToken: "fcm-registration-token-or-apns-token",
});
```

### Managing Subscriptions

```typescript
// Subscribe to categories
await notificationClient.subscribeCategories(["tech", "finance"]);

// Unsubscribe
await notificationClient.unsubscribeCategories(["finance"]);
```

### Sending a Notification Intent

```typescript
await notificationClient.sendIntent({
  title: "New Article!",
  body: "Check out our latest post on TypeScript SDKs.",
  categories: ["tech"],
  data: {
    articleId: "123",
  },
});
```

## Error Handling

The SDK provides specific error classes for predictable error handling:

```typescript
import { NotificationApiError, NotificationNetworkError } from '@omx-sdk/notification';

try {
  await notificationClient.sendIntent({...});
} catch (error) {
  if (error instanceof NotificationApiError) {
    console.error('API Error:', error.statusCode, error.details);
  } else if (error instanceof NotificationNetworkError) {
    console.error('Network Error:', error.message);
  }
}
```

## License

MIT
