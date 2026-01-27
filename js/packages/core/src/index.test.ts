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

  it('should use default base URL', () => {
    const client = new OMXClient({
      clientId: 'test-client',
      secretKey: 'test-secret'
    });

    expect(client.baseUrl).toBe('https://api.oxinion.com/v1');
  });

  it('should allow custom base URL', () => {
    const client = new OMXClient({
      clientId: 'test-client',
      secretKey: 'test-secret',
      baseUrl: 'https://custom-api.example.com'
    });

    expect(client.baseUrl).toBe('https://custom-api.example.com');
  });
});