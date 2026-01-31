import { OMXClient } from '@omx-sdk/core';
export interface Location {
    lat: number;
    lng: number;
}
export interface Notification {
    title: string;
    body: string;
}
export interface GeoTriggerConfig {
    name: string;
    location: Location;
    radius: number;
    onEnter?: {
        notification?: Notification;
    };
}
export interface GeoTrigger {
    id: string;
    name: string;
    location: Location;
    radius: number;
    createdAt: string;
}
export declare class GeoTriggerManager {
    private client;
    constructor(client: OMXClient);
    create(config: GeoTriggerConfig): Promise<GeoTrigger>;
    list(): Promise<GeoTrigger[]>;
    get(id: string): Promise<GeoTrigger>;
    update(id: string, config: Partial<GeoTriggerConfig>): Promise<GeoTrigger>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map