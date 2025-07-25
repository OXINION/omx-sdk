declare global {
    interface PositionOptions {
        enableHighAccuracy?: boolean;
        timeout?: number;
        maximumAge?: number;
    }
    interface Navigator {
        bluetooth?: {
            requestDevice(options: any): Promise<any>;
        };
    }
    interface Notification {
        permission: NotificationPermission;
        requestPermission(): Promise<NotificationPermission>;
    }
}
export {};
//# sourceMappingURL=types.d.ts.map