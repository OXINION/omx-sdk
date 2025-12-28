# @omx-sdk/notification

## 1.0.3

### Patch Changes

- Fix package publishing issues:
  - Fixed campaign package ES module directory import error
  - Fixed notification package dependency configuration
  - Updated omx-sdk version constant to match package.json

## 1.0.2

### Patch Changes

- Unified SDK release with improved configuration and better service integration.
  - Renamed main SDK class to `omxClient`.
  - Added support for custom Supabase credentials in `OMXConfig`.
  - Integrated `@omx-sdk/campaign` into the unified client.
  - Fixed various linting and build issues across packages.

- Updated dependencies
  - @omx-sdk/core@1.0.2
