/**
 * @omx-sdk/geotrigger
 * Geotrigger module for creating and managing location-based triggers
 */
import { createOmxClient } from "@omx-sdk/core";
import type { GeofenceRegion, GeotriggerData, GeotriggerFilters, GeotriggerStats, GeotriggerUpdateData, Location, TriggerEvent } from "./types.js";
export interface GeotriggerOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}
export declare class GeotriggerClient {
    private omx;
    private teamId;
    private regions;
    private isWatching;
    private watchId;
    constructor(omx: ReturnType<typeof createOmxClient>);
    private getTeamId;
    private loadTeamIdFromApiKeys;
    private ensureDefaultWorkflow;
    createGeotrigger(data: GeotriggerData): Promise<GeotriggerData>;
    listGeotriggers(filters?: GeotriggerFilters): Promise<GeotriggerData[]>;
    deleteGeotrigger(id: string): Promise<void>;
    getGeotrigger(id: string): Promise<GeotriggerData>;
    updateGeotrigger(id: string, updates: GeotriggerUpdateData): Promise<GeotriggerData>;
    updateGeotriggerStatus(id: string, status: "active" | "inactive"): Promise<void>;
    duplicateGeotrigger(id: string, newName?: string): Promise<GeotriggerData>;
    getGeotriggerStats(): Promise<GeotriggerStats>;
    addRegion(region: GeofenceRegion): void;
    removeRegion(regionId: string): boolean;
    getRegions(): GeofenceRegion[];
    startMonitoring(onTrigger: (event: TriggerEvent) => void, options?: GeotriggerOptions): Promise<void>;
    stopMonitoring(): void;
    getCurrentLocation(options?: GeotriggerOptions): Promise<Location>;
    private calculateDistance;
    private checkRegions;
    isMonitoring(): boolean;
}
/**
 * Attacher function: Attach Geotrigger module to an existing OmxClient
 */
export declare function geoTrigger(omx: ReturnType<typeof createOmxClient>): GeotriggerClient;
export * from "./types.js";
//# sourceMappingURL=index.d.ts.map