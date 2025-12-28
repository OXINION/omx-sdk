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
  private clientId: string;
  private secretKey: string;
  private teamId: string;
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(config: {
    clientId: string;
    secretKey: string;
    teamId?: string;
    baseUrl?: string;
  }) {
    this.clientId = config.clientId;
    this.secretKey = config.secretKey;
    this.teamId = config.teamId || generateUUID();
    this.baseUrl = (
      config.baseUrl || "https://blhilidnsybhfdmwqsrx.supabase.co"
    ).replace(/\/$/, "");
  }

  private async getAuthToken(): Promise<string> {
    if (!this.authToken) {
      const response = await fetch(
        `${this.baseUrl}/functions/v1/create-jwt-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: this.clientId,
            secretKey: this.secretKey,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.authToken = data.token;

      // 🎯 Extract team_id from JWT or find from API keys
      try {
        if (this.authToken) {
          const payload = JSON.parse(atob(this.authToken.split(".")[1]));
          console.log(`🔍 JWT payload:`, payload);

          if (payload.team_id) {
            this.teamId = payload.team_id;
            console.log(`🆔 Team ID from JWT: ${this.teamId}`);
          } else {
            // If JWT doesn't have team_id, look up from API keys table
            console.log(`🔍 No team_id in JWT, looking up from API keys...`);
            await this.loadTeamIdFromApiKeys();
          }
        }
      } catch (error) {
        console.warn(
          "Failed to decode JWT, looking up team_id from API keys:",
          error
        );
        await this.loadTeamIdFromApiKeys();
      }
    }
    return this.authToken!;
  }

  // Method to find team_id from API keys
  private async loadTeamIdFromApiKeys(): Promise<void> {
    try {
      console.log(`🔍 Looking up team_id for client_id: ${this.clientId}`);

      const url = `${this.baseUrl}/functions/v1/database-access?table=api_keys&schema=business`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({
          filters: { client_id: this.clientId },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`🔍 API keys lookup result:`, result);

        if (result.success && result.data && result.data.length > 0) {
          const apiKey = result.data[0];
          if (apiKey.team_id) {
            this.teamId = apiKey.team_id;
            console.log(`🆔 Team ID from API keys: ${this.teamId}`);
          } else {
            console.warn(`⚠️ API key found but no team_id:`, apiKey);
          }
        } else {
          console.warn(`⚠️ No API key found for client_id: ${this.clientId}`);
          console.warn(`⚠️ Using fallback team_id: ${this.teamId}`);
        }
      } else {
        const errorText = await response.text();
        console.warn(`⚠️ Failed to lookup API key:`, errorText);
      }
    } catch (error) {
      console.warn("Failed to load team_id from API keys:", error);
      console.warn(`⚠️ Using fallback team_id: ${this.teamId}`);
    }
  }

  private async makeRequest(endpoint: string, data: any = {}): Promise<any> {
    const token = await this.getAuthToken();

    // Use database-access for all operations instead of specific campaign endpoints
    let url: string;
    let method = "POST";
    let body: any;

    switch (endpoint) {
      case "campaign-list":
        url = `${this.baseUrl}/functions/v1/database-access?table=campaigns&schema=business`;
        method = "POST";
        body = JSON.stringify({
          filters: { team_id: this.teamId, ...data.filters },
        });
        break;

      case "campaign-create":
        url = `${this.baseUrl}/functions/v1/database-access?table=campaigns&schema=business`;
        method = "POST";
        body = JSON.stringify({
          action: "create",
          data: {
            ...data,
            team_id: this.teamId,
            created_at: new Date().toISOString(),
          },
        });
        break;

      case "campaign-get":
        url = `${this.baseUrl}/functions/v1/database-access?table=campaigns&schema=business`;
        method = "POST";
        body = JSON.stringify({
          filters: { id: data.id, team_id: this.teamId },
        });
        break;

      case "campaign-update":
        url = `${this.baseUrl}/functions/v1/database-access?table=campaigns&schema=business`;
        method = "POST";
        body = JSON.stringify({
          action: "update",
          filters: { id: data.id, team_id: this.teamId },
          data: {
            ...data.updates,
            updated_at: new Date().toISOString(),
          },
        });
        break;

      case "campaign-delete":
        url = `${this.baseUrl}/functions/v1/database-access?table=campaigns&schema=business`;
        method = "POST";
        body = JSON.stringify({
          action: "delete",
          filters: { id: data.id, team_id: this.teamId },
        });
        break;

      // 🎯 Handle campaign-stats directly (without calling database-access)
      case "campaign-stats": {
        const campaigns = await this.listCampaigns();
        return {
          totalCampaigns: campaigns.length,
          activeCampaigns: campaigns.filter((c: any) => c.status === "active")
            .length,
          draftCampaigns: campaigns.filter((c: any) => c.status === "draft")
            .length,
          pausedCampaigns: campaigns.filter((c: any) => c.status === "paused")
            .length,
          completedCampaigns: campaigns.filter(
            (c: any) => c.status === "completed"
          ).length,
          teamId: this.teamId,
        };
      }

      default:
        // Fallback to database-access for any other endpoint
        url = `${this.baseUrl}/functions/v1/database-access`;
        method = "POST";
        body = JSON.stringify({ ...data, teamId: this.teamId });
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ${endpoint} failed:`, errorText);
      throw new Error(`${endpoint} failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ ${endpoint} response:`, result);

    // Handle database-access response format
    if (result.success !== undefined) {
      if (!result.success) {
        throw new Error(result.error || "Database operation failed");
      }
      return result.data;
    }

    // Return data array for cases like campaign-list or campaign-get
    return result.data || result;
  }

  async createCampaign(data: CampaignData): Promise<CampaignData> {
    return this.makeRequest("campaign-create", data);
  }

  async listCampaigns(filters: CampaignFilters = {}): Promise<CampaignData[]> {
    return this.makeRequest("campaign-list", { filters });
  }

  async getCampaign(id: string): Promise<CampaignData> {
    const result = await this.makeRequest("campaign-get", { id });
    // Return first element if returned as array
    return Array.isArray(result) ? result[0] : result;
  }

  async updateCampaign(
    id: string,
    updates: CampaignUpdateData
  ): Promise<CampaignData> {
    return this.makeRequest("campaign-update", { id, updates });
  }

  async deleteCampaign(id: string): Promise<void> {
    await this.makeRequest("campaign-delete", { id });
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
    delete (duplicateData as any).id; // Remove ID
    return this.createCampaign(duplicateData);
  }

  async getCampaignStats(): Promise<CampaignStats> {
    return this.makeRequest("campaign-stats", {});
  }

  async executeCampaign(_id: string, _triggerData?: any): Promise<any> {
    // To be implemented in the future
    throw new Error("Campaign execution not yet implemented");
  }

  async getCampaignExecutions(_id: string): Promise<any[]> {
    // To be implemented in the future
    return [];
  }

  // Public authentication method for testing
  async authenticate(): Promise<string> {
    return this.getAuthToken();
  }
}

// Factory function: Create Campaign Client based on clientId/secretKey
export function createCampaignClient(config: {
  clientId: string;
  secretKey: string;
  teamId?: string;
  baseUrl?: string;
}) {
  return new CampaignClient(config);
}

// Legacy compatibility factory function (deprecated)
export function createCampaignModule(config: {
  clientId: string;
  secretKey: string;
  teamId?: string;
  baseUrl?: string;
}) {
  return new CampaignClient(config);
}

export * from "./types";
