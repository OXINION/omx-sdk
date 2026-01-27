# OMX SDK Monorepo Structure

## Goal

Design a scalable pnpm + turborepo monorepo for modular SDK packages that supports:

1. Individual module installs
2. Unified meta-package (`omx-sdk`) that bundles all modules
3. Supabase backend integration for data persistence

This repo must be publishable to npm and support tree-shaking.

---

## Folder Structure

```txt
omx-sdk/
  packages/
    core/              ← Authentication & HTTP client
    geotrigger/        ← Location-based triggers
    notification/      ← Push notifications
    email/             ← Email marketing
    webhook/           ← Event webhooks
    beacon/            ← Bluetooth beacon management
    campaign/          ← Campaign management
    types/             ← Shared TypeScript types
    meta/              ← Meta package (published as `omx-sdk`)

  supabase/
    migrations/        ← Database schema migrations
    functions/         ← Edge functions for authentication
    seed.sql           ← Sample data for development

  docs/                ← API documentation
  examples/            ← Usage examples
```

## Backend Architecture

### Supabase Database Schemas

- **`public`** - User authentication and core data
- **`omx`** - Core OMX platform (workflows, geofences, events)
- **`business`** - Business-specific data (campaigns, analytics)

### Edge Functions

- **`create-jwt-token`** - Validates client credentials and returns JWT
- **`webhook-handler`** - Processes incoming webhook events
- **`analytics-processor`** - Aggregates usage metrics
