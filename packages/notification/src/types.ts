/**
 * Supported platforms for notification delivery.
 */
export type NotificationPlatform = "web" | "ios" | "android";

/**
 * Payload structure for sending a notification intent.
 * This is sent to the Supabase Edge Function which handles the actual delivery.
 */
export interface NotificationIntent {
  /**
   * Title of the notification.
   */
  readonly title: string;
  /**
   * Body message of the notification.
   */
  readonly body: string;
  /**
   * Target categories to notify.
   */
  readonly categories: readonly string[];
  /**
   * Optional custom data payload.
   */
  readonly data?: Readonly<Record<string, string>>;
}

/**
 * Parameters for registering a device.
 */
export interface RegisterDeviceParams {
  readonly platform: NotificationPlatform;
  readonly deviceToken: string;
}

/**
 * Configuration options for the Notification Client.
 */
export interface NotificationOptions {
  /**
   * Base URL of the Supabase Edge Function.
   */
  readonly baseUrl: string;
}

/**
 * Public API for the OMX Notification SDK.
 */
export interface NotificationClient {
  /**
   * Registers the current device for notification delivery.
   */
  registerDevice(params: RegisterDeviceParams): Promise<void>;

  /**
   * Subscribes the device to one or more interest categories.
   */
  subscribeCategories(categories: string[]): Promise<void>;

  /**
   * Unsubscribes the device from one or more interest categories.
   */
  unsubscribeCategories(categories: string[]): Promise<void>;

  /**
   * Sends a notification intent to the backend for delivery to subscribed users.
   */
  sendIntent(intent: NotificationIntent): Promise<void>;
}
