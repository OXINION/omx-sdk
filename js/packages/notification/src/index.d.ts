import { OMXClient } from '@omx-sdk/core';
export interface NotificationData {
    userId: string;
    title: string;
    body: string;
    data?: Record<string, any>;
}
export interface NotificationResult {
    messageId: string;
    status: string;
}
export interface PushTokenData {
    userId: string;
    deviceToken: string;
    platform: 'ios' | 'android' | 'web';
}
export interface NotificationTemplate {
    id: string;
    name: string;
    title: string;
    body: string;
    data?: Record<string, any>;
}
export declare class NotificationManager {
    private client;
    constructor(client: OMXClient);
    sendPushNotification(data: NotificationData): Promise<NotificationResult>;
    sendBulkNotifications(notifications: NotificationData[]): Promise<NotificationResult[]>;
    registerPushToken(tokenData: PushTokenData): Promise<void>;
    unregisterPushToken(userId: string, deviceToken: string): Promise<void>;
    getTemplates(): Promise<NotificationTemplate[]>;
    sendFromTemplate(templateId: string, userId: string, data?: Record<string, any>): Promise<NotificationResult>;
}
//# sourceMappingURL=index.d.ts.map