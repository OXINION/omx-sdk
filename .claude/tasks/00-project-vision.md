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
