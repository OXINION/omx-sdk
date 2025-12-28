# @omx-sdk/campaign

## 1.0.13

### Patch Changes

- Fix package publishing issues:
  - Fixed campaign package ES module directory import error
  - Fixed notification package dependency configuration
  - Updated omx-sdk version constant to match package.json

## 1.0.12

### Patch Changes

- Unified SDK release with improved configuration and better service integration.
  - Renamed main SDK class to `omxClient`.
  - Added support for custom Supabase credentials in `OMXConfig`.
  - Integrated `@omx-sdk/campaign` into the unified client.
  - Fixed various linting and build issues across packages.

## 1.0.1

### Major Changes

- Initial release of @omx-sdk/campaign package

Campaign management functionality for the OMX SDK:

- Campaign creation and management
- Campaign statistics and analytics
- Campaign filtering and search
- Team-based campaign organization
- TypeScript support with comprehensive type definitions
- Integration with Supabase backend
