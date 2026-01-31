export declare const OMX_API_VERSION = "v1";
export declare const DEFAULT_BASE_URL: any;
export declare const EVENT_TYPES: {
    readonly GEOTRIGGER_ENTER: "geotrigger.enter";
    readonly GEOTRIGGER_EXIT: "geotrigger.exit";
    readonly BEACON_ENTER: "beacon.enter";
    readonly BEACON_EXIT: "beacon.exit";
    readonly CAMPAIGN_TRIGGERED: "campaign.triggered";
    readonly CAMPAIGN_COMPLETED: "campaign.completed";
    readonly NOTIFICATION_SENT: "notification.sent";
    readonly NOTIFICATION_DELIVERED: "notification.delivered";
    readonly NOTIFICATION_OPENED: "notification.opened";
    readonly EMAIL_SENT: "email.sent";
    readonly EMAIL_DELIVERED: "email.delivered";
    readonly EMAIL_OPENED: "email.opened";
    readonly EMAIL_CLICKED: "email.clicked";
    readonly EMAIL_BOUNCED: "email.bounced";
    readonly WEBHOOK_TRIGGERED: "webhook.triggered";
    readonly USER_CREATED: "user.created";
    readonly USER_UPDATED: "user.updated";
};
export declare const STATUS_CODES: {
    readonly SUCCESS: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly RATE_LIMITED: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const PAGINATION_DEFAULTS: {
    readonly PAGE: 1;
    readonly LIMIT: 20;
    readonly MAX_LIMIT: 100;
};
export declare const CAMPAIGN_TYPES: {
    readonly GEOTRIGGER: "geotrigger";
    readonly BEACON: "beacon";
    readonly SCHEDULED: "scheduled";
    readonly MANUAL: "manual";
};
export declare const CAMPAIGN_STATUSES: {
    readonly DRAFT: "draft";
    readonly ACTIVE: "active";
    readonly PAUSED: "paused";
    readonly COMPLETED: "completed";
};
export declare const NOTIFICATION_PLATFORMS: {
    readonly IOS: "ios";
    readonly ANDROID: "android";
    readonly WEB: "web";
};
export declare const EMAIL_PRIORITIES: {
    readonly LOW: "low";
    readonly NORMAL: "normal";
    readonly HIGH: "high";
};
//# sourceMappingURL=constants.d.ts.map