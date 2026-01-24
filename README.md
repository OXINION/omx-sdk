# OMX SDK Monorepo

A unified SDK for the Oxinion Marketing Exchange, providing both JavaScript and Python implementations with a shared OpenAPI specification.

## 🏗️ Structure

```
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

```javascript
// Install meta package (recommended)
npm install omx-sdk

// Usage
import { OMXClient } from 'omx-sdk'

const client = new OMXClient({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key'
})

await client.authenticate()
const geotrigger = await client.geotriggers.create({
  name: 'Coffee Shop',
  latitude: 40.7128,
  longitude: -74.0060,
  radius: 100
})
```

### Python

```bash
# Install SDK
pip install omx-sdk
```

```python
# Usage
from omx_sdk import OMXClient

client = OMXClient(
    api_key="your-api-key", 
    secret_key="your-secret-key"
)

await client.authenticate()
geotrigger = await client.geotriggers.create(
    name="Coffee Shop",
    latitude=40.7128,
    longitude=-74.0060,
    radius=100
)
```

## 📦 Available Packages

### JavaScript (NPM)
- `omx-sdk` - Meta package (includes all modules)
- `@omx-sdk/core` - Authentication and base client
- `@omx-sdk/geotrigger` - Geotrigger management
- `@omx-sdk/email` - Email sending
- `@omx-sdk/webhook` - Webhook management
- `@omx-sdk/shared` - Shared utilities and types

### Python (PyPI)
- `omx-sdk` - Complete Python SDK

## 🛠️ Development

### JavaScript
```bash
cd js
pnpm install
pnpm build
pnpm test
```

### Python  
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

### Key Changes:
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