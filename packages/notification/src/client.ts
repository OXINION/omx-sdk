import {
  NotificationApiError,
  NotificationConfigError,
  NotificationNetworkError,
} from "./errors.js";
import {
  NotificationClient,
  NotificationIntent,
  NotificationOptions,
  RegisterDeviceParams,
} from "./types.js";

class NotificationClientImpl implements NotificationClient {
  private readonly baseUrl: string;
  private readonly authProvider: () => string;

  constructor(authProvider: () => string, options?: NotificationOptions) {
    if (!options?.baseUrl) {
      throw new NotificationConfigError(
        "baseUrl is required for Notification SDK"
      );
    }
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.authProvider = authProvider;
  }

  private async request(
    path: string,
    method: "POST" | "DELETE",
    body?: unknown
  ): Promise<void> {
    const url = `${this.baseUrl}${path}`;
    const token = this.authProvider();

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        let details: unknown;
        try {
          details = await response.json();
        } catch {
          details = await response.text();
        }
        throw new NotificationApiError(
          `Request failed with status ${response.status}`,
          response.status,
          details
        );
      }
    } catch (error) {
      if (error instanceof NotificationApiError) {
        throw error;
      }
      throw new NotificationNetworkError(
        error instanceof Error ? error.message : "Unknown network error",
        error
      );
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
 * Creates a new instance of the OMX Notification Client.
 *
 * @param authProvider - A function that returns a valid JWT token.
 * @param options - Configuration options including the base URL for the Edge Function.
 * @returns An implementation of NotificationClient.
 */
export function createNotificationClient(
  authProvider: () => string,
  options?: NotificationOptions
): NotificationClient {
  return new NotificationClientImpl(authProvider, options);
}
