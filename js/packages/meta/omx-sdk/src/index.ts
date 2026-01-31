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

// Main client class that provides access to all managers
import { OMXClient as CoreClient, OMXClientConfig } from '@omx-sdk/core';
import { GeoTriggerManager } from '@omx-sdk/geotrigger';
import { EmailManager } from '@omx-sdk/email';
import { WebhookManager } from '@omx-sdk/webhook';
import { NotificationManager } from '@omx-sdk/notification';
import { BeaconManager } from '@omx-sdk/beacon';
import { CampaignManager } from '@omx-sdk/campaign';

export class OMXClient {
  public readonly core: CoreClient;
  public readonly geotrigger: GeoTriggerManager;
  public readonly email: EmailManager;
  public readonly webhook: WebhookManager;
  public readonly notification: NotificationManager;
  public readonly beacon: BeaconManager;
  public readonly campaign: CampaignManager;

  constructor(config?: OMXClientConfig) {
    this.core = new CoreClient(config);
    this.geotrigger = new GeoTriggerManager(this.core);
    this.email = new EmailManager(this.core);
    this.webhook = new WebhookManager(this.core);
    this.notification = new NotificationManager(this.core);
    this.beacon = new BeaconManager(this.core);
    this.campaign = new CampaignManager(this.core);
  }
}

// Factory function for creating client instance
export function createOmxClient(config?: OMXClientConfig): OMXClient {
  return new OMXClient(config);
}

// OMXClient is already exported above from '@omx-sdk/core'