import { describe, it, expect } from 'vitest';
import { OMXClient } from './index';

describe('OMXClient', () => {
  it('should create client with config', () => {
    const client = new OMXClient({
      clientId: 'test-client',
      secretKey: 'test-secret'
    });

    expect(client).toBeDefined();
    expect(client.clientId).toBe('test-client');
    expect(client.secretKey).toBe('test-secret');
  });

  it('should use OMX API URL', () => {
    const client = new OMXClient({
      clientId: 'test-client',
      secretKey: 'test-secret'
    });

    expect(client.apiUrl).toBe('https://omx.oxinion.com/v1');
  });
});