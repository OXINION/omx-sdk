// Global type definitions for browser APIs
/// <reference lib="dom" />

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

  // interface GeolocationPosition is already defined in the DOM lib, so do not redeclare it here.

  // interface GeolocationPositionError is already defined in the DOM lib, so do not redeclare it here.
}

export {};
