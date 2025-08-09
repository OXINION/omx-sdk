import type {
  CampaignData,
  CampaignFilters,
  CampaignStats,
  CampaignUpdateData,
} from "./types.js";

import { SUPABASE_FN_BASE_URL } from "@omx-sdk/core";

export class CampaignClient {
  private clientId: string;
  private secretKey: string;
  private teamId: string;
  private authToken: string | null = null;

  constructor(config: {
    clientId: string;
    secretKey: string;
    teamId?: string;
  }) {
    this.clientId = config.clientId;
    this.secretKey = config.secretKey;
    this.teamId = config.teamId || `team-${Date.now()}`;
  }

  private async getAuthToken(): Promise<string> {
    if (!this.authToken) {
      const response = await fetch(`${SUPABASE_FN_BASE_URL}/create-jwt-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: this.clientId,
          secretKey: this.secretKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.authToken = data.token;
    }
    return this.authToken!;
  }

  private async makeRequest(endpoint: string, data: any = {}): Promise<any> {
    const token = await this.getAuthToken();

    const response = await fetch(`${SUPABASE_FN_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data, teamId: this.teamId }),
    });

    if (!response.ok) {
      throw new Error(`${endpoint} failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async createCampaign(data: CampaignData): Promise<CampaignData> {
    return this.makeRequest("campaign-create", data);
  }

  async listCampaigns(filters: CampaignFilters = {}): Promise<CampaignData[]> {
    return this.makeRequest("campaign-list", { filters });
  }

  async getCampaign(id: string): Promise<CampaignData> {
    return this.makeRequest("campaign-get", { id });
  }

  async updateCampaign(
    id: string,
    updates: CampaignUpdateData
  ): Promise<CampaignData> {
    return this.makeRequest("campaign-update", { id, updates });
  }

  async deleteCampaign(id: string): Promise<void> {
    return this.makeRequest("campaign-delete", { id });
  }

  async updateCampaignStatus(id: string, status: string): Promise<void> {
    return this.makeRequest("campaign-update-status", { id, status });
  }

  async duplicateCampaign(id: string, newName?: string): Promise<CampaignData> {
    return this.makeRequest("campaign-duplicate", { id, newName });
  }

  async getCampaignStats(): Promise<CampaignStats> {
    return this.makeRequest("campaign-stats", {});
  }

  async executeCampaign(id: string, triggerData?: any): Promise<any> {
    return this.makeRequest("campaign-execute", { id, triggerData });
  }

  async getCampaignExecutions(id: string): Promise<any[]> {
    return this.makeRequest("campaign-executions", { id });
  }

  // Public authentication method for testing
  async authenticate(): Promise<string> {
    return this.getAuthToken();
  }
}

// Factory 함수: clientId/secretKey 기반으로 Campaign Client 생성
export function createCampaignClient(config: {
  clientId: string;
  secretKey: string;
  teamId?: string;
}) {
  return new CampaignClient(config);
}

// Legacy 호환성을 위한 factory 함수 (deprecated)
export function createCampaignModule(config: {
  clientId: string;
  secretKey: string;
  teamId?: string;
}) {
  return new CampaignClient(config);
}

export * from "./types";
