// Campaign types for strong typing
export interface CampaignData {
	id?: string;
	team_id: string;
	name: string;
	description?: string;
	industry?: string;
	target?: string;
	startDate?: string;
	sendTime?: string;
	frequency?: string;
	fromName?: string;
	fromEmail?: string;
	replyToEmail?: string;
	primaryGoal?: string;
	successMetric?: string;
	targetValue?: string;
	launchOption?: string;
	scheduledDate?: string;
	status?: "draft" | "active" | "paused" | "completed";
	createdAt?: string;
	updatedAt?: string;
}

export interface CampaignUpdateData extends Partial<CampaignData> {}

export interface CampaignFilters {
	status?: string;
	industry?: string;
	search?: string;
}

export interface CampaignStats {
	totalCampaigns: number;
	activeCampaigns: number;
	draftCampaigns: number;
	completedCampaigns: number;
}
