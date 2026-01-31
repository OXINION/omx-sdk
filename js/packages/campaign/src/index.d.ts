import { OMXClient } from '@omx-sdk/core';
export interface CampaignConfig {
    name: string;
    description?: string;
    type: 'geotrigger' | 'beacon' | 'scheduled' | 'manual';
    status: 'draft' | 'active' | 'paused' | 'completed';
    startDate?: string;
    endDate?: string;
    targetAudience?: {
        userSegments?: string[];
        locations?: Array<{
            lat: number;
            lng: number;
            radius: number;
        }>;
        demographics?: {
            ageRange?: {
                min: number;
                max: number;
            };
            interests?: string[];
        };
    };
    actions: CampaignAction[];
}
export interface CampaignAction {
    type: 'notification' | 'email' | 'webhook' | 'coupon';
    config: Record<string, any>;
    delay?: number;
}
export interface Campaign {
    id: string;
    name: string;
    description?: string;
    type: 'geotrigger' | 'beacon' | 'scheduled' | 'manual';
    status: 'draft' | 'active' | 'paused' | 'completed';
    startDate?: string;
    endDate?: string;
    targetAudience?: {
        userSegments?: string[];
        locations?: Array<{
            lat: number;
            lng: number;
            radius: number;
        }>;
        demographics?: {
            ageRange?: {
                min: number;
                max: number;
            };
            interests?: string[];
        };
    };
    actions: CampaignAction[];
    stats: CampaignStats;
    createdAt: string;
    updatedAt: string;
}
export interface CampaignStats {
    triggered: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    revenue?: number;
}
export interface CampaignExecution {
    id: string;
    campaignId: string;
    userId: string;
    triggeredBy: string;
    status: 'pending' | 'executing' | 'completed' | 'failed';
    executedActions: Array<{
        actionType: string;
        status: 'pending' | 'completed' | 'failed';
        executedAt?: string;
        error?: string;
    }>;
    createdAt: string;
    completedAt?: string;
}
export declare class CampaignManager {
    private client;
    constructor(client: OMXClient);
    create(config: CampaignConfig): Promise<Campaign>;
    list(status?: Campaign['status']): Promise<Campaign[]>;
    get(id: string): Promise<Campaign>;
    update(id: string, config: Partial<CampaignConfig>): Promise<Campaign>;
    delete(id: string): Promise<void>;
    activate(id: string): Promise<Campaign>;
    pause(id: string): Promise<Campaign>;
    resume(id: string): Promise<Campaign>;
    complete(id: string): Promise<Campaign>;
    getStats(id: string, period?: 'day' | 'week' | 'month'): Promise<CampaignStats>;
    getExecutions(id: string, limit?: number, offset?: number): Promise<CampaignExecution[]>;
    triggerManual(id: string, userIds: string[]): Promise<void>;
    clone(id: string, newName: string): Promise<Campaign>;
    testCampaign(id: string, testUserId: string): Promise<CampaignExecution>;
}
//# sourceMappingURL=index.d.ts.map