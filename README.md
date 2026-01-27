# OMX SDK Monorepo

A unified SDK for the Oxinion Marketing Exchange, providing both JavaScript and Python implementations with a shared OpenAPI specification.

## 🏗️ Structure

```text
omx-sdk/
├─ spec/                     # Single OpenAPI specification
│   └─ openapi.yaml         # Source of truth for all SDKs
├─ js/                      # JavaScript SDK
│   ├─ packages/
│   │   ├─ core/           # @omx-sdk/core
│   │   ├─ geotrigger/     # @omx-sdk/geotrigger
│   │   ├─ email/          # @omx-sdk/email
│   │   ├─ webhook/        # @omx-sdk/webhook
│   │   ├─ shared/         # @omx-sdk/shared
│   │   └─ meta/omx-sdk/   # omx-sdk (meta package)
│   └─ examples/
├─ py/                      # Python SDK
│   ├─ omx_sdk/
│   │   ├─ core/           # Core authentication
│   │   ├─ geo_trigger/    # Geotrigger functionality
│   │   ├─ email/          # Email functionality
│   │   ├─ webhook/        # Webhook functionality
│   │   └─ shared/         # Shared utilities
│   └─ examples/
└─ docs/                   # Documentation
```

## 🚀 Quick Start

### JavaScript

```bash
# Install SDK
npm install omx-sdk
```

```javascript
// Usage
import { createOmxClient } from "omx-sdk";

const omx = createOmxClient({
  clientId: process.env.OMX_CLIENT_ID,
  secretKey: process.env.OMX_SECRET_KEY,
});

const geoTrigger = await omx.geoTrigger.create({
  name: "Coffee Shop Promo",
  location: { lat: 43.6532, lng: -79.3832 },
  radius: 100,
  onEnter: {
    notification: {
      title: "Welcome!",
      body: "Get 30% off your order!",
    },
  },
});

console.log("GeoTrigger created:", geoTrigger.id);
```

### Python

```bash
# Install SDK
pip install omx-sdk
```

```python
# Usage
from omx_sdk import OMXClient

omx = OMXClient(
    client_id="your-client-id",
    secret_key="your-secret-key"
)

geo_trigger = await omx.geo_trigger.create({
    "name": "Coffee Shop Promo",
    "location": {"lat": 43.6532, "lng": -79.3832},
    "radius": 100,
    "on_enter": {
        "notification": {
            "title": "Welcome!",
            "body": "Get 30% off your order!"
        }
    }
})

print("GeoTrigger created:", geo_trigger.id)

```

## 📦 Available SDKs

| SDK                      | Location                | Installation          |
| ------------------------ | ----------------------- | --------------------- |
| **Node.js / TypeScript** | [`js/`](./js/README.md) | `npm install omx-sdk` |
| **Python**               | [`py/`](./py/README.md) | `pip install omx-sdk` |

### JavaScript Packages (NPM)

- `omx-sdk` - Meta package (includes all modules)
- `@omx-sdk/core` - Authentication and base client
- `@omx-sdk/geotrigger` - Geotrigger management
- `@omx-sdk/email` - Email sending
- `@omx-sdk/webhook` - Webhook management
- `@omx-sdk/shared` - Shared utilities and types

### Python Package (PyPI)

- `omx-sdk` - Complete Python SDK

## 🛠️ Development

### JavaScript Development

```bash
cd js
pnpm install
pnpm build
pnpm test
```

### Python Development

```bash
cd py
pip install -e ".[dev]"
python -m pytest
```

### Both (from root)

```bash
npm run build     # Build both JS and Python
npm run test      # Test both
npm run lint      # Lint both
```

## 🔄 Migration

Migrating from v1.x? See [MIGRATION.md](./docs/MIGRATION.md) for detailed instructions.

### Key Changes

- ✅ **No import changes** required for JavaScript users
- 🆕 **Python SDK** now available
- 📁 **Monorepo structure** with shared OpenAPI spec
- ⚠️ Removed packages: `beacon`, `campaign`, `notification`

## 📖 Documentation

- [Migration Guide](./docs/MIGRATION.md)
- [Publishing Guide](./docs/PUBLISHING.md)
- [Setup Summary](./docs/SETUP_SUMMARY.md)
- [Examples](./js/examples/) (JavaScript) | [Examples](./py/examples/) (Python)

## 🤝 Contributing

1. Make changes to `spec/openapi.yaml` first
2. Generate code: `npm run generate`
3. Implement in both JS and Python
4. Test: `npm run test`
5. Submit PR

## 📄 License

MIT - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Repository](https://github.com/oxinion/omx-sdk)
- [Issues](https://github.com/oxinion/omx-sdk/issues)
- [Releases](https://github.com/oxinion/omx-sdk/releases)
