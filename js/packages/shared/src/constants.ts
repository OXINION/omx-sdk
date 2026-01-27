// Constants used across OMX SDK packages

export const OMX_API_VERSION = 'v1';

export const DEFAULT_BASE_URL = 'https://api.oxinion.com/v1';

export const EVENT_TYPES = {
  GEOTRIGGER_ENTER: 'geotrigger.enter',
  GEOTRIGGER_EXIT: 'geotrigger.exit',
  BEACON_ENTER: 'beacon.enter',
  BEACON_EXIT: 'beacon.exit',
  CAMPAIGN_TRIGGERED: 'campaign.triggered',
  CAMPAIGN_COMPLETED: 'campaign.completed',
  NOTIFICATION_SENT: 'notification.sent',
  NOTIFICATION_DELIVERED: 'notification.delivered',
  NOTIFICATION_OPENED: 'notification.opened',
  EMAIL_SENT: 'email.sent',
  EMAIL_DELIVERED: 'email.delivered',
  EMAIL_OPENED: 'email.opened',
  EMAIL_CLICKED: 'email.clicked',
  EMAIL_BOUNCED: 'email.bounced',
  WEBHOOK_TRIGGERED: 'webhook.triggered',
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
} as const;

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  RATE_LIMITED: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const CAMPAIGN_TYPES = {
  GEOTRIGGER: 'geotrigger',
  BEACON: 'beacon',
  SCHEDULED: 'scheduled',
  MANUAL: 'manual',
} as const;

export const CAMPAIGN_STATUSES = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
} as const;

export const NOTIFICATION_PLATFORMS = {
  IOS: 'ios',
  ANDROID: 'android',
  WEB: 'web',
} as const;

export const EMAIL_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
} as const;
