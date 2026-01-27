import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeoTriggerManager } from './index';
import { OMXClient } from '@omx-sdk/core';

describe('GeoTriggerManager', () => {
  let mockClient: OMXClient;
  let geoTriggerManager: GeoTriggerManager;

  beforeEach(() => {
    mockClient = {
      makeRequest: vi.fn()
    } as any;
    geoTriggerManager = new GeoTriggerManager(mockClient);
  });

  it('should create geotrigger manager', () => {
    expect(geoTriggerManager).toBeDefined();
  });

  it('should call create with correct parameters', async () => {
    const config = {
      name: 'Test Geotrigger',
      location: { lat: 43.6532, lng: -79.3832 },
      radius: 100
    };

    const mockResponse = { id: 'trigger-123', ...config, createdAt: '2024-01-01' };
    vi.mocked(mockClient.makeRequest).mockResolvedValue(mockResponse);

    const result = await geoTriggerManager.create(config);

    expect(mockClient.makeRequest).toHaveBeenCalledWith('/geotriggers', {
      method: 'POST',
      body: JSON.stringify(config)
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call list method', async () => {
    const mockResponse = [
      { id: 'trigger-1', name: 'Test 1', location: { lat: 1, lng: 1 }, radius: 100, createdAt: '2024-01-01' }
    ];
    vi.mocked(mockClient.makeRequest).mockResolvedValue(mockResponse);

    const result = await geoTriggerManager.list();

    expect(mockClient.makeRequest).toHaveBeenCalledWith('/geotriggers');
    expect(result).toEqual(mockResponse);
  });
});