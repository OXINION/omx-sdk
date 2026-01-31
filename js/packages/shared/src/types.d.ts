export interface OMXError {
    code: string;
    message: string;
    details?: Record<string, any>;
}
export interface OMXResponse<T = any> {
    success: boolean;
    data?: T;
    error?: OMXError;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
}
export interface Location {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}
export interface TimeRange {
    start: string;
    end: string;
}
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}
export interface User {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    location?: Location;
    segments?: string[];
    properties?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
export interface Organization {
    id: string;
    name: string;
    domain?: string;
    settings?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
export interface APIKey {
    id: string;
    name: string;
    key: string;
    permissions: string[];
    lastUsed?: string;
    expiresAt?: string;
    createdAt: string;
}
//# sourceMappingURL=types.d.ts.map