# @omx-sdk/webhook

Webhook handling functionality for the OMX SDK. This package provides webhook sending, subscription management, and event delivery capabilities.

## Installation

```bash
npm install @omx-sdk/webhook
# or
pnpm add @omx-sdk/webhook
```

## Usage

### Basic Webhook Sending

```typescript
import { WebhookClient, createWebhookClient } from '@omx-sdk/webhook';

// Create a webhook client
const webhookClient = createWebhookClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.oxinion.com/webhooks', // optional
  timeout: 10000, // optional
  retryAttempts: 3, // optional
  retryDelay: 1000, // optional
});

// Send a webhook
const response = await webhookClient.send({
  url: 'https://your-app.com/webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer your-token',
  },
  data: {
    event: 'user.created',
    user: {
      id: '123',
      email: 'user@example.com',
    },
  },
});

console.log('Webhook sent:', response);
```

### Webhook with Retry Logic

```typescript
const response = await webhookClient.send(
  {
    url: 'https://unreliable-endpoint.com/webhook',
    method: 'POST',
    data: { message: 'Hello' },
  },
  {
    maxAttempts: 5,
    delay: 2000,
    backoff: 'exponential',
    maxDelay: 30000,
  }
);
```

### Webhook Subscriptions

```typescript
// Create a subscription
const subscription = await webhookClient.createSubscription(
  'https://your-app.com/webhooks/handler',
  ['user.created', 'user.updated', 'order.completed'],
  'your-webhook-secret' // optional
);

console.log('Subscription created:', subscription);

// Update subscription
await webhookClient.updateSubscription(subscription.id, {
  events: ['user.created', 'user.deleted'],
  active: true,
});

// Get all subscriptions
const subscriptions = webhookClient.getSubscriptions();

// Delete subscription
await webhookClient.deleteSubscription(subscription.id);
```

### Test Webhooks

```typescript
// Test a webhook endpoint
const testResult = await webhookClient.testWebhook(
  'https://your-app.com/webhook'
);

console.log('Test result:', testResult);

// Test with custom event
const customTestResult = await webhookClient.testWebhook(
  'https://your-app.com/webhook',
  {
    id: 'test-123',
    type: 'custom.test',
    data: { message: 'Custom test event' },
    timestamp: new Date(),
    source: 'test-suite',
  }
);
```

### Event Delivery

```typescript
// Simulate delivering an event to all subscriptions
const event = {
  id: 'evt_123',
  type: 'user.created',
  data: {
    userId: '456',
    email: 'newuser@example.com',
  },
  timestamp: new Date(),
  source: 'user-service',
};

const deliveries = await webhookClient.deliverEvent(event);
console.log('Event deliveries:', deliveries);
```

### Signature Verification

```typescript
// Verify webhook signature (for incoming webhooks)
const payload = '{"event":"user.created","data":{"id":"123"}}';
const signature = 'sha256=abcdef123456...';
const secret = 'your-webhook-secret';

const isValid = webhookClient.verifySignature(payload, signature, secret);
console.log('Signature valid:', isValid);

// Generate signature (for outgoing webhooks)
const generatedSignature = webhookClient.generateSignature(payload, secret);
console.log('Generated signature:', generatedSignature);
```

## API Reference

### WebhookConfig

Configuration object for initializing the WebhookClient.

```typescript
interface WebhookConfig {
  apiKey: string; // Required API key
  baseUrl?: string; // Optional base URL
  timeout?: number; // Optional timeout in milliseconds
  retryAttempts?: number; // Optional default retry attempts
  retryDelay?: number; // Optional default retry delay
}
```

### WebhookPayload

Webhook request payload.

```typescript
interface WebhookPayload {
  url: string; // Target URL
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // HTTP method
  headers?: Record<string, string>; // HTTP headers
  data?: unknown; // Request body data
  timeout?: number; // Request timeout
}
```

### WebhookResponse

Response from webhook operations.

```typescript
interface WebhookResponse {
  success: boolean; // Whether the operation succeeded
  status?: number; // HTTP status code
  data?: unknown; // Response data
  error?: string; // Error message (if failed)
  duration?: number; // Request duration in milliseconds
  attempt?: number; // Number of attempts made
}
```

### WebhookSubscription

Webhook subscription object.

```typescript
interface WebhookSubscription {
  id: string; // Unique subscription ID
  url: string; // Webhook endpoint URL
  events: string[]; // Array of event types to subscribe to
  secret?: string; // Optional secret for signature verification
  active: boolean; // Whether the subscription is active
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
}
```

### RetryOptions

Options for retry behavior.

```typescript
interface RetryOptions {
  maxAttempts?: number; // Maximum retry attempts
  delay?: number; // Base delay between retries
  backoff?: 'linear' | 'exponential'; // Backoff strategy
  maxDelay?: number; // Maximum delay between retries
}
```

## Methods

- `send(payload, retryOptions?)`: Send a webhook request
- `createSubscription(url, events, secret?)`: Create webhook subscription
- `updateSubscription(id, updates)`: Update webhook subscription
- `deleteSubscription(id)`: Delete webhook subscription
- `getSubscriptions()`: Get all subscriptions
- `getSubscription(id)`: Get specific subscription
- `testWebhook(url, testEvent?)`: Test webhook endpoint
- `verifySignature(payload, signature, secret, algorithm?)`: Verify webhook signature
- `generateSignature(payload, secret, algorithm?)`: Generate webhook signature
- `deliverEvent(event)`: Deliver event to subscriptions
- `getConfig()`: Get client configuration

## Error Handling

The SDK provides detailed error information for failed operations:

```typescript
const response = await webhookClient.send(payload);

if (!response.success) {
  console.error('Webhook failed:', response.error);
  console.error('After attempts:', response.attempt);
  console.error('Duration:', response.duration);
}
```

## Security

### Signature Verification

Always verify webhook signatures when receiving webhooks:

```typescript
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);

  if (
    !webhookClient.verifySignature(
      payload,
      signature,
      process.env.WEBHOOK_SECRET
    )
  ) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook...
  res.status(200).send('OK');
});
```

## License

MIT
