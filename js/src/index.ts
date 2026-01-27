// Main entry point for omx-sdk
import { OMXClient, OMXClientConfig, createOMXClient } from '../packages/core/src/index.js';
import { GeoTriggerManager } from '../packages/geotrigger/src/index.js';
import { NotificationManager } from '../packages/email/src/index.js';
import { WebhookManager } from '../packages/webhook/src/index.js';

// Extended client that includes all feature packages
class ExtendedOMXClient extends OMXClient {
  public geoTrigger: GeoTriggerManager;
  public notification: NotificationManager;
  public webhook: WebhookManager;

  constructor(config: OMXClientConfig) {
    super(config);
    this.geoTrigger = new GeoTriggerManager(this);
    this.notification = new NotificationManager(this);
    this.webhook = new WebhookManager(this);
  }

  // Add other feature managers as properties
  public workflow = {
    createWorkflow: async (config: any): Promise<any> => {
      return this.makeRequest('/workflows', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    },
    runWorkflow: async (workflowId: string): Promise<any> => {
      return this.makeRequest(`/workflows/${workflowId}/execute`, {
        method: 'POST',
      });
    },
    list: async (): Promise<any[]> => {
      return this.makeRequest('/workflows');
    },
  };

  public analytics = {
    getGeoTriggerStats: async (params: { geoTriggerId: string; timeRange?: string }): Promise<any> => {
      const queryParams = new URLSearchParams({
        geoTriggerId: params.geoTriggerId,
        ...(params.timeRange && { timeRange: params.timeRange }),
      });
      return this.makeRequest(`/analytics/geotriggers?${queryParams}`);
    },
  };

  public segment = {
    createSegment: async (config: any): Promise<any> => {
      return this.makeRequest('/segments', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    },
    getSegmentUsers: async (segmentId: string): Promise<any[]> => {
      return this.makeRequest(`/segments/${segmentId}/users`);
    },
    list: async (): Promise<any[]> => {
      return this.makeRequest('/segments');
    },
  };

  public campaign = {
    create: async (config: any): Promise<any> => {
      return this.makeRequest('/campaigns', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    },
    send: async (campaignId: string): Promise<void> => {
      return this.makeRequest(`/campaigns/${campaignId}/send`, {
        method: 'POST',
      });
    },
    list: async (): Promise<any[]> => {
      return this.makeRequest('/campaigns');
    },
  };

  public events = {
    trackEvent: async (data: any): Promise<void> => {
      return this.makeRequest('/events', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getEventTimeline: async (params: { userId: string; limit?: number }): Promise<any> => {
      const queryParams = new URLSearchParams({
        userId: params.userId,
        ...(params.limit && { limit: params.limit.toString() }),
      });
      return this.makeRequest(`/events/timeline?${queryParams}`);
    },
  };
}

export function createOmxClient(config: OMXClientConfig): ExtendedOMXClient {
  return new ExtendedOMXClient(config);
}

// Re-export types and core classes
export * from '../packages/core/src/index.js';
export * from '../packages/geotrigger/src/index.js';
export * from '../packages/email/src/index.js';
export * from '../packages/webhook/src/index.js';

export { ExtendedOMXClient as OMXClient };
export default createOmxClient;