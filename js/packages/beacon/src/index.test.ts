import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BeaconManager } from './index.js';
import { OMXClient } from '@omx-sdk/core';

describe('BeaconManager', () => {
  let beaconManager: BeaconManager;
  let mockClient: OMXClient;

  beforeEach(() => {
    mockClient = {
      makeRequest: vi.fn(),
    } as any;
    beaconManager = new BeaconManager(mockClient);
  });

  it('should create beacon', async () => {
    const beaconConfig = {
      uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
      major: 1,
      minor: 1,
      name: 'Test Beacon'
    };
    
    const expectedResult = {
      id: 'beacon123',
      ...beaconConfig,
      status: 'active' as const,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };

    (mockClient.makeRequest as any).mockResolvedValue(expectedResult);

    const result = await beaconManager.create(beaconConfig);

    expect(mockClient.makeRequest).toHaveBeenCalledWith('/beacons', {
      method: 'POST',
      body: JSON.stringify(beaconConfig),
    });
    expect(result).toEqual(expectedResult);
  });

  it('should report beacon detection', async () => {
    const detection = {
      beaconId: 'beacon123',
      userId: 'user123',
      action: 'enter' as const,
      rssi: -45
    };

    (mockClient.makeRequest as any).mockResolvedValue(undefined);

    await beaconManager.reportDetection(detection);

    expect(mockClient.makeRequest).toHaveBeenCalledWith('/beacon-detections', {
      method: 'POST',
      body: expect.stringContaining('"beaconId":"beacon123"'),
    });
  });
});