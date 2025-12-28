# omx-sdk

## 1.0.3

### Patch Changes

- Unified SDK release with improved configuration and better service integration.
  - Renamed main SDK class to `omxClient`.
  - Added support for custom Supabase credentials in `OMXConfig`.
  - Integrated `@omx-sdk/campaign` into the unified client.
  - Fixed various linting and build issues across packages.

- Updated dependencies
  - @omx-sdk/core@1.0.2
  - @omx-sdk/campaign@1.0.12
  - @omx-sdk/notification@1.0.2
  - @omx-sdk/geotrigger@1.0.3
  - @omx-sdk/email@1.0.2
  - @omx-sdk/webhook@1.0.2
  - @omx-sdk/beacon@1.0.2

## 1.0.0

### Major Changes

- Initial release of the unified omx-sdk package

Complete SDK package that combines all OMX functionality:

- Unified API for all services
- Authentication management
- Geotrigger capabilities
- Email notifications
- Webhook integration
- Beacon detection
- Push notifications
- TypeScript support with full type definitions

### Patch Changes

- Updated dependencies
  - @omx-sdk/core@1.0.0
  - @omx-sdk/geotrigger@1.0.0
  - @omx-sdk/email@1.0.0
  - @omx-sdk/webhook@1.0.0
  - @omx-sdk/beacon@1.0.0
  - @omx-sdk/notification@1.0.1
