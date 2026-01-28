/**
 * @omx-sdk/geotrigger
 * Geotrigger module for creating and managing location-based triggers
 */

import { createOmxClient } from "@omx-sdk/core";
import type {
  GeofenceRegion,
  GeotriggerData,
  GeotriggerFilters,
  GeotriggerStats,
  GeotriggerUpdateData,
  Location,
  TriggerEvent,
} from "./types.js";

// UUID v4 generation function
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface GeotriggerOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export class GeotriggerClient {
  private omx: ReturnType<typeof createOmxClient>;
  private teamId: string | null = null;
  private regions: Map<string, GeofenceRegion> = new Map();
  private isWatching = false;
  private watchId: number | null = null;

  constructor(omx: ReturnType<typeof createOmxClient>) {
    this.omx = omx;
  }

  private async getTeamId(): Promise<string> {
    if (this.teamId) return this.teamId;

    const token = await this.omx.core.getToken();
    try {
      const parts = token.split(".");
      if (parts.length < 2 || !parts[1]) throw new Error("Invalid token format");
      const payload = JSON.parse(atob(parts[1]));
      if (payload.team_id) {
        this.teamId = payload.team_id;
        return this.teamId!;
      }
    } catch (e) {
      // Ignore decode errors
    }

    // Fallback: look up from api_keys
    await this.loadTeamIdFromApiKeys();
    return this.teamId || generateUUID();
  }

  private async loadTeamIdFromApiKeys(): Promise<void> {
    try {
      const url = "database-access?table=api_keys&schema=business";
      const result = await this.omx.request(url, {
        method: "POST",
        body: {
          filters: { client_id: this.omx.config.clientId },
        },
      });

      if (result && result.length > 0) {
        this.teamId = result[0].team_id;
      }
    } catch (error) {
      console.warn("Failed to load team_id from API keys:", error);
    }
  }

  private async ensureDefaultWorkflow(): Promise<string> {
    const teamId = await this.getTeamId();

    // First, try to find existing default workflow for geotriggers
    try {
      const result = await this.omx.request(
        "database-access?table=workflows&schema=business",
        {
          method: "POST",
          body: {
            filters: {
              team_id: teamId,
              name: "Default Geotrigger Workflow",
            },
          },
        }
      );

      if (result && result.length > 0) {
        return result[0].id;
      }
    } catch (e) {
      // Ignore errors
    }

    // Create default workflow if it doesn't exist
    const createResult = await this.omx.request(
      "database-access?table=workflows&schema=business",
      {
        method: "POST",
        body: {
          action: "create",
          data: {
            team_id: teamId,
            name: "Default Geotrigger Workflow",
            description: "Automatically created workflow for geotrigger nodes",
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
      }
    );

    return createResult.id || createResult[0]?.id;
  }

  async createGeotrigger(data: GeotriggerData): Promise<GeotriggerData> {
    const teamId = await this.getTeamId();
    const workflowId = data.workflow_id || (await this.ensureDefaultWorkflow());

    return this.omx.request("database-access?table=workflow_nodes&schema=omx", {
      method: "POST",
      body: {
        action: "create",
        data: {
          workflow_id: workflowId,
          type: "geotrigger",
          config: {
            name: data.name,
            description: data.description,
            location: data.location,
            coordinates: data.coordinates,
            radius: data.radius,
            event_type: data.event_type,
            event_payload: data.event_payload,
            status: data.status || "active",
            team_id: teamId,
          },
          position: data.position || { x: 0, y: 0 },
          node_key: data.node_key || `geotrigger-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    });
  }

  async listGeotriggers(
    filters: GeotriggerFilters = {}
  ): Promise<GeotriggerData[]> {
    return this.omx.request("database-access?table=workflow_nodes&schema=omx", {
      method: "POST",
      body: {
        filters: {
          type: "geotrigger",
          ...filters,
        },
      },
    });
  }

  async deleteGeotrigger(id: string): Promise<void> {
    await this.omx.request("database-access?table=workflow_nodes&schema=omx", {
      method: "POST",
      body: {
        action: "delete",
        filters: {
          id: id,
          type: "geotrigger",
        },
      },
    });
  }

  async getGeotrigger(id: string): Promise<GeotriggerData> {
    const result = await this.omx.request(
      "database-access?table=workflow_nodes&schema=omx",
      {
        method: "POST",
        body: {
          filters: {
            id: id,
            type: "geotrigger",
          },
        },
      }
    );
    return Array.isArray(result) ? result[0] : result;
  }

  async updateGeotrigger(
    id: string,
    updates: GeotriggerUpdateData
  ): Promise<GeotriggerData> {
    const teamId = await this.getTeamId();
    return this.omx.request("database-access?table=workflow_nodes&schema=omx", {
      method: "POST",
      body: {
        action: "update",
        filters: {
          id: id,
          type: "geotrigger",
        },
        data: {
          config: {
            ...updates,
            team_id: teamId,
          },
          updated_at: new Date().toISOString(),
        },
      },
    });
  }

  async updateGeotriggerStatus(
    id: string,
    status: "active" | "inactive"
  ): Promise<void> {
    await this.updateGeotrigger(id, { config: { status } });
  }

  async duplicateGeotrigger(
    id: string,
    newName?: string
  ): Promise<GeotriggerData> {
    const original = await this.getGeotrigger(id);
    const teamId = await this.getTeamId();
    const duplicateData: GeotriggerData = {
      team_id: teamId,
      name: newName || `${original.name} (Copy)`,
      status: "inactive",
    };

    // Only add properties that are defined
    if (original.description !== undefined) duplicateData.description = original.description;
    if (original.config?.location) duplicateData.location = original.config.location;
    if (original.config?.coordinates) duplicateData.coordinates = original.config.coordinates;
    if (original.config?.radius) duplicateData.radius = original.config.radius;
    if (original.config?.event_type) duplicateData.event_type = original.config.event_type;
    if (original.config?.event_payload) duplicateData.event_payload = original.config.event_payload;

    return this.createGeotrigger(duplicateData);
  }

  async getGeotriggerStats(): Promise<GeotriggerStats> {
    const geotriggers = await this.listGeotriggers();
    const teamId = await this.getTeamId();
    return {
      totalGeotriggers: geotriggers.length,
      activeGeotriggers: geotriggers.filter(
        (g: any) => g.config?.status === "active"
      ).length,
      inactiveGeotriggers: geotriggers.filter(
        (g: any) => g.config?.status === "inactive"
      ).length,
      teamId: teamId,
    };
  }

  // Legacy browser-based monitoring methods

  addRegion(region: GeofenceRegion): void {
    this.regions.set(region.id, region);
    console.log(`Added geofence region: ${region.id}`);
  }

  removeRegion(regionId: string): boolean {
    const removed = this.regions.delete(regionId);
    if (removed) {
      console.log(`Removed geofence region: ${regionId}`);
    }
    return removed;
  }

  getRegions(): GeofenceRegion[] {
    return Array.from(this.regions.values());
  }

  async startMonitoring(
    onTrigger: (event: TriggerEvent) => void,
    options?: GeotriggerOptions
  ): Promise<void> {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser");
    }

    if (this.isWatching) return;

    const watchOptions: PositionOptions = {
      enableHighAccuracy: options?.enableHighAccuracy ?? true,
      timeout: options?.timeout ?? 10000,
      maximumAge: options?.maximumAge ?? 60000,
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentLocation: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        this.checkRegions(currentLocation, onTrigger);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      watchOptions
    );

    this.isWatching = true;
  }

  stopMonitoring(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isWatching = false;
    console.log("Stopped geofence monitoring");
  }

  async getCurrentLocation(options?: GeotriggerOptions): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      const locationOptions: PositionOptions = {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: options?.timeout ?? 10000,
        maximumAge: options?.maximumAge ?? 60000,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(error);
        },
        locationOptions
      );
    });
  }

  private calculateDistance(loc1: Location, loc2: Location): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (loc1.latitude * Math.PI) / 180;
    const φ2 = (loc2.latitude * Math.PI) / 180;
    const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private checkRegions(
    currentLocation: Location,
    onTrigger: (event: TriggerEvent) => void
  ): void {
    this.regions.forEach((region) => {
      const distance = this.calculateDistance(currentLocation, region.center);
      const isInside = distance <= region.radius;

      if (isInside) {
        const event: TriggerEvent = {
          regionId: region.id,
          type: "enter",
          location: currentLocation,
          timestamp: new Date(),
        };
        onTrigger(event);
      }
    });
  }

  isMonitoring(): boolean {
    return this.isWatching;
  }
}

/**
 * Attacher function: Attach Geotrigger module to an existing OmxClient
 */
export function geoTrigger(omx: ReturnType<typeof createOmxClient>): GeotriggerClient {
  return new GeotriggerClient(omx);
}

export * from "./types.js";
