# @omx-sdk/beacon

Bluetooth beacon management module for proximity marketing and indoor positioning.

<https://www.npmjs.com/package/@omx-sdk/beacon>

## Installation

### Option 1: Individual Package

```bash
npm install @omx-sdk/beacon @omx-sdk/core
```

### Option 2: Unified Package (includes all modules)

```bash
npm install omx-sdk
```

## Basic Usage

```js
import { createOmxClient } from "omx-sdk";

// Initialize OMX client (includes all modules)
const omx = createOmxClient({
  clientId: "your_client_id",
  secretKey: "your_secret_key",
});

// Beacon module is available as omx.beacon
```

## Methods

```js
// Register new beacon
const newBeacon = await omx.beacon.register({
  uuid: "550e8400-e29b-41d4-a716-446655440000",
  major: 1,
  minor: 1,
  name: "Store Entrance",
  location: {
    latitude: 40.7128,
    longitude: -74.006,
    description: "Main entrance beacon",
  },
});

// Get nearby beacons
const nearbyBeacons = await omx.beacon.getNearby({
  latitude: 40.7128,
  longitude: -74.006,
  radius: 50, // meters
});

// Update beacon configuration
await omx.beacon.updateConfig("beacon_123", {
  transmissionPower: -12,
  advertisingInterval: 100,
  name: "Updated Beacon Name",
});

// Check beacon status
const status = await omx.beacon.getStatus("beacon_123");
```

## What This Module Does

- ✅ **Beacon Management** - Register and configure beacons
- ✅ **Proximity Detection** - Find nearby beacons
- ✅ **Indoor Positioning** - Track precise location

## What This Module Does NOT Do

- ❌ **Hardware Configuration** - Use manufacturer tools for firmware
- ❌ **Bluetooth Scanning** - Use device-native BLE libraries
- ❌ **Physical Installation** - Requires on-site beacon deployment
