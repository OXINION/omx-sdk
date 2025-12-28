/**
 * @omx-sdk/campaign
 * Campaign management module for OMX SDK
 */

import { createOmxClient } from "@omx-sdk/core";
import type {
  CampaignData,
  CampaignFilters,
  CampaignStats,
  CampaignUpdateData,
} from "./types.js";

// UUID v4 generation function
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class CampaignClient {
  private omx: ReturnType<typeof createOmxClient>;
  private teamId: string | null = null;

  constructor(omx: ReturnType<typeof createOmxClient>) {
    this.omx = omx;
  }

  private async getTeamId(): Promise<string> {
    if (this.teamId) return this.teamId;

    const token = await this.omx.auth.getToken();
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.team_id) {
        this.teamId = payload.team_id;
        return this.teamId!;
      }
    } catch (e) {
      // Ignore decode errors
    }

    // Fallback: look up from api_keys
    await this.loadTeamIdFromApiKeys();
    return this.teamId || generateUUID();
  }

  private async loadTeamIdFromApiKeys(): Promise<void> {
    try {
      const url = "database-access?table=api_keys&schema=business";
      const result = await this.omx.request(url, {
        method: "POST",
        body: {
          filters: { client_id: this.omx.config.clientId },
        },
      });

      if (result && result.length > 0) {
        this.teamId = result[0].team_id;
      }
    } catch (error) {
      console.warn("Failed to load team_id from API keys:", error);
    }
  }

  async createCampaign(data: CampaignData): Promise<CampaignData> {
    const teamId = await this.getTeamId();
    return this.omx.request("database-access?table=campaigns&schema=business", {
      method: "POST",
      body: {
        action: "create",
        data: {
          ...data,
          team_id: teamId,
          created_at: new Date().toISOString(),
        },
      },
    });
  }

  async listCampaigns(filters: CampaignFilters = {}): Promise<CampaignData[]> {
    const teamId = await this.getTeamId();
    return this.omx.request("database-access?table=campaigns&schema=business", {
      method: "POST",
      body: {
        filters: { team_id: teamId, ...filters },
      },
    });
  }

  async getCampaign(id: string): Promise<CampaignData> {
    const teamId = await this.getTeamId();
    const result = await this.omx.request(
      "database-access?table=campaigns&schema=business",
      {
        method: "POST",
        body: {
          filters: { id: id, team_id: teamId },
        },
      }
    );
    return Array.isArray(result) ? result[0] : result;
  }

  async updateCampaign(
    id: string,
    updates: CampaignUpdateData
  ): Promise<CampaignData> {
    const teamId = await this.getTeamId();
    return this.omx.request("database-access?table=campaigns&schema=business", {
      method: "POST",
      body: {
        action: "update",
        filters: { id: id, team_id: teamId },
        data: {
          ...updates,
          updated_at: new Date().toISOString(),
        },
      },
    });
  }

  async deleteCampaign(id: string): Promise<void> {
    const teamId = await this.getTeamId();
    await this.omx.request("database-access?table=campaigns&schema=business", {
      method: "POST",
      body: {
        action: "delete",
        filters: { id: id, team_id: teamId },
      },
    });
  }

  async updateCampaignStatus(
    id: string,
    status: "active" | "draft" | "paused" | "completed"
  ): Promise<void> {
    await this.updateCampaign(id, { status });
  }

  async duplicateCampaign(id: string, newName?: string): Promise<CampaignData> {
    const original = await this.getCampaign(id);
    const duplicateData = {
      ...original,
      name: newName || `${original.name} (Copy)`,
      status: "draft" as const,
    };
    delete (duplicateData as any).id;
    return this.createCampaign(duplicateData);
  }

  async getCampaignStats(): Promise<CampaignStats> {
    const campaigns = await this.listCampaigns();
    const teamId = await this.getTeamId();
    return {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter((c: any) => c.status === "active")
        .length,
      draftCampaigns: campaigns.filter((c: any) => c.status === "draft").length,
      pausedCampaigns: campaigns.filter((c: any) => c.status === "paused")
        .length,
      completedCampaigns: campaigns.filter((c: any) => c.status === "completed")
        .length,
      teamId: teamId,
    };
  }

  async executeCampaign(_id: string, _triggerData?: any): Promise<any> {
    throw new Error("Campaign execution not yet implemented");
  }

  async getCampaignExecutions(_id: string): Promise<any[]> {
    return [];
  }
}

/**
 * Attacher function: Attach Campaign module to an existing OmxClient
 */
export function campaign(omx: ReturnType<typeof createOmxClient>): CampaignClient {
  return new CampaignClient(omx);
}

export * from "./types.js";
