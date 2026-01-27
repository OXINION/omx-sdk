import { OMXClient } from '@omx-sdk/core'; // Ensure @omx-sdk/core is built and exported via its package entrypoint

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

export class GeoTriggerManager {
  constructor(private client: OMXClient) {}

  async create(config: GeoTriggerConfig): Promise<GeoTrigger> {
    return this.client.makeRequest<GeoTrigger>('/geotriggers', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async list(): Promise<GeoTrigger[]> {
    return this.client.makeRequest<GeoTrigger[]>('/geotriggers');
  }

  async get(id: string): Promise<GeoTrigger> {
    return this.client.makeRequest<GeoTrigger>(`/geotriggers/${id}`);
  }

  async update(id: string, config: Partial<GeoTriggerConfig>): Promise<GeoTrigger> {
    return this.client.makeRequest<GeoTrigger>(`/geotriggers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.makeRequest<void>(`/geotriggers/${id}`, {
      method: 'DELETE',
    });
  }
}