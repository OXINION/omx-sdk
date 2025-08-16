/**
 * @omx-sdk/geotrigger
 * Geotrigger module for creating and managing location-based triggers
 */
import type { GeofenceRegion, GeotriggerData, GeotriggerFilters, GeotriggerStats, GeotriggerUpdateData, Location, TriggerEvent } from "./types.js";
export interface GeotriggerOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}
export declare class GeotriggerClient {
    private clientId;
    private secretKey;
    private teamId;
    private authToken;
    private regions;
    private isWatching;
    private watchId;
    constructor(config: {
        clientId: string;
        secretKey: string;
        teamId?: string;
    });
    private getAuthToken;
    private loadTeamIdFromApiKeys;
    private ensureDefaultWorkflow;
    private makeRequest;
    createGeotrigger(data: GeotriggerData): Promise<GeotriggerData>;
    listGeotriggers(filters?: GeotriggerFilters): Promise<GeotriggerData[]>;
    deleteGeotrigger(id: string): Promise<void>;
    getGeotrigger(id: string): Promise<GeotriggerData>;
    updateGeotrigger(id: string, updates: GeotriggerUpdateData): Promise<GeotriggerData>;
    updateGeotriggerStatus(id: string, status: "active" | "inactive"): Promise<void>;
    duplicateGeotrigger(id: string, newName?: string): Promise<GeotriggerData>;
    getGeotriggerStats(): Promise<GeotriggerStats>;
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
    authenticate(): Promise<string>;
}
export declare function createGeotriggerClient(config: {
    clientId: string;
    secretKey: string;
    teamId?: string;
}): GeotriggerClient;
export declare function createGeotrigger(config: {
    clientId: string;
    secretKey: string;
    teamId?: string;
}): GeotriggerClient;
export * from "./types";
//# sourceMappingURL=index.d.ts.map