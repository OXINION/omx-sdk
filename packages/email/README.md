# @omx-sdk/email

Email sending functionality for the OMX SDK. This package provides email sending capabilities with support for templates, bulk sending, and delivery tracking.

## Installation

```bash
npm install @omx-sdk/email
# or
pnpm add @omx-sdk/email
```

## Usage

### Basic Email Sending

```typescript
import { EmailClient, createEmailClient } from '@omx-sdk/email';

// Create an email client
const emailClient = createEmailClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.oxinion.com/email', // optional
  defaultFrom: 'noreply@yourcompany.com', // optional
  timeout: 10000, // optional
});

// Send a simple email
const result = await emailClient.send({
  to: 'user@example.com',
  subject: 'Hello from OMX SDK',
  body: 'This is a test email from the OMX SDK.',
});

console.log('Email sent:', result);
```

### HTML Email with Attachments

```typescript
const result = await emailClient.send({
  to: ['user1@example.com', 'user2@example.com'],
  from: 'custom@yourcompany.com',
  subject: 'Welcome to Our Service',
  body: 'Welcome! Please see the attached document.',
  html: '<h1>Welcome!</h1><p>Please see the attached document.</p>',
  cc: 'manager@yourcompany.com',
  attachments: [
    {
      filename: 'welcome.pdf',
      content: 'base64-encoded-content',
      contentType: 'application/pdf',
      encoding: 'base64',
    },
  ],
  priority: 'high',
});
```

### Bulk Email Sending

```typescript
const messages = [
  {
    to: 'user1@example.com',
    subject: 'Personal Message 1',
    body: 'Hello User 1!',
  },
  {
    to: 'user2@example.com',
    subject: 'Personal Message 2',
    body: 'Hello User 2!',
  },
];

const results = await emailClient.sendBulk(messages, {
  batchSize: 5, // Send 5 emails at a time
  delay: 1000, // Wait 1 second between batches
});

console.log('Bulk send results:', results);
```

### Template-based Emails

```typescript
const template = {
  id: 'welcome-template',
  name: 'Welcome Email',
  variables: {
    companyName: 'Oxinion',
    supportEmail: 'support@oxinion.com',
  },
};

const result = await emailClient.sendTemplate(template, 'newuser@example.com', {
  userName: 'John Doe',
  activationLink: 'https://app.oxinion.com/activate?token=123',
});
```

### Delivery Tracking

```typescript
// Get delivery status
const status = await emailClient.getDeliveryStatus('msg_123456789');
console.log('Delivery status:', status);

// Get email statistics
const stats = await emailClient.getStats(
  new Date('2023-01-01'),
  new Date('2023-12-31')
);
console.log('Email stats:', stats);
```

## API Reference

### EmailConfig

Configuration object for initializing the EmailClient.

```typescript
interface EmailConfig {
  apiKey: string; // Required API key
  baseUrl?: string; // Optional base URL
  timeout?: number; // Optional timeout in milliseconds
  defaultFrom?: string; // Optional default from address
}
```

### EmailMessage

Email message object.

```typescript
interface EmailMessage {
  to: string | string[]; // Recipient(s)
  from?: string; // Sender (optional if defaultFrom is set)
  subject: string; // Email subject
  body: string; // Plain text body
  html?: string; // HTML body (optional)
  cc?: string | string[]; // CC recipients (optional)
  bcc?: string | string[]; // BCC recipients (optional)
  attachments?: EmailAttachment[]; // File attachments (optional)
  replyTo?: string; // Reply-to address (optional)
  priority?: 'high' | 'normal' | 'low'; // Email priority (optional)
}
```

### EmailResponse

Response object from email operations.

```typescript
interface EmailResponse {
  success: boolean; // Whether the operation succeeded
  messageId?: string; // Unique message identifier (if successful)
  error?: string; // Error message (if failed)
  statusCode?: number; // HTTP status code
}
```

## Methods

- `send(message: EmailMessage)`: Send a single email
- `sendBulk(messages: EmailMessage[], options?)`: Send multiple emails
- `sendTemplate(template, recipients, variables?)`: Send template-based email
- `validateEmail(email: string)`: Validate email address format
- `getDeliveryStatus(messageId: string)`: Get delivery status
- `getStats(dateFrom?, dateTo?)`: Get email statistics
- `getConfig()`: Get client configuration

## Error Handling

The SDK provides detailed error information for failed operations:

```typescript
const result = await emailClient.send(message);

if (!result.success) {
  console.error('Email failed:', result.error);
  console.error('Status code:', result.statusCode);
}
```

## License

MIT
