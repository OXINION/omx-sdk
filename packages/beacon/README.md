# @omx-sdk/beacon

Beacon integration functionality for the OMX SDK. This package provides Bluetooth beacon scanning, proximity detection, and region monitoring capabilities.

## Installation

```bash
npm install @omx-sdk/beacon
# or
pnpm add @omx-sdk/beacon
```

## Usage

### Basic Beacon Scanning

```typescript
import { BeaconManager, createBeaconManager } from '@omx-sdk/beacon';

// Create a beacon manager
const beaconManager = createBeaconManager({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.oxinion.com/beacon', // optional
  timeout: 10000, // optional
  scanInterval: 1000, // optional - scan every 1 second
});

// Initialize the beacon manager
await beaconManager.initialize();

// Add beacon regions to monitor
beaconManager.addRegion({
  id: 'store-entrance',
  uuid: 'B0702880-A295-A8AB-F734-031A98A512DE',
  major: 1,
  minor: 1,
  name: 'Store Entrance',
});

beaconManager.addRegion({
  id: 'checkout-area',
  uuid: 'B0702880-A295-A8AB-F734-031A98A512DE',
  major: 1,
  minor: 2,
  name: 'Checkout Area',
});

// Add event listeners
beaconManager.addEventListener('enter', (event) => {
  console.log(`Entered region: ${event.region.name}`);
  console.log('Beacons detected:', event.beacons);
});

beaconManager.addEventListener('exit', (event) => {
  console.log(`Exited region: ${event.region.name}`);
});

beaconManager.addEventListener('range', (event) => {
  console.log(`Ranging in region: ${event.region.name}`);
  event.beacons?.forEach((beacon) => {
    console.log(`Beacon ${beacon.id}: ${beacon.distance?.toFixed(2)}m away`);
  });
});

// Start scanning
await beaconManager.startScanning();
```

### Advanced Scanning Options

```typescript
// Start scanning with specific options
await beaconManager.startScanning({
  duration: 30000, // Scan for 30 seconds
  interval: 500, // Scan every 500ms
  allowDuplicates: true, // Allow duplicate detections
  filterByRegions: [
    // Only scan for specific regions
    {
      id: 'target-region',
      uuid: 'B0702880-A295-A8AB-F734-031A98A512DE',
      major: 1,
    },
  ],
});

// Get all discovered beacons
const allBeacons = beaconManager.getDiscoveredBeacons();
console.log('All discovered beacons:', allBeacons);

// Get beacons in a specific region
const storeBeacons = beaconManager.getBeaconsInRegion('store-entrance');
console.log('Store entrance beacons:', storeBeacons);

// Stop scanning
beaconManager.stopScanning();
```

### Proximity and Distance Estimation

```typescript
// Estimate distance from RSSI
const distance = beaconManager.estimateDistance(-65, -59); // rssi, txPower
console.log(`Estimated distance: ${distance.toFixed(2)}m`);

// Get proximity category
const proximity = beaconManager.getProximity(distance);
console.log(`Proximity: ${proximity}`); // 'immediate', 'near', 'far', or 'unknown'

// Access beacon proximity data
beaconManager.addEventListener('range', (event) => {
  event.beacons?.forEach((beacon) => {
    console.log(`Beacon ${beacon.id}:`);
    console.log(`  RSSI: ${beacon.rssi} dBm`);
    console.log(`  Distance: ${beacon.distance?.toFixed(2)}m`);
    console.log(`  Proximity: ${beacon.proximity}`);
  });
});
```

### Analytics and Monitoring

```typescript
// Get beacon analytics
const analytics = beaconManager.getAnalytics();
console.log('Beacon Analytics:', {
  totalBeacons: analytics.totalBeacons,
  regionsMonitored: analytics.regionsMonitored,
  events: analytics.events,
  averageRssi: analytics.averageRssi,
  strongestSignal: analytics.strongestSignal,
  uptime: analytics.uptime,
});

// Clear discovered beacons
beaconManager.clearDiscoveredBeacons();

// Check scanning status
const isScanning = beaconManager.isCurrentlyScanning();
console.log('Is currently scanning:', isScanning);
```

### Region Management

```typescript
// Add multiple regions
const regions = [
  {
    id: 'entrance',
    uuid: 'B0702880-A295-A8AB-F734-031A98A512DE',
    major: 1,
    minor: 1,
    name: 'Entrance',
  },
  {
    id: 'electronics',
    uuid: 'B0702880-A295-A8AB-F734-031A98A512DE',
    major: 2,
    name: 'Electronics Section',
  },
];

regions.forEach((region) => beaconManager.addRegion(region));

// Get all regions
const allRegions = beaconManager.getRegions();
console.log('Monitored regions:', allRegions);

// Remove a region
const removed = beaconManager.removeRegion('entrance');
console.log('Region removed:', removed);
```

## API Reference

### BeaconConfig

Configuration object for initializing the BeaconManager.

```typescript
interface BeaconConfig {
  apiKey: string; // Required API key
  baseUrl?: string; // Optional base URL
  timeout?: number; // Optional timeout in milliseconds
  scanInterval?: number; // Optional scan interval in milliseconds
}
```

### BeaconDevice

Represents a discovered beacon.

```typescript
interface BeaconDevice {
  id: string; // Unique beacon identifier
  uuid: string; // Beacon UUID
  major: number; // Major value
  minor: number; // Minor value
  rssi: number; // Signal strength in dBm
  distance?: number; // Estimated distance in meters
  proximity: 'immediate' | 'near' | 'far' | 'unknown'; // Proximity category
  lastSeen: Date; // Last detection timestamp
  name?: string; // Optional beacon name
  manufacturer?: string; // Optional manufacturer info
}
```

### BeaconRegion

Defines a region to monitor for beacons.

```typescript
interface BeaconRegion {
  id: string; // Unique region identifier
  uuid: string; // Beacon UUID to match
  major?: number; // Optional major value filter
  minor?: number; // Optional minor value filter
  name?: string; // Optional display name
}
```

### BeaconEvent

Event object for beacon-related events.

```typescript
interface BeaconEvent {
  type: 'enter' | 'exit' | 'range'; // Event type
  region: BeaconRegion; // Associated region
  beacons?: BeaconDevice[]; // Detected beacons (for range events)
  timestamp: Date; // Event timestamp
}
```

### ScanOptions

Options for beacon scanning.

```typescript
interface ScanOptions {
  duration?: number; // Scan duration in milliseconds
  interval?: number; // Scan interval in milliseconds
  allowDuplicates?: boolean; // Allow duplicate detections
  filterByRegions?: BeaconRegion[]; // Filter by specific regions
}
```

### BeaconAnalytics

Analytics data for beacon operations.

```typescript
interface BeaconAnalytics {
  totalBeacons: number; // Total beacons discovered
  regionsMonitored: number; // Number of monitored regions
  events: {
    // Event counters
    enters: number;
    exits: number;
    ranges: number;
  };
  averageRssi: number; // Average signal strength
  strongestSignal: number; // Strongest signal detected
  uptime: number; // Manager uptime in milliseconds
}
```

## Methods

- `initialize()`: Initialize the beacon manager and request permissions
- `addRegion(region)`: Add a beacon region to monitor
- `removeRegion(regionId)`: Remove a beacon region
- `getRegions()`: Get all registered regions
- `startScanning(options?)`: Start beacon scanning
- `stopScanning()`: Stop beacon scanning
- `getDiscoveredBeacons()`: Get all discovered beacons
- `getBeaconsInRegion(regionId)`: Get beacons in a specific region
- `addEventListener(type, listener)`: Add event listener
- `removeEventListener(type, listener)`: Remove event listener
- `getAnalytics()`: Get beacon analytics
- `clearDiscoveredBeacons()`: Clear discovered beacons
- `estimateDistance(rssi, txPower?)`: Estimate distance from RSSI
- `getProximity(distance)`: Get proximity category from distance
- `isCurrentlyScanning()`: Check if currently scanning
- `getConfig()`: Get manager configuration

## Browser Support

This package requires Web Bluetooth API support. It works in:

- Chrome/Chromium 56+
- Edge 79+
- Android Chrome 56+

**Note**: Web Bluetooth is not supported in:

- Safari (desktop/mobile)
- Firefox
- iOS browsers

For production use, consider implementing native mobile apps for broader beacon support.

## Security and Permissions

The beacon manager requires Bluetooth permissions from the user. Make sure to:

1. Request permissions at an appropriate time
2. Handle permission denied scenarios gracefully
3. Provide clear explanations for why Bluetooth access is needed

```typescript
try {
  await beaconManager.initialize();
} catch (error) {
  if (error.message.includes('not supported')) {
    // Show fallback UI for unsupported browsers
    console.log('Beacon functionality not available');
  } else {
    // Handle permission denied or other errors
    console.error('Failed to initialize beacon manager:', error);
  }
}
```

## License

MIT
