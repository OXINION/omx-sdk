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
      ageRange?: { min: number; max: number };
      interests?: string[];
    };
  };
  actions: CampaignAction[];
}

export interface CampaignAction {
  type: 'notification' | 'email' | 'webhook' | 'coupon';
  config: Record<string, any>;
  delay?: number; // delay in milliseconds
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
      ageRange?: { min: number; max: number };
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

export class CampaignManager {
  constructor(private client: OMXClient) {}

  async create(config: CampaignConfig): Promise<Campaign> {
    return this.client.makeRequest<Campaign>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async list(status?: Campaign['status']): Promise<Campaign[]> {
    const params = status ? `?status=${status}` : '';
    return this.client.makeRequest<Campaign[]>(`/campaigns${params}`);
  }

  async get(id: string): Promise<Campaign> {
    return this.client.makeRequest<Campaign>(`/campaigns/${id}`);
  }

  async update(id: string, config: Partial<CampaignConfig>): Promise<Campaign> {
    return this.client.makeRequest<Campaign>(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.makeRequest<void>(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  async activate(id: string): Promise<Campaign> {
    return this.client.makeRequest<Campaign>(`/campaigns/${id}/activate`, {
      method: 'POST',
    });
  }

  async pause(id: string): Promise<Campaign> {
    return this.client.makeRequest<Campaign>(`/campaigns/${id}/pause`, {
      method: 'POST',
    });
  }

  async resume(id: string): Promise<Campaign> {
    return this.client.makeRequest<Campaign>(`/campaigns/${id}/resume`, {
      method: 'POST',
    });
  }

  async complete(id: string): Promise<Campaign> {
    return this.client.makeRequest<Campaign>(`/campaigns/${id}/complete`, {
      method: 'POST',
    });
  }

  async getStats(id: string, period?: 'day' | 'week' | 'month'): Promise<CampaignStats> {
    const params = period ? `?period=${period}` : '';
    return this.client.makeRequest<CampaignStats>(`/campaigns/${id}/stats${params}`);
  }

  async getExecutions(id: string, limit = 100, offset = 0): Promise<CampaignExecution[]> {
    return this.client.makeRequest<CampaignExecution[]>(
      `/campaigns/${id}/executions?limit=${limit}&offset=${offset}`
    );
  }

  async triggerManual(id: string, userIds: string[]): Promise<void> {
    return this.client.makeRequest<void>(`/campaigns/${id}/trigger`, {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    });
  }

  async clone(id: string, newName: string): Promise<Campaign> {
    return this.client.makeRequest<Campaign>(`/campaigns/${id}/clone`, {
      method: 'POST',
      body: JSON.stringify({ name: newName }),
    });
  }

  async testCampaign(id: string, testUserId: string): Promise<CampaignExecution> {
    return this.client.makeRequest<CampaignExecution>(`/campaigns/${id}/test`, {
      method: 'POST',
      body: JSON.stringify({ userId: testUserId }),
    });
  }
}