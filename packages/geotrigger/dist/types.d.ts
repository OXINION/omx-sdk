export interface GeotriggerData {
    id?: string;
    workflow_id?: string;
    type?: "geotrigger";
    position?: {
        x: number;
        y: number;
    };
    node_key?: string;
    config?: {
        name?: string;
        description?: string;
        team_id?: string;
        location?: {
            latitude: number;
            longitude: number;
        };
        coordinates?: string;
        radius?: number;
        event_type?: "webhook" | "email" | "campaign";
        event_payload?: any;
        status?: "active" | "inactive";
    };
    created_at?: string;
    updated_at?: string;
    team_id?: string;
    name?: string;
    description?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    coordinates?: string;
    radius?: number;
    event_type?: "webhook" | "email" | "campaign";
    event_payload?: any;
    status?: "active" | "inactive";
}
export interface GeotriggerUpdateData extends Partial<GeotriggerData> {
}
export interface GeotriggerFilters {
    status?: string;
    event_type?: string;
    search?: string;
}
export interface GeotriggerStats {
    totalGeotriggers: number;
    activeGeotriggers: number;
    inactiveGeotriggers: number;
    teamId?: string;
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
    type: "enter" | "exit";
    location: Location;
    timestamp: Date;
}
//# sourceMappingURL=types.d.ts.map