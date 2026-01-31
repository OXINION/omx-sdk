import { OMXClient } from '@omx-sdk/core';
export interface BeaconConfig {
    uuid: string;
    major: number;
    minor: number;
    name?: string;
    description?: string;
    location?: {
        lat: number;
        lng: number;
    };
}
export interface Beacon {
    id: string;
    uuid: string;
    major: number;
    minor: number;
    name?: string;
    description?: string;
    location?: {
        lat: number;
        lng: number;
    };
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}
export interface BeaconTrigger {
    id: string;
    beaconId: string;
    action: 'enter' | 'exit';
    notification?: {
        title: string;
        body: string;
    };
    webhook?: string;
}
export interface BeaconTriggerConfig {
    beaconId: string;
    action: 'enter' | 'exit';
    notification?: {
        title: string;
        body: string;
    };
    webhook?: string;
}
export interface BeaconDetection {
    beaconId: string;
    userId: string;
    action: 'enter' | 'exit';
    timestamp: string;
    rssi?: number;
}
export declare class BeaconManager {
    private client;
    constructor(client: OMXClient);
    create(config: BeaconConfig): Promise<Beacon>;
    list(): Promise<Beacon[]>;
    get(id: string): Promise<Beacon>;
    update(id: string, config: Partial<BeaconConfig>): Promise<Beacon>;
    delete(id: string): Promise<void>;
    activate(id: string): Promise<Beacon>;
    deactivate(id: string): Promise<Beacon>;
    createTrigger(config: BeaconTriggerConfig): Promise<BeaconTrigger>;
    getTriggers(beaconId: string): Promise<BeaconTrigger[]>;
    deleteTrigger(triggerId: string): Promise<void>;
    reportDetection(detection: Omit<BeaconDetection, 'timestamp'>): Promise<void>;
    getDetectionHistory(beaconId: string, startDate?: string, endDate?: string): Promise<BeaconDetection[]>;
}
//# sourceMappingURL=index.d.ts.map