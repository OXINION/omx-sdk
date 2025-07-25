export class PushNotificationManager {
    constructor(config) {
        this.subscription = null;
        this.serviceWorker = null;
        this.analytics = {
            totalSubscriptions: 0,
            totalNotificationsSent: 0,
            totalNotificationsClicked: 0,
            clickThroughRate: 0,
            averageDeliveryTime: 0,
        };
        this.config = config;
    }
    /**
     * Initialize push notifications (register service worker, etc.)
     */
    async initialize() {
        // Check if service workers and push messaging are supported
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service workers are not supported in this browser');
        }
        if (!('PushManager' in window)) {
            throw new Error('Push messaging is not supported in this browser');
        }
        try {
            // Register service worker
            const swPath = this.config.serviceWorkerPath || '/sw.js';
            this.serviceWorker = await navigator.serviceWorker.register(swPath);
            console.log('Service worker registered successfully');
            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;
            console.log('Push notification manager initialized successfully');
        }
        catch (error) {
            throw new Error(`Failed to initialize push notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Request notification permission from user
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            throw new Error('Notifications are not supported in this browser');
        }
        const permission = await Notification.requestPermission();
        return permission;
    }
    /**
     * Check current notification permission status
     */
    getPermissionStatus() {
        if (!('Notification' in window)) {
            return 'denied';
        }
        return Notification.permission;
    }
    /**
     * Subscribe to push notifications
     */
    async subscribe() {
        try {
            const permission = await this.requestPermission();
            if (permission !== 'granted') {
                return {
                    success: false,
                    error: 'Notification permission denied',
                };
            }
            if (!this.serviceWorker) {
                throw new Error('Service worker not initialized. Call initialize() first.');
            }
            // Create push subscription
            const subscriptionOptions = {
                userVisibleOnly: true,
            };
            if (this.config.vapidPublicKey) {
                subscriptionOptions.applicationServerKey = this.urlBase64ToUint8Array(this.config.vapidPublicKey);
            }
            const pushSubscription = await this.serviceWorker.pushManager.subscribe(subscriptionOptions);
            // Convert to our format
            this.subscription = {
                endpoint: pushSubscription.endpoint,
                keys: {
                    p256dh: this.arrayBufferToBase64(pushSubscription.getKey('p256dh')),
                    auth: this.arrayBufferToBase64(pushSubscription.getKey('auth')),
                },
            };
            // Send subscription to server
            await this.sendSubscriptionToServer(this.subscription);
            this.analytics.totalSubscriptions++;
            return {
                success: true,
                subscriptionId: this.generateSubscriptionId(),
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Subscription failed',
            };
        }
    }
    /**
     * Unsubscribe from push notifications
     */
    async unsubscribe() {
        try {
            if (!this.serviceWorker) {
                return false;
            }
            const subscription = await this.serviceWorker.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                // Notify server about unsubscription
                if (this.subscription) {
                    await this.removeSubscriptionFromServer(this.subscription);
                }
                this.subscription = null;
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error unsubscribing:', error);
            return false;
        }
    }
    /**
     * Get current subscription
     */
    async getSubscription() {
        if (!this.serviceWorker) {
            return null;
        }
        try {
            const subscription = await this.serviceWorker.pushManager.getSubscription();
            if (subscription) {
                return {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')),
                        auth: this.arrayBufferToBase64(subscription.getKey('auth')),
                    },
                };
            }
            return null;
        }
        catch (error) {
            console.error('Error getting subscription:', error);
            return null;
        }
    }
    /**
     * Send push notification to specific subscription
     */
    async sendNotification(subscription, payload) {
        try {
            const startTime = Date.now();
            // Prepare notification data
            const notificationData = {
                ...payload,
                timestamp: payload.timestamp || Date.now(),
            };
            // Send to push service via API
            await this.sendPushToAPI(subscription, notificationData);
            const deliveryTime = Date.now() - startTime;
            this.updateAnalytics(deliveryTime);
            return {
                success: true,
                messageId: this.generateMessageId(),
                statusCode: 200,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Send failed',
                statusCode: 500,
            };
        }
    }
    /**
     * Send bulk notifications
     */
    async sendBulkNotifications(subscriptions, payload, options) {
        const batchSize = options?.batchSize || 10;
        const delay = options?.delay || 1000;
        const results = [];
        for (let i = 0; i < subscriptions.length; i += batchSize) {
            const batch = subscriptions.slice(i, i + batchSize);
            // Process batch in parallel
            const batchPromises = batch.map((subscription) => this.sendNotification(subscription, payload));
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
            // Add delay between batches (except for the last batch)
            if (i + batchSize < subscriptions.length && delay > 0) {
                await this.sleep(delay);
            }
        }
        return results;
    }
    /**
     * Show local notification (doesn't require push service)
     */
    async showLocalNotification(payload) {
        const permission = this.getPermissionStatus();
        if (permission !== 'granted') {
            throw new Error('Notification permission not granted');
        }
        const options = {
            body: payload.body,
            icon: payload.icon,
            badge: payload.badge,
            image: payload.image,
            tag: payload.tag,
            data: payload.data,
            actions: payload.actions,
            requireInteraction: payload.requireInteraction,
            silent: payload.silent,
            timestamp: payload.timestamp,
        };
        // Use service worker notification if available, otherwise use Notification API
        if (this.serviceWorker) {
            await this.serviceWorker.showNotification(payload.title, options);
        }
        else {
            new Notification(payload.title, options);
        }
    }
    /**
     * Handle notification click events
     */
    onNotificationClick(handler) {
        if (this.serviceWorker) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'notification-click') {
                    this.analytics.totalNotificationsClicked++;
                    this.updateClickThroughRate();
                    handler(event.data.notificationEvent);
                }
            });
        }
    }
    /**
     * Handle notification close events
     */
    onNotificationClose(handler) {
        if (this.serviceWorker) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'notification-close') {
                    handler(event.data.notificationEvent);
                }
            });
        }
    }
    /**
     * Get push analytics
     */
    getAnalytics() {
        return { ...this.analytics };
    }
    /**
     * Reset analytics
     */
    resetAnalytics() {
        this.analytics = {
            totalSubscriptions: 0,
            totalNotificationsSent: 0,
            totalNotificationsClicked: 0,
            clickThroughRate: 0,
            averageDeliveryTime: 0,
        };
    }
    /**
     * Check if push notifications are supported
     */
    static isSupported() {
        return ('serviceWorker' in navigator &&
            'PushManager' in window &&
            'Notification' in window);
    }
    /**
     * Send subscription to server
     */
    async sendSubscriptionToServer(subscription) {
        const url = `${this.config.baseUrl || 'https://api.oxinion.com/push'}/subscribe`;
        // Simulate API call
        await this.sleep(Math.random() * 300 + 100);
        console.log(`Sending subscription to ${url}`, subscription);
        // Simulate occasional failures
        if (Math.random() < 0.05) {
            throw new Error('Failed to save subscription');
        }
    }
    /**
     * Remove subscription from server
     */
    async removeSubscriptionFromServer(subscription) {
        const url = `${this.config.baseUrl || 'https://api.oxinion.com/push'}/unsubscribe`;
        // Simulate API call
        await this.sleep(Math.random() * 200 + 50);
        console.log(`Removing subscription from ${url}`, subscription);
    }
    /**
     * Send push notification via API
     */
    async sendPushToAPI(subscription, payload) {
        const url = `${this.config.baseUrl || 'https://api.oxinion.com/push'}/send`;
        // Simulate API call
        await this.sleep(Math.random() * 500 + 200);
        console.log(`Sending push notification to ${url}`, {
            subscription,
            payload,
        });
        // Simulate occasional failures
        if (Math.random() < 0.05) {
            throw new Error('Push service error');
        }
    }
    /**
     * Convert VAPID key to Uint8Array
     */
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    /**
     * Convert ArrayBuffer to base64
     */
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        bytes.forEach((byte) => {
            binary += String.fromCharCode(byte);
        });
        return window.btoa(binary);
    }
    /**
     * Update analytics with delivery time
     */
    updateAnalytics(deliveryTime) {
        this.analytics.totalNotificationsSent++;
        // Update average delivery time
        const total = this.analytics.totalNotificationsSent;
        const currentAvg = this.analytics.averageDeliveryTime;
        this.analytics.averageDeliveryTime =
            (currentAvg * (total - 1) + deliveryTime) / total;
    }
    /**
     * Update click-through rate
     */
    updateClickThroughRate() {
        const { totalNotificationsSent, totalNotificationsClicked } = this.analytics;
        this.analytics.clickThroughRate =
            totalNotificationsSent > 0
                ? (totalNotificationsClicked / totalNotificationsSent) * 100
                : 0;
    }
    /**
     * Generate unique message ID
     */
    generateMessageId() {
        return `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Generate unique subscription ID
     */
    generateSubscriptionId() {
        return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    /**
     * Get manager configuration
     */
    getConfig() {
        return { ...this.config };
    }
}
// Export default instance creation helper
export function createPushNotificationManager(config) {
    return new PushNotificationManager(config);
}
//# sourceMappingURL=index.js.map