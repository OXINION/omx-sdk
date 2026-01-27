# @omx-sdk/geotrigger

Location-based trigger module for creating geofences and proximity-based automation.

<https://www.npmjs.com/package/@omx-sdk/geotrigger>

## Installation

### Option 1: Individual Package

```bash
npm install @omx-sdk/geotrigger @omx-sdk/core
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
  secretKey: "your_secret_key"
});

// Geotrigger module is available as omx.geotrigger
```

## Methods

```js
// Create circular geofence
const fence = await omx.geotrigger.createGeofence({
  name: "Downtown Store",
  latitude: 40.7128,
  longitude: -74.006,
  radius: 100, // meters
  events: ["enter", "exit"],
});

// Create polygon geofence
await omx.geotrigger.createPolygonFence({
  name: "Shopping District",
  coordinates: [
    [40.7128, -74.006],
    [40.713, -74.0055],
    [40.7125, -74.005],
  ],
  events: ["enter"],
});

// Get active geofences
const fences = await omx.geotrigger.getGeofences({
  active: true,
  near: { lat: 40.7128, lng: -74.006, radius: 1000 },
});

// Check if location is inside geofence
const isInside = await omx.geotrigger.checkLocation({
  geofenceId: "fence_123",
  latitude: 40.7128,
  longitude: -74.006,
});

// Get location events
const events = await omx.geotrigger.getEvents({
  geofenceId: "fence_123",
  eventType: "enter",
  since: "2024-01-01T00:00:00Z",
});

// Update geofence
await omx.geotrigger.updateGeofence("fence_123", {
  name: "Updated Store Name",
  radius: 150, // meters
  events: ["enter", "exit", "dwell"]
});

// Remove geofence
await omx.geotrigger.removeGeofence("fence_123");

// Bulk operations
await omx.geotrigger.removeMultipleGeofences([
  "fence_123", 
  "fence_456", 
  "fence_789"
]);
```

## What This Module Does

- ✅ **Geofencing** - Create circular and polygon boundaries
- ✅ **Location Events** - Track enter/exit events
- ✅ **Proximity Detection** - Check if points are inside boundaries
- ✅ **Event History** - Track location-based interactions

## What This Module Does NOT Do

- ❌ **GPS Tracking** - Use dedicated tracking services
- ❌ **Maps Rendering** - Use mapping libraries
- ❌ **Route Planning** - Use navigation services
