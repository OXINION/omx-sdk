# @omx-sdk/geotrigger

Geolocation trigger functionality for the OMX SDK. This package provides geofence monitoring capabilities for web applications.

## Installation

```bash
npm install @omx-sdk/geotrigger
# or
pnpm add @omx-sdk/geotrigger
```

## Usage

```typescript
import { Geotrigger, createGeotrigger } from "@omx-sdk/geotrigger";

// Create a geotrigger instance
const geotriggerClient = createGeotrigger({
  clientId: "your-client-id",
  secretKey: "your-secret-key",
});

// Add geofence regions
geotriggerClient.addRegion({
  id: "office",
  center: {
    latitude: 37.7749,
    longitude: -122.4194,
  },
  radius: 100, // meters
  name: "Office Building",
});

// Start monitoring
geotrigger
  .startMonitoring((event) => {
    console.log(`Geofence ${event.type}: ${event.regionId}`, event);
  })
  .then(() => {
    console.log("Geofence monitoring started");
  })
  .catch((error) => {
    console.error("Failed to start monitoring:", error);
  });

// Get current location
geotrigger.getCurrentLocation().then((location) => {
  console.log("Current location:", location);
});

// Stop monitoring
geotrigger.stopMonitoring();
```

## API Reference

### GeotriggerConfig

Configuration object for initializing the Geotrigger.

```typescript
interface GeotriggerConfig {
  clientId: string; // Your client ID
  secretKey: string; // Your secret key
}
```

### GeofenceRegion

Defines a geofence region to monitor.

```typescript
interface GeofenceRegion {
  id: string; // Unique identifier
  center: Location; // Center point of the geofence
  radius: number; // Radius in meters
  name?: string; // Optional display name
}
```

### TriggerEvent

Event fired when entering or exiting a geofence.

```typescript
interface TriggerEvent {
  regionId: string; // ID of the triggered region
  type: "enter" | "exit"; // Type of trigger
  location: Location; // Current location
  timestamp: Date; // When the event occurred
}
```

## Methods

- `addRegion(region: GeofenceRegion)`: Add a geofence region
- `removeRegion(regionId: string)`: Remove a geofence region
- `getRegions()`: Get all registered regions
- `startMonitoring(callback, options?)`: Start monitoring geofences
- `stopMonitoring()`: Stop monitoring
- `getCurrentLocation(options?)`: Get current location
- `isMonitoring()`: Check if currently monitoring

## License

MIT
