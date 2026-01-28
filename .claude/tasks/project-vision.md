# OMX SDK — Project Vision

## Purpose

OMX SDK is a modular, multi-platform SDK for the Oxinion ecosystem.
It powers geo-first, context-aware automation workflows across:

- Web (Next.js, React)
- Mobile (iOS, Android)
- Edge (beacons, IoT, context devices)

It is inspired by:

- AWS SDK modular packages
- Stripe SDK ergonomics
- n8n node architecture

## Core Principles

- Tree-shakable modular packages
- Strict TypeScript types
- Unified meta-package (`omx-sdk`)
- Transport-agnostic (REST, Edge, WebSocket)
- Auto-generated types (future: OpenAPI)

## Target Developer Experience

```ts
import { createOmxClient } from "omx-sdk";
import { geoTrigger } from "@omx-sdk/geotrigger";

const omx = createOmxClient({ clientId: "abc123", secretKey: "secretXYZ" });

await omx.geoTrigger.create({
	lat: 37.5,
	lng: 127.0,
	radius: 200,
});
```

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
