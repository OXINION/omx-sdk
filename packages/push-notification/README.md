# @omx-sdk/push-notification

Push notification functionality for the OMX SDK. This package provides web push notification capabilities, subscription management, and analytics.

## Installation

```bash
npm install @omx-sdk/push-notification
# or
pnpm add @omx-sdk/push-notification
```

## Setup

### 1. Service Worker

Create a service worker file (`public/sw.js`) to handle push notifications:

```javascript
// sw.js
self.addEventListener('push', function (event) {
  const options = {
    body: 'Default notification body',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    ...event.data?.json(),
  };

  event.waitUntil(self.registration.showNotification('Default Title', options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  // Send message to main thread
  event.waitUntil(
    self.clients.matchAll().then(function (clients) {
      clients.forEach(function (client) {
        client.postMessage({
          type: 'notification-click',
          notificationEvent: {
            notification: event.notification,
            action: event.action,
          },
        });
      });
    })
  );
});

self.addEventListener('notificationclose', function (event) {
  // Send message to main thread
  event.waitUntil(
    self.clients.matchAll().then(function (clients) {
      clients.forEach(function (client) {
        client.postMessage({
          type: 'notification-close',
          notificationEvent: {
            notification: event.notification,
          },
        });
      });
    })
  );
});
```

### 2. VAPID Keys (Optional)

Generate VAPID keys for enhanced security:

```bash
# Using web-push CLI tool
npm install -g web-push
web-push generate-vapid-keys
```

## Usage

### Basic Setup

```typescript
import {
  PushNotificationManager,
  createPushNotificationManager,
} from '@omx-sdk/push-notification';

// Create push notification manager
const pushManager = createPushNotificationManager({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.oxinion.com/push', // optional
  vapidPublicKey: 'your-vapid-public-key', // optional but recommended
  serviceWorkerPath: '/sw.js', // optional, defaults to '/sw.js'
  timeout: 10000, // optional
});

// Initialize (registers service worker)
await pushManager.initialize();

// Check if push notifications are supported
if (PushNotificationManager.isSupported()) {
  console.log('Push notifications are supported');
} else {
  console.log('Push notifications are not supported');
}
```

### Permission and Subscription Management

```typescript
// Check current permission status
const permission = pushManager.getPermissionStatus();
console.log('Permission status:', permission);

// Request permission and subscribe
const subscriptionResult = await pushManager.subscribe();

if (subscriptionResult.success) {
  console.log('Subscribed successfully:', subscriptionResult.subscriptionId);
} else {
  console.error('Subscription failed:', subscriptionResult.error);
}

// Get current subscription
const subscription = await pushManager.getSubscription();
console.log('Current subscription:', subscription);

// Unsubscribe
const unsubscribed = await pushManager.unsubscribe();
console.log('Unsubscribed:', unsubscribed);
```

### Sending Notifications

```typescript
// Send notification to a specific subscription
const subscription = await pushManager.getSubscription();

if (subscription) {
  const result = await pushManager.sendNotification(subscription, {
    title: 'Hello from OMX SDK!',
    body: 'This is a test notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    image: '/notification-image.jpg',
    tag: 'test-notification',
    data: {
      url: 'https://your-app.com/details',
      timestamp: Date.now(),
    },
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/view-icon.png',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
    requireInteraction: true,
    ttl: 86400, // 24 hours
  });

  console.log('Notification sent:', result);
}
```

### Bulk Notifications

```typescript
const subscriptions = [
  // Array of push subscriptions
];

const payload = {
  title: 'Bulk Notification',
  body: 'This notification was sent to multiple users',
  icon: '/icon-192x192.png',
};

const results = await pushManager.sendBulkNotifications(
  subscriptions,
  payload,
  {
    batchSize: 10, // Send 10 at a time
    delay: 1000, // Wait 1 second between batches
  }
);

console.log('Bulk send results:', results);
```

### Local Notifications

```typescript
// Show local notification without push service
await pushManager.showLocalNotification({
  title: 'Local Notification',
  body: 'This notification is shown locally',
  icon: '/icon-192x192.png',
  tag: 'local-notification',
  data: { type: 'local' },
});
```

### Event Handling

```typescript
// Handle notification clicks
pushManager.onNotificationClick((event) => {
  console.log('Notification clicked:', event);

  if (event.action === 'view') {
    // Navigate to specific page
    window.open(event.notification.data?.url);
  } else if (event.action === 'dismiss') {
    // Handle dismiss action
    console.log('Notification dismissed');
  } else {
    // Default click action
    console.log('Default notification click');
  }
});

// Handle notification close
pushManager.onNotificationClose((event) => {
  console.log('Notification closed:', event);
});
```

### Analytics

```typescript
// Get push notification analytics
const analytics = pushManager.getAnalytics();
console.log('Push Analytics:', {
  totalSubscriptions: analytics.totalSubscriptions,
  totalNotificationsSent: analytics.totalNotificationsSent,
  totalNotificationsClicked: analytics.totalNotificationsClicked,
  clickThroughRate: analytics.clickThroughRate,
  averageDeliveryTime: analytics.averageDeliveryTime,
});

// Reset analytics
pushManager.resetAnalytics();
```

## API Reference

### PushConfig

Configuration object for initializing the PushNotificationManager.

```typescript
interface PushConfig {
  apiKey: string; // Required API key
  baseUrl?: string; // Optional base URL
  vapidPublicKey?: string; // Optional VAPID public key
  serviceWorkerPath?: string; // Optional service worker path
  timeout?: number; // Optional timeout in milliseconds
}
```

### NotificationPayload

Notification content and options.

```typescript
interface NotificationPayload {
  title: string; // Notification title
  body?: string; // Notification body text
  icon?: string; // Notification icon URL
  badge?: string; // Badge icon URL
  image?: string; // Large image URL
  tag?: string; // Unique tag for grouping
  data?: Record<string, unknown>; // Custom data
  actions?: NotificationAction[]; // Action buttons
  requireInteraction?: boolean; // Require user interaction
  silent?: boolean; // Silent notification
  timestamp?: number; // Custom timestamp
  ttl?: number; // Time to live in seconds
}
```

### PushSubscription

Push subscription object.

```typescript
interface PushSubscription {
  endpoint: string; // Push service endpoint
  keys: {
    p256dh: string; // Public key for encryption
    auth: string; // Authentication secret
  };
}
```

### PushResponse

Response from push operations.

```typescript
interface PushResponse {
  success: boolean; // Whether the operation succeeded
  messageId?: string; // Unique message identifier
  error?: string; // Error message (if failed)
  statusCode?: number; // HTTP status code
}
```

### PushAnalytics

Analytics data for push notifications.

```typescript
interface PushAnalytics {
  totalSubscriptions: number; // Total active subscriptions
  totalNotificationsSent: number; // Total notifications sent
  totalNotificationsClicked: number; // Total notifications clicked
  clickThroughRate: number; // Click-through rate percentage
  averageDeliveryTime: number; // Average delivery time in ms
}
```

## Methods

- `initialize()`: Initialize the push manager and register service worker
- `requestPermission()`: Request notification permission from user
- `getPermissionStatus()`: Get current notification permission status
- `subscribe()`: Subscribe to push notifications
- `unsubscribe()`: Unsubscribe from push notifications
- `getSubscription()`: Get current push subscription
- `sendNotification(subscription, payload)`: Send notification to specific subscription
- `sendBulkNotifications(subscriptions, payload, options?)`: Send bulk notifications
- `showLocalNotification(payload)`: Show local notification
- `onNotificationClick(handler)`: Handle notification click events
- `onNotificationClose(handler)`: Handle notification close events
- `getAnalytics()`: Get push notification analytics
- `resetAnalytics()`: Reset analytics data
- `getConfig()`: Get manager configuration

### Static Methods

- `PushNotificationManager.isSupported()`: Check if push notifications are supported

## Browser Support

Push notifications are supported in:

- Chrome 42+
- Firefox 44+
- Safari 16+ (with some limitations)
- Edge 17+
- Mobile browsers (with varying support)

**Important Notes:**

- Requires HTTPS (except localhost for development)
- Service worker required
- User permission required
- Not supported in private/incognito mode in some browsers

## Security

### VAPID Keys

Use VAPID (Voluntary Application Server Identification) keys for enhanced security:

```typescript
const pushManager = createPushNotificationManager({
  apiKey: 'your-api-key',
  vapidPublicKey: 'your-vapid-public-key',
});
```

### Permission Best Practices

1. Request permission at appropriate times
2. Provide clear explanations for why notifications are needed
3. Handle permission denied gracefully
4. Respect user preferences

```typescript
const permission = await pushManager.requestPermission();

switch (permission) {
  case 'granted':
    console.log('Permission granted');
    break;
  case 'denied':
    console.log('Permission denied');
    // Show alternative UI or functionality
    break;
  case 'default':
    console.log('Permission prompt dismissed');
    break;
}
```

## Error Handling

```typescript
try {
  await pushManager.initialize();
  const result = await pushManager.subscribe();

  if (!result.success) {
    console.error('Subscription failed:', result.error);
  }
} catch (error) {
  console.error('Push notification error:', error);
}
```

## License

MIT
