/**
 * @omx-sdk/beacon
 * Beacon management functionality for omx-sdk
 */
import { createOmxClient } from "@omx-sdk/core";
export interface BeaconDevice {
    id: string;
    uuid: string;
    major: number;
    minor: number;
    rssi: number;
    distance?: number;
    proximity: "immediate" | "near" | "far" | "unknown";
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
    type: "enter" | "exit" | "range";
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
    private omx;
    private regions;
    private discoveredBeacons;
    private isScanning;
    private scanInterval;
    private eventListeners;
    private analytics;
    private startTime;
    constructor(omx: ReturnType<typeof createOmxClient>);
    initialize(): Promise<void>;
    addRegion(region: BeaconRegion): void;
    removeRegion(regionId: string): boolean;
    getRegions(): BeaconRegion[];
    startScanning(options?: ScanOptions): Promise<void>;
    stopScanning(): void;
    getDiscoveredBeacons(): BeaconDevice[];
    getBeaconsInRegion(regionId: string): BeaconDevice[];
    addEventListener(eventType: "enter" | "exit" | "range", listener: (event: BeaconEvent) => void): void;
    removeEventListener(eventType: "enter" | "exit" | "range", listener: (event: BeaconEvent) => void): void;
    getAnalytics(): BeaconAnalytics;
    private performScan;
    private generateSimulatedBeacons;
    private findMatchingRegion;
    private emitEvent;
    private cleanupOldBeacons;
    isCurrentlyScanning(): boolean;
}
/**
 * Attacher function: Attach Beacon module to an existing OmxClient
 */
export declare function beacon(omx: ReturnType<typeof createOmxClient>): BeaconManager;
//# sourceMappingURL=index.d.ts.map