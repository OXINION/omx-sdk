import { describe, it, expect, beforeEach } from 'vitest';
import { OMXClient, createOmxClient } from './index.js';

describe('OMXClient', () => {
  let sdk: OMXClient;

  beforeEach(() => {
    sdk = new OMXClient({
      clientId: 'test-client',
      secretKey: 'test-secret'
    });
  });

  it('should initialize with all managers', () => {
    expect(sdk.core).toBeDefined();
    expect(sdk.geotrigger).toBeDefined();
    expect(sdk.email).toBeDefined();
    expect(sdk.webhook).toBeDefined();
    expect(sdk.notification).toBeDefined();
    expect(sdk.beacon).toBeDefined();
    expect(sdk.campaign).toBeDefined();
  });

  it('should create SDK via factory function', () => {
    const sdkFromFactory = createOmxClient({
      clientId: 'test-client',
      secretKey: 'test-secret'
    });
    
    expect(sdkFromFactory).toBeInstanceOf(OMXClient);
    expect(sdkFromFactory.core).toBeDefined();
  });

  it('should use environment variables when no config provided', () => {
    process.env.OMX_CLIENT_ID = 'env-client';
    process.env.OMX_SECRET_KEY = 'env-secret';
    
    const envSdk = new OMXClient();
    expect(envSdk.core.clientId).toBe('env-client');
    expect(envSdk.core.secretKey).toBe('env-secret');
    
    // Clean up
    delete process.env.OMX_CLIENT_ID;
    delete process.env.OMX_SECRET_KEY;
  });

  it('should provide access to all manager types', () => {
    expect(sdk.geotrigger.constructor.name).toBe('GeoTriggerManager');
    expect(sdk.email.constructor.name).toBe('EmailManager');
    expect(sdk.webhook.constructor.name).toBe('WebhookManager');
    expect(sdk.notification.constructor.name).toBe('NotificationManager');
    expect(sdk.beacon.constructor.name).toBe('BeaconManager');
    expect(sdk.campaign.constructor.name).toBe('CampaignManager');
  });
});