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

export class BeaconManager {
  constructor(private client: OMXClient) {}

  async create(config: BeaconConfig): Promise<Beacon> {
    return this.client.makeRequest<Beacon>('/beacons', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async list(): Promise<Beacon[]> {
    return this.client.makeRequest<Beacon[]>('/beacons');
  }

  async get(id: string): Promise<Beacon> {
    return this.client.makeRequest<Beacon>(`/beacons/${id}`);
  }

  async update(id: string, config: Partial<BeaconConfig>): Promise<Beacon> {
    return this.client.makeRequest<Beacon>(`/beacons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.makeRequest<void>(`/beacons/${id}`, {
      method: 'DELETE',
    });
  }

  async activate(id: string): Promise<Beacon> {
    return this.client.makeRequest<Beacon>(`/beacons/${id}/activate`, {
      method: 'POST',
    });
  }

  async deactivate(id: string): Promise<Beacon> {
    return this.client.makeRequest<Beacon>(`/beacons/${id}/deactivate`, {
      method: 'POST',
    });
  }

  async createTrigger(config: BeaconTriggerConfig): Promise<BeaconTrigger> {
    return this.client.makeRequest<BeaconTrigger>('/beacon-triggers', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async getTriggers(beaconId: string): Promise<BeaconTrigger[]> {
    return this.client.makeRequest<BeaconTrigger[]>(`/beacons/${beaconId}/triggers`);
  }

  async deleteTrigger(triggerId: string): Promise<void> {
    return this.client.makeRequest<void>(`/beacon-triggers/${triggerId}`, {
      method: 'DELETE',
    });
  }

  async reportDetection(detection: Omit<BeaconDetection, 'timestamp'>): Promise<void> {
    return this.client.makeRequest<void>('/beacon-detections', {
      method: 'POST',
      body: JSON.stringify({
        ...detection,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  async getDetectionHistory(beaconId: string, startDate?: string, endDate?: string): Promise<BeaconDetection[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/beacons/${beaconId}/detections?${queryString}` : `/beacons/${beaconId}/detections`;
    
    return this.client.makeRequest<BeaconDetection[]>(endpoint);
  }
}