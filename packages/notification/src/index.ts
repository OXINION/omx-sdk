import { createOmxClient } from "@omx-sdk/core";
import { NotificationApiError, NotificationNetworkError } from "./errors.js";
import {
  NotificationClient,
  NotificationIntent,
  NotificationOptions,
  RegisterDeviceParams,
} from "./types.js";

class NotificationClientImpl implements NotificationClient {
  private omx: ReturnType<typeof createOmxClient>;
  private baseUrl: string;

  constructor(omx: ReturnType<typeof createOmxClient>, options?: NotificationOptions) {
    this.omx = omx;
    const base = options?.baseUrl || omx.config.notification?.baseUrl;
    if (!base) {
      this.baseUrl =
        (
          omx.config.supabaseUrl || "https://blhilidnsybhfdmwqsrx.supabase.co"
        ).replace(/\/$/, "") + "/functions/v1/notification-service";
    } else {
      this.baseUrl = base.replace(/\/$/, "");
    }
  }

  private async request(
    path: string,
    method: "POST" | "DELETE",
    body?: unknown
  ): Promise<void> {
    const url = `${this.baseUrl}${path}`;

    try {
      await this.omx.auth.makeAuthenticatedRequest(url, {
        method,
        body,
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw new NotificationApiError(
          error.message,
          error.statusCode,
          error.details
        );
      }
      throw new NotificationNetworkError(error.message, error);
    }
  }

  async registerDevice(params: RegisterDeviceParams): Promise<void> {
    await this.request("/devices", "POST", params);
  }

  async subscribeCategories(categories: string[]): Promise<void> {
    await this.request("/subscriptions", "POST", { categories });
  }

  async unsubscribeCategories(categories: string[]): Promise<void> {
    await this.request("/subscriptions", "DELETE", { categories });
  }

  async sendIntent(intent: NotificationIntent): Promise<void> {
    await this.request("/intents", "POST", intent);
  }
}

/**
 * Attacher function: Attach Notification module to an existing OmxClient
 */
export function notification(
  omx: ReturnType<typeof createOmxClient>,
  options?: NotificationOptions
): NotificationClient {
  return new NotificationClientImpl(omx, options);
}

// Re-export types and errors
export * from "./errors.js";
export * from "./types.js";
