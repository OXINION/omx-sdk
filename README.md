# omx-sdk

A **modular TypeScript SDK** providing a unified interface to Oxinion's services across platforms.

## Why SDK?

To **minimize integration effort** for partners and developers by offering a consistent, modular interface to Oxinion's services across platforms:

**Target platforms**: Android, iOS, Web (Next.js/React), Beacon

## Features

- ✅ **Individual installable packages** (e.g., `@omx-sdk/geotrigger`, `@omx-sdk/email`)
- ✅ **Unified meta package** (`omx-sdk`) that wraps all sub-packages
- ✅ **Strict TypeScript typing** with full IntelliSense support
- ✅ **Core package** (`@omx-sdk/core`) handling authentication and shared logic
- ✅ **Tree-shakable** - only import what you need
- ✅ Built with **pnpm workspaces** and **Turborepo** for optimal performance

## Quick Start

### Installation

Install the unified SDK:

```bash
npm install omx-sdk
# or
pnpm add omx-sdk
# or
yarn add omx-sdk
```

Or install individual packages:

```bash
npm install @omx-sdk/email @omx-sdk/geotrigger @omx-sdk/webhook
```

### Basic Usage

```typescript
import { omxClient } from "omx-sdk";

const omx = new omxClient({
  clientId: "your-client-id",
  secretKey: "your-secret-key",
});

// Send email
await omx.email.send({
  to: "user@example.com",
  subject: "Welcome!",
  body: "Hello from OMX SDK!",
});

// Set up geotrigger
omx.geotrigger.addRegion({
  id: "office",
  center: { latitude: 37.7749, longitude: -122.4194 },
  radius: 100,
});

await omx.geotrigger.startMonitoring((event) => {
  console.log("Geofence event:", event);
});
```

### Using Individual Packages

```typescript
import { EmailClient } from "@omx-sdk/email";
import { GeotriggerClient } from "@omx-sdk/geotrigger";

const emailClient = new EmailClient({
  clientId: "your-client-id",
  secretKey: "your-secret-key",
});

const geotrigger = new GeotriggerClient({
  clientId: "your-client-id",
  secretKey: "your-secret-key",
});
```

## Available Packages

| Package                      | Description                                  | Status            |
| ---------------------------- | -------------------------------------------- | ----------------- |
| `@omx-sdk/core`              | Authentication, config, and shared utilities | ✅ Core           |
| `@omx-sdk/email`             | Email sending functionality                  | 🚧 In Development |
| `@omx-sdk/geotrigger`        | Location-based triggers and geofencing       | 🚧 In Development |
| `@omx-sdk/webhook`           | Webhook management and handling              | 📋 Planned        |
| `@omx-sdk/beacon`            | Beacon detection and proximity services      | 📋 Planned        |
| `@omx-sdk/push-notification` | Push notification delivery                   | 📋 Planned        |

## SDK Architecture

```
omx-sdk/
├── packages/
│   ├── omx-sdk/                    # 📦 Unified SDK (exports OmxClient)
│   ├── core/                       # 🔧 Auth, Config, HttpClient
│   ├── email/                      # 📧 @omx-sdk/email
│   ├── geotrigger/                 # 📍 @omx-sdk/geotrigger
│   ├── webhook/                    # 🔗 @omx-sdk/webhook
│   ├── beacon/                     # 📡 @omx-sdk/beacon
│   └── push-notification/          # 🔔 @omx-sdk/push-notification
├── examples/                       # 📚 Usage examples
├── docs/                          # 📖 Documentation
└── tools/                         # 🛠️ Build and dev tools
```

## Examples

The [`examples/`](./examples/) directory contains comprehensive test files and demos:

### 🚀 Quick Start Testing

```bash
cd examples
pnpm test  # Run main SDK test
```

### 📂 Available Examples

| File                      | Description                               | How to Run                                                |
| ------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| `example.ts`              | Main authentication and feature test      | `pnpm test` or `npx tsx example.ts`                       |
| `test-omx-integration.ts` | Integration testing with geotrigger focus | `npx tsx test-omx-integration.ts`                         |
| `auth-test.ts`            | Authentication flow testing               | `npx tsx auth-test.ts`                                    |
| `demo.html`               | Browser demo with all features            | `pnpm serve` → open `localhost:8000/demo.html`            |
| `auth-demo.html`          | Browser authentication demo               | `pnpm serve` → open `localhost:8000/auth-demo.html`       |
| `geotrigger-test.html`    | Geotrigger-specific browser test          | `pnpm serve` → open `localhost:8000/geotrigger-test.html` |

### 📚 Documentation Examples

- [Email sending](./examples/email.md)
- [Geotrigger setup](./examples/geotrigger.md)
- [Webhook handling](./examples/webhook.md)
- [React integration](./examples/react-app.md)
- [Node.js server](./examples/nodejs-server.md)

**💡 Tip**: Use real credentials from [omx.oxinion.com/token](https://omx.oxinion.com/token) for full functionality testing.

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/oxinion/omx-sdk.git
cd omx-sdk

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development mode
pnpm dev
```

## Testing the SDK

The SDK includes comprehensive examples and tests in the `examples/` directory. Here are several ways to test the SDK:

### 🚀 Quick Test (Recommended)

```bash
cd examples
pnpm test
```

This runs the main authentication and functionality test using TypeScript directly.

### 🌐 Browser Testing

```bash
cd examples
pnpm serve
# Opens http://localhost:8000
```

Then navigate to:

- `demo.html` - Full SDK demo with browser APIs
- `auth-demo.html` - Authentication flow demo
- `geotrigger-test.html` - Geotrigger-specific testing

### 🧪 Different Test Scenarios

```bash
cd examples

# Main authentication flow test
npx tsx example.ts

# Integration testing focused on geotrigger
npx tsx test-omx-integration.ts

# Basic auth test
npx tsx auth-test.ts

# Test current SDK functionality
npx tsx test-current-sdk.js
```

### 📱 Environment-Specific Features

**Node.js Environment:**

- ✅ Email, Webhook, Core authentication
- ⚠️ Geolocation, Beacon, Push notifications (require browser APIs)

**Browser Environment:**

- ✅ All features including geolocation and device APIs
- 🔄 Auto-terminates tests after 30 seconds

### 🔑 Using Real Credentials

To test with real credentials, update the config in `examples/example.ts`:

```typescript
const config = {
  clientId: "your-actual-client-id",
  secretKey: "your-actual-secret-key",
};
```

Get your credentials from [omx.oxinion.com/token](https://omx.oxinion.com/token).

### 📋 Test Coverage

The examples test:

- ✅ SDK initialization and authentication
- ✅ Error handling for invalid credentials
- ✅ Email service integration
- ✅ Geotrigger functionality
- ✅ Webhook management
- ✅ Individual package imports
- ✅ TypeScript type checking

For detailed testing instructions, see [`examples/TEST_GUIDE.md`](./examples/TEST_GUIDE.md).

### Monorepo Structure

This project uses:

- **pnpm workspaces** for dependency management
- **Turborepo** for build orchestration and caching
- **TypeScript** with strict configuration
- **ESLint + Prettier** for code quality

### Adding a New Package

1. Create package directory: `packages/your-package/`
2. Add `package.json` with proper naming: `@omx-sdk/your-package`
3. Implement functionality in `src/index.ts`
4. Add tests in `src/__tests__/`
5. Update main SDK to include your package

## API Reference

### OmxClient

The main entry point for the unified SDK.

```typescript
class OmxClient {
  constructor(config: OmxConfig);

  // Service clients
  readonly email: EmailClient;
  readonly geotrigger: GeotriggerClient;
  readonly webhook: WebhookClient;
  // ... other services
}
```

For detailed API documentation, see the [API Reference](./docs/api.md).

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for your changes
5. Run `pnpm test` and `pnpm lint`
6. Create a changeset: `pnpm changeset`
7. Commit your changes: `git commit -m 'Add amazing feature'`
8. Push to the branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Publishing

See [PUBLISHING.md](./PUBLISHING.md) for detailed information about publishing packages to npm.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

- 📖 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/oxinion/omx-sdk/issues)
- 💬 [Discussions](https://github.com/oxinion/omx-sdk/discussions)
- 📧 [Email Support](mailto:support@oxinion.com)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of changes and version history.

---

**Reference**: [Naver D2 - SDK Development Guide](https://d2.naver.com/helloworld/2351859)
