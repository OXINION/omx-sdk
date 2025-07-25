# OMX SDK Examples

This directory contains examples demonstrating how to use the OMX SDK.

## Import Pattern

The OMX SDK supports the preferred default import pattern:

```typescript
import OMX from 'omx-sdk';

// Initialize the SDK
const sdk = await OMX.initialize({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.oxinion.com',
  // Service-specific configurations...
});

// Use the services
await sdk.email.send({
  /* email options */
});
sdk.geotrigger.addRegion({
  /* region config */
});
```

Alternative import patterns are also supported:

```typescript
// Named imports
import { OMXSDK, createOMXSDK } from 'omx-sdk';

// Individual packages
import { EmailClient } from '@omx-sdk/email';
import { Geotrigger } from '@omx-sdk/geotrigger';
```

## Files

### demo.html

A complete HTML demo that shows all SDK features. This file contains a simulated version of the SDK for demonstration purposes.

To run:

```bash
# Option 1: Simple HTTP server
python3 -m http.server 8000
# Then open http://localhost:8000/demo.html

# Option 2: Using Node.js
npx serve .
# Then open the provided URL
```

### example.ts

A comprehensive TypeScript example showing how to use the real OMX SDK in a Node.js or browser environment.

This example demonstrates:

- SDK initialization and health checking
- Geotrigger setup and monitoring
- Email sending with attachments
- Webhook creation and testing
- Beacon scanning (if supported)
- Push notification subscription
- Analytics collection

## Features Demonstrated

### 1. Geotrigger

- Adding geofence regions
- Starting/stopping monitoring
- Handling enter/exit events
- Getting current location

### 2. Email

- Sending individual emails
- Email validation
- HTML and text content
- File attachments

### 3. Webhook

- Creating subscriptions
- Testing webhook endpoints
- Sending webhook requests
- Handling responses and retries

### 4. Beacon

- Bluetooth beacon scanning
- Region monitoring
- Proximity detection
- Event handling

### 5. Push Notifications

- Service worker registration
- User subscription
- Local notifications
- Event handling

## Browser Compatibility

- **Geotrigger**: All modern browsers with geolocation
- **Email**: All browsers (server-side operations)
- **Webhook**: All browsers
- **Beacon**: Chrome 56+, Edge 79+ (requires Web Bluetooth)
- **Push Notifications**: Chrome 42+, Firefox 44+, Safari 16+

## Security Notes

- Always use HTTPS in production
- Keep API keys secure (use environment variables)
- Request permissions at appropriate times
- Validate webhook signatures
- Use VAPID keys for push notifications

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Update the configuration in the examples with your actual API keys

3. Run the HTML demo:

   ```bash
   python3 -m http.server 8000
   ```

4. Open your browser and navigate to the demo

## Real Implementation

To use the actual OMX SDK in your project:

```bash
npm install omx-sdk
```

```typescript
import { createOMXSDK } from 'omx-sdk';

const sdk = createOMXSDK({
  apiKey: 'your-api-key',
  // ... other configuration
});

await sdk.initialize();
// Use the SDK...
```
