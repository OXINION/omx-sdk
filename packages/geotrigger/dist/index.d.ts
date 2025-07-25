/**
 * @omx-sdk/geotrigger
 * Geotrigger module for creating and managing location-based triggers
 */
export interface GeotriggerConfig {
    clientId: string;
    secretKey: string;
    baseUrl?: string;
    timeout?: number;
}
export interface Location {
    latitude: number;
    longitude: number;
    accuracy?: number;
}
export interface GeofenceRegion {
    id: string;
    center: Location;
    radius: number;
    name?: string;
}
export interface TriggerEvent {
    regionId: string;
    type: 'enter' | 'exit';
    location: Location;
    timestamp: Date;
}
export interface GeotriggerOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}
export interface CreateGeoTriggerInput {
    name: string;
    coordinates: [number, number];
    radius: number;
    event: {
        type: 'webhook' | 'email';
        payload: any;
    };
}
export interface GeoTriggerRecord {
    id: string;
    name: string;
    coordinates: string;
    radius: number;
    event_type: string;
    event_payload: any;
    created_at: string;
    updated_at: string;
    status: 'active' | 'inactive';
}
export declare class GeoTrigger {
    private regions;
    private isWatching;
    private watchId;
    constructor(_config?: GeotriggerConfig);
    /**
     * Create a new geotrigger
     */
    create(input: CreateGeoTriggerInput): Promise<GeoTriggerRecord>;
    /**
     * List all geotriggers
     */
    list(): Promise<GeoTriggerRecord[]>;
    /**
     * Delete a geotrigger
     */
    delete(id: string): Promise<void>;
    /**
     * Get a specific geotrigger by ID
     */
    get(id: string): Promise<GeoTriggerRecord | null>;
    /**
     * Update a geotrigger
     */
    update(id: string, updates: Partial<CreateGeoTriggerInput>): Promise<GeoTriggerRecord>;
    /**
     * Add a geofence region to monitor
     */
    addRegion(region: GeofenceRegion): void;
    /**
     * Remove a geofence region
     */
    removeRegion(regionId: string): boolean;
    /**
     * Get all registered regions
     */
    getRegions(): GeofenceRegion[];
    /**
     * Start monitoring geofence regions
     */
    startMonitoring(onTrigger: (event: TriggerEvent) => void, options?: GeotriggerOptions): Promise<void>;
    /**
     * Stop monitoring geofence regions
     */
    stopMonitoring(): void;
    /**
     * Get current location
     */
    getCurrentLocation(options?: GeotriggerOptions): Promise<Location>;
    /**
     * Calculate distance between two locations using Haversine formula
     */
    private calculateDistance;
    /**
     * Check if current location triggers any geofence regions
     */
    private checkRegions;
    /**
     * Check if the service is currently monitoring
     */
    isMonitoring(): boolean;
}
export declare function createGeotrigger(config?: GeotriggerConfig): GeoTrigger;
//# sourceMappingURL=index.d.ts.map