// Meta package that re-exports all OMX SDK modules
export * from '@omx-sdk/core'
export * from '@omx-sdk/shared'

// Re-export managers with specific exports to avoid naming conflicts
export {
  GeoTriggerManager,
  GeoTrigger,
  GeoTriggerConfig,
  Notification,
  Location
} from '@omx-sdk/geotrigger'

export {
  EmailManager,
  EmailData,
  EmailResult,
  EmailTemplate,
  EmailCampaign,
  EmailAttachment
} from '@omx-sdk/email'

export {
  WebhookManager,
  WebhookPayload,
  WebhookConfig
} from '@omx-sdk/webhook'

export {
  NotificationManager,
  NotificationData,
  NotificationResult,
  PushTokenData,
  NotificationTemplate
} from '@omx-sdk/notification'

export {
  BeaconManager,
  BeaconConfig,
  Beacon,
  BeaconTrigger,
  BeaconTriggerConfig,
  BeaconDetection
} from '@omx-sdk/beacon'

export {
  CampaignManager,
  CampaignConfig,
  Campaign,
  CampaignStats,
  CampaignExecution,
  CampaignAction
} from '@omx-sdk/campaign'

// Main SDK class that provides access to all managers
import { OMXClient, OMXClientConfig } from '@omx-sdk/core';
import { GeoTriggerManager } from '@omx-sdk/geotrigger';
import { EmailManager } from '@omx-sdk/email';
import { WebhookManager } from '@omx-sdk/webhook';
import { NotificationManager } from '@omx-sdk/notification';
import { BeaconManager } from '@omx-sdk/beacon';
import { CampaignManager } from '@omx-sdk/campaign';

export class OMXSdk {
  public readonly client: OMXClient;
  public readonly geotrigger: GeoTriggerManager;
  public readonly email: EmailManager;
  public readonly webhook: WebhookManager;
  public readonly notification: NotificationManager;
  public readonly beacon: BeaconManager;
  public readonly campaign: CampaignManager;

  constructor(config?: OMXClientConfig) {
    this.client = new OMXClient(config);
    this.geotrigger = new GeoTriggerManager(this.client);
    this.email = new EmailManager(this.client);
    this.webhook = new WebhookManager(this.client);
    this.notification = new NotificationManager(this.client);
    this.beacon = new BeaconManager(this.client);
    this.campaign = new CampaignManager(this.client);
  }
}

// Factory function for creating SDK instance
export function createOmxSdk(config?: OMXClientConfig): OMXSdk {
  return new OMXSdk(config);
}

// Legacy export for backwards compatibility
export const createOMXSdk = createOmxSdk;

// OMXClient is already exported above from '@omx-sdk/core'