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

export class BeaconManager {
  private omx: ReturnType<typeof createOmxClient>;
  private regions: Map<string, BeaconRegion> = new Map();
  private discoveredBeacons: Map<string, BeaconDevice> = new Map();
  private isScanning = false;
  private scanInterval: number | null = null;
  private eventListeners: Map<string, ((event: BeaconEvent) => void)[]> =
    new Map();
  private analytics: BeaconAnalytics = {
    totalBeacons: 0,
    regionsMonitored: 0,
    events: { enters: 0, exits: 0, ranges: 0 },
    averageRssi: 0,
    strongestSignal: -100,
    uptime: 0,
  };
  private startTime: Date | null = null;

  constructor(omx: ReturnType<typeof createOmxClient>) {
    this.omx = omx;
  }

  async initialize(): Promise<void> {
    const nav = navigator as any;
    if (!nav.bluetooth) {
      throw new Error("Web Bluetooth is not supported in this browser");
    }
    this.startTime = new Date();
  }

  addRegion(region: BeaconRegion): void {
    this.regions.set(region.id, region);
    this.analytics.regionsMonitored = this.regions.size;
  }

  removeRegion(regionId: string): boolean {
    const removed = this.regions.delete(regionId);
    if (removed) {
      this.analytics.regionsMonitored = this.regions.size;
    }
    return removed;
  }

  getRegions(): BeaconRegion[] {
    return Array.from(this.regions.values());
  }

  async startScanning(options?: ScanOptions): Promise<void> {
    if (this.isScanning) return;
    if (!this.startTime) await this.initialize();

    const interval =
      options?.interval || this.omx.config['beacon']?.scanInterval || 1000;
    this.isScanning = true;

    this.scanInterval = window.setInterval(async () => {
      await this.performScan(options);
    }, interval);

    if (options?.duration) {
      setTimeout(() => this.stopScanning(), options.duration);
    }
  }

  stopScanning(): void {
    if (!this.isScanning) return;
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    this.isScanning = false;
  }

  getDiscoveredBeacons(): BeaconDevice[] {
    return Array.from(this.discoveredBeacons.values());
  }

  getBeaconsInRegion(regionId: string): BeaconDevice[] {
    const region = this.regions.get(regionId);
    if (!region) return [];

    return this.getDiscoveredBeacons().filter(
      (beacon) =>
        beacon.uuid === region.uuid &&
        (region.major === undefined || beacon.major === region.major) &&
        (region.minor === undefined || beacon.minor === region.minor)
    );
  }

  addEventListener(
    eventType: "enter" | "exit" | "range",
    listener: (event: BeaconEvent) => void
  ): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(listener);
  }

  removeEventListener(
    eventType: "enter" | "exit" | "range",
    listener: (event: BeaconEvent) => void
  ): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    }
  }

  getAnalytics(): BeaconAnalytics {
    if (this.startTime) {
      this.analytics.uptime = Date.now() - this.startTime.getTime();
    }
    return { ...this.analytics };
  }

  private async performScan(options?: ScanOptions): Promise<void> {
    const simulatedBeacons = this.generateSimulatedBeacons();
    const filteredBeacons = options?.filterByRegions
      ? simulatedBeacons.filter((beacon) =>
          options!.filterByRegions!.some(
            (region) =>
              beacon.uuid === region.uuid &&
              (region.major === undefined || beacon.major === region.major) &&
              (region.minor === undefined || beacon.minor === region.minor)
          )
        )
      : simulatedBeacons;

    for (const beacon of filteredBeacons) {
      const existingBeacon = this.discoveredBeacons.get(beacon.id);
      if (!existingBeacon) {
        this.discoveredBeacons.set(beacon.id, beacon);
        this.analytics.totalBeacons = this.discoveredBeacons.size;

        const matchingRegion = this.findMatchingRegion(beacon);
        if (matchingRegion) {
          this.emitEvent({
            type: "enter",
            region: matchingRegion,
            beacons: [beacon],
            timestamp: new Date(),
          });
          this.analytics.events.enters++;
        }
      } else {
        existingBeacon.rssi = beacon.rssi;
        if (beacon.distance !== undefined) {
          existingBeacon.distance = beacon.distance;
        }
        existingBeacon.proximity = beacon.proximity;
        existingBeacon.lastSeen = new Date();
      }

      if (beacon.rssi > this.analytics.strongestSignal) {
        this.analytics.strongestSignal = beacon.rssi;
      }
    }

    for (const region of this.regions.values()) {
      const beaconsInRegion = this.getBeaconsInRegion(region.id);
      if (beaconsInRegion.length > 0) {
        this.emitEvent({
          type: "range",
          region,
          beacons: beaconsInRegion,
          timestamp: new Date(),
        });
        this.analytics.events.ranges++;
      }
    }

    const allBeacons = this.getDiscoveredBeacons();
    if (allBeacons.length > 0) {
      const totalRssi = allBeacons.reduce(
        (sum, beacon) => sum + beacon.rssi,
        0
      );
      this.analytics.averageRssi = totalRssi / allBeacons.length;
    }

    this.cleanupOldBeacons();
  }

  private generateSimulatedBeacons(): BeaconDevice[] {
    const beacons: BeaconDevice[] = [];
    const count = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < count; i++) {
      const rssi = Math.floor(Math.random() * 60) - 90;
      const distance = Math.pow(10, (-59 - rssi) / 20.0);
      const proximity =
        distance < 0.5 ? "immediate" : distance < 4.0 ? "near" : "far";

      beacons.push({
        id: `beacon_${i}_${Date.now()}`,
        uuid: "B0702880-A295-A8AB-F734-031A98A512DE",
        major: 1,
        minor: 1,
        rssi,
        distance,
        proximity,
        lastSeen: new Date(),
        name: `Beacon ${i + 1}`,
        manufacturer: "Estimote",
      });
    }
    return beacons;
  }

  private findMatchingRegion(beacon: BeaconDevice): BeaconRegion | null {
    for (const region of this.regions.values()) {
      if (
        region.uuid === beacon.uuid &&
        (region.major === undefined || region.major === beacon.major) &&
        (region.minor === undefined || region.minor === beacon.minor)
      ) {
        return region;
      }
    }
    return null;
  }

  private emitEvent(event: BeaconEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error("Error in beacon event listener:", error);
        }
      });
    }
  }

  private cleanupOldBeacons(): void {
    const cutoffTime = Date.now() - 30000;
    const toRemove: string[] = [];

    for (const [id, beacon] of this.discoveredBeacons.entries()) {
      if (beacon.lastSeen.getTime() < cutoffTime) {
        toRemove.push(id);
        const matchingRegion = this.findMatchingRegion(beacon);
        if (matchingRegion) {
          this.emitEvent({
            type: "exit",
            region: matchingRegion,
            beacons: [beacon],
            timestamp: new Date(),
          });
          this.analytics.events.exits++;
        }
      }
    }

    toRemove.forEach((id) => this.discoveredBeacons.delete(id));
    if (toRemove.length > 0) {
      this.analytics.totalBeacons = this.discoveredBeacons.size;
    }
  }

  isCurrentlyScanning(): boolean {
    return this.isScanning;
  }
}

/**
 * Attacher function: Attach Beacon module to an existing OmxClient
 */
export function beacon(omx: ReturnType<typeof createOmxClient>): BeaconManager {
  return new BeaconManager(omx);
}
