/**
 * @omx-sdk/geotrigger
 * Geotrigger module for creating and managing location-based triggers
 */

import { isClientInitialized, omxClient } from '@omx-sdk/core';

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
  radius: number; // meters
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

// New interfaces for the updated API
export interface CreateGeoTriggerInput {
  name: string;
  coordinates: [number, number]; // [lng, lat]
  radius: number;
  event: {
    type: 'webhook' | 'email';
    payload: any;
  };
}

export interface GeoTriggerRecord {
  id: string;
  name: string;
  coordinates: string; // PostGIS POINT format
  radius: number;
  event_type: string;
  event_payload: any;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
}

export class GeoTrigger {
  private regions: Map<string, GeofenceRegion> = new Map();
  private isWatching = false;
  private watchId: number | null = null;

  constructor(_config?: GeotriggerConfig) {
    // Config reserved for future use
  }

  /**
   * Create a new geotrigger
   */
  async create(input: CreateGeoTriggerInput): Promise<GeoTriggerRecord> {
    try {
      if (!isClientInitialized()) {
        throw new Error(
          'OMX client not initialized. Call initClient(jwt) first.'
        );
      }

      const { name, coordinates, radius, event } = input;

      // Convert coordinates to PostGIS POINT format
      const point = `POINT(${coordinates[0]} ${coordinates[1]})`;

      console.log('🌍 Creating geotrigger:', {
        name,
        coordinates,
        radius,
        eventType: event.type,
      });

      const { data, error } = await omxClient
        .from('geotriggers')
        .insert({
          name,
          coordinates: point,
          radius,
          event_type: event.type,
          event_payload: event.payload,
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to create geotrigger:', error);
        throw new Error(`Failed to create geotrigger: ${error.message}`);
      }

      console.log('✅ Geotrigger created successfully:', data);
      return data as unknown as GeoTriggerRecord;
    } catch (error: any) {
      console.error('❌ Error creating geotrigger:', error);
      throw error;
    }
  }

  /**
   * List all geotriggers
   */
  async list(): Promise<GeoTriggerRecord[]> {
    try {
      console.log('📋 Fetching all geotriggers...');

      const { data, error } = await omxClient
        .from('geotriggers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch geotriggers:', error);
        throw new Error(`Failed to fetch geotriggers: ${error.message}`);
      }

      console.log(`✅ Found ${data?.length || 0} geotriggers`);
      return (data as unknown as GeoTriggerRecord[]) || [];
    } catch (error: any) {
      console.error('❌ Error fetching geotriggers:', error);
      throw error;
    }
  }

  /**
   * Delete a geotrigger
   */
  async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting geotrigger:', id);

      const { error } = await omxClient
        .from('geotriggers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Failed to delete geotrigger:', error);
        throw new Error(`Failed to delete geotrigger: ${error.message}`);
      }

      console.log('✅ Geotrigger deleted successfully');
    } catch (error: any) {
      console.error('❌ Error deleting geotrigger:', error);
      throw error;
    }
  }

  /**
   * Get a specific geotrigger by ID
   */
  async get(id: string): Promise<GeoTriggerRecord | null> {
    try {
      console.log('🔍 Fetching geotrigger:', id);

      const { data, error } = await omxClient
        .from('geotriggers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('❌ Failed to fetch geotrigger:', error);
        throw new Error(`Failed to fetch geotrigger: ${error.message}`);
      }

      console.log('✅ Geotrigger found:', data);
      return data as unknown as GeoTriggerRecord;
    } catch (error: any) {
      console.error('❌ Error fetching geotrigger:', error);
      throw error;
    }
  }

  /**
   * Update a geotrigger
   */
  async update(
    id: string,
    updates: Partial<CreateGeoTriggerInput>
  ): Promise<GeoTriggerRecord> {
    try {
      console.log('📝 Updating geotrigger:', id, updates);

      const updateData: any = {};

      if (updates.name) updateData.name = updates.name;
      if (updates.radius) updateData.radius = updates.radius;
      if (updates.coordinates) {
        updateData.coordinates = `POINT(${updates.coordinates[0]} ${updates.coordinates[1]})`;
      }
      if (updates.event) {
        updateData.event_type = updates.event.type;
        updateData.event_payload = updates.event.payload;
      }

      const { data, error } = await omxClient
        .from('geotriggers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to update geotrigger:', error);
        throw new Error(`Failed to update geotrigger: ${error.message}`);
      }

      console.log('✅ Geotrigger updated successfully:', data);
      return data as unknown as GeoTriggerRecord;
    } catch (error: any) {
      console.error('❌ Error updating geotrigger:', error);
      throw error;
    }
  }

  // Legacy browser-based monitoring methods (for backward compatibility)

  /**
   * Add a geofence region to monitor
   */
  addRegion(region: GeofenceRegion): void {
    this.regions.set(region.id, region);
    console.log(`Added geofence region: ${region.id}`);
  }

  /**
   * Remove a geofence region
   */
  removeRegion(regionId: string): boolean {
    const removed = this.regions.delete(regionId);
    if (removed) {
      console.log(`Removed geofence region: ${regionId}`);
    }
    return removed;
  }

  /**
   * Get all registered regions
   */
  getRegions(): GeofenceRegion[] {
    return Array.from(this.regions.values());
  }

  /**
   * Start monitoring geofence regions
   */
  startMonitoring(
    onTrigger: (event: TriggerEvent) => void,
    options?: GeotriggerOptions
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      if (this.isWatching) {
        resolve();
        return;
      }

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
          console.error('Geolocation error:', error);
          reject(error);
        },
        watchOptions
      );

      this.isWatching = true;
      resolve();
    });
  }

  /**
   * Stop monitoring geofence regions
   */
  stopMonitoring(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isWatching = false;
    console.log('Stopped geofence monitoring');
  }

  /**
   * Get current location
   */
  getCurrentLocation(options?: GeotriggerOptions): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
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

  /**
   * Calculate distance between two locations using Haversine formula
   */
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

  /**
   * Check if current location triggers any geofence regions
   */
  private checkRegions(
    currentLocation: Location,
    onTrigger: (event: TriggerEvent) => void
  ): void {
    this.regions.forEach((region) => {
      const distance = this.calculateDistance(currentLocation, region.center);
      const isInside = distance <= region.radius;

      // For simplicity, we'll trigger on every position update when inside
      // In a real implementation, you'd want to track entry/exit states
      if (isInside) {
        const event: TriggerEvent = {
          regionId: region.id,
          type: 'enter',
          location: currentLocation,
          timestamp: new Date(),
        };
        onTrigger(event);
      }
    });
  }

  /**
   * Check if the service is currently monitoring
   */
  isMonitoring(): boolean {
    return this.isWatching;
  }
}

// Export default instance creation helper
export function createGeotrigger(config?: GeotriggerConfig): GeoTrigger {
  return new GeoTrigger(config);
}
