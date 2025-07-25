export interface BeaconConfig {
    clientId: string;
    secretKey: string;
    baseUrl?: string;
    timeout?: number;
    scanInterval?: number;
}
export interface BeaconDevice {
    id: string;
    uuid: string;
    major: number;
    minor: number;
    rssi: number;
    distance?: number;
    proximity: 'immediate' | 'near' | 'far' | 'unknown';
    lastSeen: Date;
    name?: string;
    manufacturer?: string;
}
export interface BeaconRegion {
    id: string;
    uuid: string;
    major?: number;
    minor?: number;
    name?: string;
}
export interface BeaconEvent {
    type: 'enter' | 'exit' | 'range';
    region: BeaconRegion;
    beacons?: BeaconDevice[];
    timestamp: Date;
}
export interface ScanOptions {
    duration?: number;
    interval?: number;
    allowDuplicates?: boolean;
    filterByRegions?: BeaconRegion[];
}
export interface BeaconAnalytics {
    totalBeacons: number;
    regionsMonitored: number;
    events: {
        enters: number;
        exits: number;
        ranges: number;
    };
    averageRssi: number;
    strongestSignal: number;
    uptime: number;
}
export declare class BeaconManager {
    private config;
    private regions;
    private discoveredBeacons;
    private isScanning;
    private scanInterval;
    private eventListeners;
    private analytics;
    private startTime;
    constructor(config: BeaconConfig);
    /**
     * Initialize beacon scanning (request permissions, etc.)
     */
    initialize(): Promise<void>;
    /**
     * Add a beacon region to monitor
     */
    addRegion(region: BeaconRegion): void;
    /**
     * Remove a beacon region
     */
    removeRegion(regionId: string): boolean;
    /**
     * Get all registered regions
     */
    getRegions(): BeaconRegion[];
    /**
     * Start scanning for beacons
     */
    startScanning(options?: ScanOptions): Promise<void>;
    /**
     * Stop scanning for beacons
     */
    stopScanning(): void;
    /**
     * Get all discovered beacons
     */
    getDiscoveredBeacons(): BeaconDevice[];
    /**
     * Get beacons in a specific region
     */
    getBeaconsInRegion(regionId: string): BeaconDevice[];
    /**
     * Add event listener
     */
    addEventListener(eventType: 'enter' | 'exit' | 'range', listener: (event: BeaconEvent) => void): void;
    /**
     * Remove event listener
     */
    removeEventListener(eventType: 'enter' | 'exit' | 'range', listener: (event: BeaconEvent) => void): void;
    /**
     * Get beacon analytics
     */
    getAnalytics(): BeaconAnalytics;
    /**
     * Clear discovered beacons
     */
    clearDiscoveredBeacons(): void;
    /**
     * Estimate distance from RSSI
     */
    estimateDistance(rssi: number, txPower?: number): number;
    /**
     * Get proximity category from distance
     */
    getProximity(distance: number): 'immediate' | 'near' | 'far' | 'unknown';
    /**
     * Check if the manager is currently scanning
     */
    isCurrentlyScanning(): boolean;
    /**
     * Perform a single scan cycle
     */
    private performScan;
    /**
     * Generate simulated beacon data for testing
     */
    private generateSimulatedBeacons;
    /**
     * Find matching region for a beacon
     */
    private findMatchingRegion;
    /**
     * Emit event to listeners
     */
    private emitEvent;
    /**
     * Clean up beacons not seen recently
     */
    private cleanupOldBeacons;
    /**
     * Sleep utility
     */
    private sleep;
    /**
     * Get client configuration
     */
    getConfig(): Readonly<BeaconConfig>;
}
export declare function createBeaconManager(config: BeaconConfig): BeaconManager;
//# sourceMappingURL=index.d.ts.map