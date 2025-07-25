export interface PushConfig {
    clientId: string;
    secretKey: string;
    baseUrl?: string;
    vapidPublicKey?: string;
    serviceWorkerPath?: string;
    timeout?: number;
}
export interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}
export interface NotificationPayload {
    title: string;
    body?: string;
    icon?: string;
    badge?: string;
    image?: string;
    tag?: string;
    data?: Record<string, unknown>;
    actions?: NotificationAction[];
    requireInteraction?: boolean;
    silent?: boolean;
    timestamp?: number;
    ttl?: number;
}
export interface NotificationAction {
    action: string;
    title: string;
    icon?: string;
}
export interface PushResponse {
    success: boolean;
    messageId?: string;
    error?: string;
    statusCode?: number;
}
export interface SubscriptionResponse {
    success: boolean;
    subscriptionId?: string;
    error?: string;
}
export interface PushAnalytics {
    totalSubscriptions: number;
    totalNotificationsSent: number;
    totalNotificationsClicked: number;
    clickThroughRate: number;
    averageDeliveryTime: number;
}
export interface BulkPushOptions {
    batchSize?: number;
    delay?: number;
}
export declare class PushNotificationManager {
    private config;
    private subscription;
    private serviceWorker;
    private analytics;
    constructor(config: PushConfig);
    /**
     * Initialize push notifications (register service worker, etc.)
     */
    initialize(): Promise<void>;
    /**
     * Request notification permission from user
     */
    requestPermission(): Promise<NotificationPermission>;
    /**
     * Check current notification permission status
     */
    getPermissionStatus(): NotificationPermission;
    /**
     * Subscribe to push notifications
     */
    subscribe(): Promise<SubscriptionResponse>;
    /**
     * Unsubscribe from push notifications
     */
    unsubscribe(): Promise<boolean>;
    /**
     * Get current subscription
     */
    getSubscription(): Promise<PushSubscription | null>;
    /**
     * Send push notification to specific subscription
     */
    sendNotification(subscription: PushSubscription, payload: NotificationPayload): Promise<PushResponse>;
    /**
     * Send bulk notifications
     */
    sendBulkNotifications(subscriptions: PushSubscription[], payload: NotificationPayload, options?: BulkPushOptions): Promise<PushResponse[]>;
    /**
     * Show local notification (doesn't require push service)
     */
    showLocalNotification(payload: NotificationPayload): Promise<void>;
    /**
     * Handle notification click events
     */
    onNotificationClick(handler: (event: NotificationEvent) => void): void;
    /**
     * Handle notification close events
     */
    onNotificationClose(handler: (event: NotificationEvent) => void): void;
    /**
     * Get push analytics
     */
    getAnalytics(): PushAnalytics;
    /**
     * Reset analytics
     */
    resetAnalytics(): void;
    /**
     * Check if push notifications are supported
     */
    static isSupported(): boolean;
    /**
     * Send subscription to server
     */
    private sendSubscriptionToServer;
    /**
     * Remove subscription from server
     */
    private removeSubscriptionFromServer;
    /**
     * Send push notification via API
     */
    private sendPushToAPI;
    /**
     * Convert VAPID key to Uint8Array
     */
    private urlBase64ToUint8Array;
    /**
     * Convert ArrayBuffer to base64
     */
    private arrayBufferToBase64;
    /**
     * Update analytics with delivery time
     */
    private updateAnalytics;
    /**
     * Update click-through rate
     */
    private updateClickThroughRate;
    /**
     * Generate unique message ID
     */
    private generateMessageId;
    /**
     * Generate unique subscription ID
     */
    private generateSubscriptionId;
    /**
     * Sleep utility
     */
    private sleep;
    /**
     * Get manager configuration
     */
    getConfig(): Readonly<PushConfig>;
}
export declare function createPushNotificationManager(config: PushConfig): PushNotificationManager;
export interface NotificationEvent {
    notification: {
        title: string;
        body?: string;
        icon?: string;
        badge?: string;
        image?: string;
        tag?: string;
        data?: Record<string, unknown>;
    };
    action?: string;
}
//# sourceMappingURL=index.d.ts.map