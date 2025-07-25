export class BeaconManager {
    constructor(config) {
        this.regions = new Map();
        this.discoveredBeacons = new Map();
        this.isScanning = false;
        this.scanInterval = null;
        this.eventListeners = new Map();
        this.analytics = {
            totalBeacons: 0,
            regionsMonitored: 0,
            events: { enters: 0, exits: 0, ranges: 0 },
            averageRssi: 0,
            strongestSignal: -100,
            uptime: 0,
        };
        this.startTime = null;
        this.config = config;
    }
    /**
     * Initialize beacon scanning (request permissions, etc.)
     */
    async initialize() {
        // Check if Web Bluetooth is available
        const nav = navigator;
        if (!nav.bluetooth) {
            throw new Error('Web Bluetooth is not supported in this browser');
        }
        try {
            // Request permission for Bluetooth access
            console.log('Requesting Bluetooth permissions...');
            // In a real implementation, you would request specific device access
            // For now, we'll simulate successful initialization
            await this.sleep(500);
            this.startTime = new Date();
            console.log('Beacon manager initialized successfully');
        }
        catch (error) {
            throw new Error(`Failed to initialize beacon manager: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Add a beacon region to monitor
     */
    addRegion(region) {
        this.regions.set(region.id, region);
        this.analytics.regionsMonitored = this.regions.size;
        console.log(`Added beacon region: ${region.id} (UUID: ${region.uuid})`);
    }
    /**
     * Remove a beacon region
     */
    removeRegion(regionId) {
        const removed = this.regions.delete(regionId);
        if (removed) {
            this.analytics.regionsMonitored = this.regions.size;
            console.log(`Removed beacon region: ${regionId}`);
        }
        return removed;
    }
    /**
     * Get all registered regions
     */
    getRegions() {
        return Array.from(this.regions.values());
    }
    /**
     * Start scanning for beacons
     */
    async startScanning(options) {
        if (this.isScanning) {
            console.log('Already scanning for beacons');
            return;
        }
        if (!this.startTime) {
            throw new Error('Beacon manager not initialized. Call initialize() first.');
        }
        const interval = options?.interval || this.config.scanInterval || 1000;
        this.isScanning = true;
        console.log('Started scanning for beacons');
        // Simulate beacon scanning
        this.scanInterval = window.setInterval(async () => {
            await this.performScan(options);
        }, interval);
        // If duration is specified, stop after that time
        if (options?.duration) {
            setTimeout(() => {
                this.stopScanning();
            }, options.duration);
        }
    }
    /**
     * Stop scanning for beacons
     */
    stopScanning() {
        if (!this.isScanning) {
            return;
        }
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
        this.isScanning = false;
        console.log('Stopped scanning for beacons');
    }
    /**
     * Get all discovered beacons
     */
    getDiscoveredBeacons() {
        return Array.from(this.discoveredBeacons.values());
    }
    /**
     * Get beacons in a specific region
     */
    getBeaconsInRegion(regionId) {
        const region = this.regions.get(regionId);
        if (!region) {
            return [];
        }
        return this.getDiscoveredBeacons().filter((beacon) => beacon.uuid === region.uuid &&
            (region.major === undefined || beacon.major === region.major) &&
            (region.minor === undefined || beacon.minor === region.minor));
    }
    /**
     * Add event listener
     */
    addEventListener(eventType, listener) {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, []);
        }
        this.eventListeners.get(eventType).push(listener);
    }
    /**
     * Remove event listener
     */
    removeEventListener(eventType, listener) {
        const listeners = this.eventListeners.get(eventType);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
    /**
     * Get beacon analytics
     */
    getAnalytics() {
        if (this.startTime) {
            this.analytics.uptime = Date.now() - this.startTime.getTime();
        }
        return { ...this.analytics };
    }
    /**
     * Clear discovered beacons
     */
    clearDiscoveredBeacons() {
        this.discoveredBeacons.clear();
        this.analytics.totalBeacons = 0;
        console.log('Cleared all discovered beacons');
    }
    /**
     * Estimate distance from RSSI
     */
    estimateDistance(rssi, txPower = -59) {
        if (rssi === 0) {
            return -1;
        }
        const ratio = (txPower - rssi) / 20.0;
        return Math.pow(10, ratio);
    }
    /**
     * Get proximity category from distance
     */
    getProximity(distance) {
        if (distance < 0)
            return 'unknown';
        if (distance < 0.5)
            return 'immediate';
        if (distance < 4.0)
            return 'near';
        return 'far';
    }
    /**
     * Check if the manager is currently scanning
     */
    isCurrentlyScanning() {
        return this.isScanning;
    }
    /**
     * Perform a single scan cycle
     */
    async performScan(options) {
        try {
            // Simulate discovering beacons
            const simulatedBeacons = this.generateSimulatedBeacons();
            // Apply region filtering if specified
            const filteredBeacons = options?.filterByRegions
                ? simulatedBeacons.filter((beacon) => options.filterByRegions.some((region) => beacon.uuid === region.uuid &&
                    (region.major === undefined || beacon.major === region.major) &&
                    (region.minor === undefined || beacon.minor === region.minor)))
                : simulatedBeacons;
            for (const beacon of filteredBeacons) {
                const existingBeacon = this.discoveredBeacons.get(beacon.id);
                if (!existingBeacon) {
                    // New beacon discovered
                    this.discoveredBeacons.set(beacon.id, beacon);
                    this.analytics.totalBeacons = this.discoveredBeacons.size;
                    // Check if beacon matches any monitored regions
                    const matchingRegion = this.findMatchingRegion(beacon);
                    if (matchingRegion) {
                        this.emitEvent({
                            type: 'enter',
                            region: matchingRegion,
                            beacons: [beacon],
                            timestamp: new Date(),
                        });
                        this.analytics.events.enters++;
                    }
                }
                else {
                    // Update existing beacon
                    existingBeacon.rssi = beacon.rssi;
                    existingBeacon.distance = beacon.distance;
                    existingBeacon.proximity = beacon.proximity;
                    existingBeacon.lastSeen = new Date();
                }
                // Update analytics
                if (beacon.rssi > this.analytics.strongestSignal) {
                    this.analytics.strongestSignal = beacon.rssi;
                }
            }
            // Emit range events for all discovered beacons
            for (const region of this.regions.values()) {
                const beaconsInRegion = this.getBeaconsInRegion(region.id);
                if (beaconsInRegion.length > 0) {
                    this.emitEvent({
                        type: 'range',
                        region,
                        beacons: beaconsInRegion,
                        timestamp: new Date(),
                    });
                    this.analytics.events.ranges++;
                }
            }
            // Update average RSSI
            const allBeacons = this.getDiscoveredBeacons();
            if (allBeacons.length > 0) {
                const totalRssi = allBeacons.reduce((sum, beacon) => sum + beacon.rssi, 0);
                this.analytics.averageRssi = totalRssi / allBeacons.length;
            }
            // Clean up old beacons (not seen for 30 seconds)
            this.cleanupOldBeacons();
        }
        catch (error) {
            console.error('Error during beacon scan:', error);
        }
    }
    /**
     * Generate simulated beacon data for testing
     */
    generateSimulatedBeacons() {
        const beacons = [];
        // Generate 1-3 random beacons
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
            const rssi = Math.floor(Math.random() * 60) - 90; // -90 to -30 dBm
            const distance = this.estimateDistance(rssi);
            const proximity = this.getProximity(distance);
            const beacon = {
                id: `beacon_${i}_${Date.now()}`,
                uuid: 'B0702880-A295-A8AB-F734-031A98A512DE',
                major: Math.floor(Math.random() * 1000) + 1,
                minor: Math.floor(Math.random() * 1000) + 1,
                rssi,
                distance,
                proximity,
                lastSeen: new Date(),
                name: `Beacon ${i + 1}`,
                manufacturer: 'Estimote',
            };
            beacons.push(beacon);
        }
        return beacons;
    }
    /**
     * Find matching region for a beacon
     */
    findMatchingRegion(beacon) {
        for (const region of this.regions.values()) {
            if (region.uuid === beacon.uuid &&
                (region.major === undefined || region.major === beacon.major) &&
                (region.minor === undefined || region.minor === beacon.minor)) {
                return region;
            }
        }
        return null;
    }
    /**
     * Emit event to listeners
     */
    emitEvent(event) {
        const listeners = this.eventListeners.get(event.type);
        if (listeners) {
            listeners.forEach((listener) => {
                try {
                    listener(event);
                }
                catch (error) {
                    console.error('Error in beacon event listener:', error);
                }
            });
        }
    }
    /**
     * Clean up beacons not seen recently
     */
    cleanupOldBeacons() {
        const cutoffTime = Date.now() - 30000; // 30 seconds
        const toRemove = [];
        for (const [id, beacon] of this.discoveredBeacons.entries()) {
            if (beacon.lastSeen.getTime() < cutoffTime) {
                toRemove.push(id);
                // Emit exit event for beacons in monitored regions
                const matchingRegion = this.findMatchingRegion(beacon);
                if (matchingRegion) {
                    this.emitEvent({
                        type: 'exit',
                        region: matchingRegion,
                        beacons: [beacon],
                        timestamp: new Date(),
                    });
                    this.analytics.events.exits++;
                }
            }
        }
        toRemove.forEach((id) => this.discoveredBeacons.delete(id));
        if (toRemove.length > 0) {
            this.analytics.totalBeacons = this.discoveredBeacons.size;
            console.log(`Cleaned up ${toRemove.length} old beacons`);
        }
    }
    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    /**
     * Get client configuration
     */
    getConfig() {
        return { ...this.config };
    }
}
// Export default instance creation helper
export function createBeaconManager(config) {
    return new BeaconManager(config);
}
//# sourceMappingURL=index.js.map