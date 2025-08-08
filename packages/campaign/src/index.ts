import {
	CampaignData,
	CampaignUpdateData,
	CampaignFilters,
	CampaignStats,
} from "./types";

import { SUPABASE_FN_BASE_URL } from "@omx-sdk/core";
import type { SupabaseClient } from "@supabase/supabase-js";

export class CampaignClient {
	private supabase: SupabaseClient;
	private teamId: string;

	constructor(supabase: SupabaseClient, teamId: string) {
		this.supabase = supabase;
		this.teamId = teamId;
	}

	async createCampaign(data: CampaignData): Promise<CampaignData> {
		// Edge Function 호출 방식으로 변경
		const response = await fetch(`${SUPABASE_FN_BASE_URL}/campaign-create`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...data, teamId: this.teamId }),
		});
		if (!response.ok) throw new Error("Failed to create campaign");
		return await response.json();
	}

	async listCampaigns(filters: CampaignFilters = {}): Promise<CampaignData[]> {
		let query = this.supabase
			.from("business.campaigns")
			.select("*")
			.eq("team_id", this.teamId);
		if (filters.status) query = query.eq("status", filters.status);
		if (filters.industry) query = query.eq("industry", filters.industry);
		if (filters.search) query = query.ilike("name", `%${filters.search}%`);
		const { data, error } = await query;
		if (error) throw new Error(error.message);
		return data;
	}

	async getCampaign(id: string): Promise<CampaignData> {
		const { data, error } = await this.supabase
			.from("business.campaigns")
			.select("*")
			.eq("id", id)
			.single();
		if (error) throw new Error(error.message);
		return data;
	}

	async updateCampaign(
		id: string,
		updates: CampaignUpdateData
	): Promise<CampaignData> {
		const { data, error } = await this.supabase
			.from("business.campaigns")
			.update(updates)
			.eq("id", id)
			.select()
			.single();
		if (error) throw new Error(error.message);
		return data;
	}

	async deleteCampaign(id: string): Promise<void> {
		const { error } = await this.supabase
			.from("business.campaigns")
			.delete()
			.eq("id", id);
		if (error) throw new Error(error.message);
	}

	async updateCampaignStatus(id: string, status: string): Promise<void> {
		const { error } = await this.supabase
			.from("business.campaigns")
			.update({ status })
			.eq("id", id);
		if (error) throw new Error(error.message);
	}

	async duplicateCampaign(id: string, newName?: string): Promise<CampaignData> {
		const original = await this.getCampaign(id);
		const copy = {
			...original,
			id: undefined,
			name: newName || `${original.name} (Copy)`,
		};
		return this.createCampaign(copy);
	}

	async getCampaignStats(): Promise<CampaignStats> {
		const { data, error } = await this.supabase
			.from("business.campaigns")
			.select("status", { count: "exact", head: false });
		if (error) throw new Error(error.message);
		const stats: CampaignStats = {
			totalCampaigns: data.length,
			activeCampaigns: data.filter((c: any) => c.status === "active").length,
			draftCampaigns: data.filter((c: any) => c.status === "draft").length,
			completedCampaigns: data.filter((c: any) => c.status === "completed")
				.length,
		};
		return stats;
	}

	async executeCampaign(id: string, _triggerData?: any): Promise<any> {
		// This would call an Edge Function or similar
		// Placeholder: just return a mock result
		return { success: true, executionId: `exec-${id}` };
	}

	async getCampaignExecutions(_id: string): Promise<any[]> {
		// Placeholder: would fetch from executions table/log
		return [];
	}
}

// 엔트리포인트: core에서 import할 수 있도록 factory 함수 제공
export function createCampaignModule(
	supabase: SupabaseClient,
	teamId?: string
) {
	return new CampaignClient(supabase, teamId ?? "");
}

export * from "./types";
