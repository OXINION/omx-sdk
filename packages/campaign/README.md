# @omx-sdk/campaign

Campaign management module for the OMX platform. Provides comprehensive CRUD operations and execution capabilities for marketing campaigns using dependency injection pattern.

## Deployment

```bash
npm publish packages/campaign
```

## ✅ Features

| Feature                | Method Example                      | Description                                                          |
| ---------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| **Create Campaign**    | `createCampaign(data)`              | Creates a new marketing campaign (via Edge Function)                 |
| **List Campaigns**     | `listCampaigns(filters?)`           | Fetches campaigns with optional filtering (status, industry, search) |
| **Get Campaign**       | `getCampaign(id)`                   | Retrieves a specific campaign by ID                                  |
| **Update Campaign**    | `updateCampaign(id, updates)`       | Updates campaign details                                             |
| **Delete Campaign**    | `deleteCampaign(id)`                | Removes a campaign                                                   |
| **Status Management**  | `updateCampaignStatus(id, status)`  | Changes campaign status                                              |
| **Duplicate Campaign** | `duplicateCampaign(id, newName?)`   | Creates a copy of existing campaign                                  |
| **Campaign Stats**     | `getCampaignStats()`                | Gets campaign statistics and metrics                                 |
| **Execute Campaign**   | `executeCampaign(id, triggerData?)` | Triggers campaign execution (mock)                                   |
| **Execution History**  | `getCampaignExecutions(id)`         | Fetches campaign execution logs (mock)                               |

## 🚀 Installation

```bash
npm install @omx-sdk/campaign @omx-sdk/core @supabase/supabase-js
```

## 🏗️ Architecture Pattern

This module uses **dependency injection** for clean architecture:

- **No direct imports** from `@omx-sdk/core` client
- **Only constants** imported: `SUPABASE_FN_BASE_URL`
- **Dependencies injected** via constructor: `SupabaseClient` and `teamId`
- **Factory function** provided for easy instantiation

## 📖 Usage

### Basic Setup (Dependency Injection)

```typescript
import { createCampaignModule } from '@omx-sdk/campaign';
import type { SupabaseClient } from '@supabase/supabase-js';

// Dependencies are prepared elsewhere (e.g., in core)
const supabase: SupabaseClient = /* initialized Supabase client */;
const teamId: string = /* current user's team ID */;

// Campaign module receives dependencies
const campaignModule = createCampaignModule(supabase, teamId);
```

### Campaign CRUD Operations

```typescript
// Create a new campaign (calls Edge Function)
const newCampaign = await campaignModule.createCampaign({
  name: "Summer Sale 2024",
  description: "Special summer promotion",
  industry: "ecommerce",
  target: "new-customers",
  startDate: "2024-06-01",
  sendTime: "10am",
  frequency: "once",
  fromName: "Your Store",
  fromEmail: "hello@yourstore.com",
  replyToEmail: "support@yourstore.com",
  primaryGoal: "sales",
  successMetric: "conversion-rate",
  targetValue: "15%",
  launchOption: "now",
  status: "active",
});

// List campaigns with filters (direct DB query)
const activeCampaigns = await campaignModule.listCampaigns({
  status: "active",
  industry: "ecommerce",
  search: "summer", // searches in campaign name
});

// Get specific campaign
const campaignDetails = await campaignModule.getCampaign("campaign-id");

// Update campaign
const updated = await campaignModule.updateCampaign("campaign-id", {
  name: "Updated Summer Sale 2024",
  targetValue: "20%",
});

// Change campaign status
await campaignModule.updateCampaignStatus("campaign-id", "paused");

// Duplicate campaign
const duplicated = await campaignModule.duplicateCampaign(
  "campaign-id",
  "Winter Sale 2024"
);

// Delete campaign
await campaignModule.deleteCampaign("campaign-id");
```

### Campaign Analytics

```typescript
// Get campaign statistics (counts by status)
const stats = await campaignModule.getCampaignStats();
console.log(stats);
// Output:
// {
//   totalCampaigns: 45,
//   activeCampaigns: 12,
//   draftCampaigns: 8,
//   completedCampaigns: 25
// }
```

### Campaign Execution (Mock Implementation)

```typescript
// Execute a campaign (returns mock data)
const executionResult = await campaignModule.executeCampaign("campaign-id", {
  source: "geotrigger",
  location: { lat: 37.5665, lng: 126.978 },
  userId: "user-123",
});
// Returns: { success: true, executionId: 'exec-campaign-id' }

// Get execution history (returns empty array - placeholder)
const executions = await campaignModule.getCampaignExecutions("campaign-id");
// Returns: []
```

## 🔧 Class Structure

### CampaignClient Class

```typescript
export class CampaignClient {
  private supabase: SupabaseClient;
  private teamId: string;

  constructor(supabase: SupabaseClient, teamId: string) {
    this.supabase = supabase;
    this.teamId = teamId;
  }

  // All methods automatically filter by teamId
  // CREATE operations use Edge Functions
  // READ/UPDATE/DELETE use direct Supabase queries
}
```

### Factory Function

```typescript
export function createCampaignModule(
  supabase: SupabaseClient,
  teamId?: string
): CampaignClient {
  return new CampaignClient(supabase, teamId ?? "");
}
```

## 🏗️ Hybrid Architecture

### CREATE Operations (Edge Function)

```typescript
// Calls SUPABASE_FN_BASE_URL/campaign-create
const response = await fetch(`${SUPABASE_FN_BASE_URL}/campaign-create`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ...data, teamId: this.teamId }),
});
```

### READ/UPDATE/DELETE Operations (Direct Query)

```typescript
// Direct Supabase query with automatic team filtering
const { data } = await this.supabase
  .from("business.campaigns")
  .select("*")
  .eq("team_id", this.teamId); // Auto-filtered by team
```

## 📁 Module Structure

```
packages/campaign/
├── src/
│   ├── index.ts          # CampaignClient class & factory function
│   └── types.ts          # TypeScript interfaces (imported)
└── README.md
```

## 🔧 Dependencies

### Core Dependencies

```typescript
// Only imports constants from core
import { SUPABASE_FN_BASE_URL } from "@omx-sdk/core";

// Type-only import (no runtime dependency)
import type { SupabaseClient } from "@supabase/supabase-js";
```

### TypeScript Interfaces

```typescript
import {
  CampaignData,
  CampaignUpdateData,
  CampaignFilters,
  CampaignStats,
} from "./types";
```

## 🎯 Team Isolation

All operations are automatically filtered by `teamId`:

```typescript
// Automatically adds team_id filter
.eq("team_id", this.teamId)
```

This ensures:

- ✅ Data security by design
- ✅ No cross-team data access
- ✅ Automatic multi-tenancy

## 🔒 Supabase Requirements

### Required Table Structure

**business.campaigns**

```sql
CREATE TABLE business.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL,
  name VARCHAR NOT NULL,
  description TEXT,
  industry VARCHAR,
  target VARCHAR,
  start_date TIMESTAMP,
  send_time VARCHAR,
  frequency VARCHAR,
  from_name VARCHAR,
  from_email VARCHAR,
  reply_to_email VARCHAR,
  primary_goal VARCHAR,
  success_metric VARCHAR,
  target_value VARCHAR,
  launch_option VARCHAR,
  scheduled_date TIMESTAMP,
  status VARCHAR DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Required Edge Function

**supabase/functions/campaign-create/index.ts**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { teamId, ...campaignData } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data, error } = await supabase
      .from("business.campaigns")
      .insert([
        {
          ...campaignData,
          team_id: teamId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

### RLS Policies (Optional)

Since all operations are filtered by `team_id` in application code, RLS is optional but recommended for extra security:

```sql
ALTER TABLE business.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_team_access" ON business.campaigns
FOR ALL USING (
  team_id IN (
    SELECT team_id
    FROM public.accounts
    WHERE id = auth.uid()
  )
);
```

## 🚦 Error Handling

All methods throw descriptive errors:

```typescript
try {
  const campaign = await campaignModule.createCampaign(data);
} catch (error) {
  console.error("Campaign creation failed:", error.message);
  // Handle error appropriately
}
```

## 📊 Current Implementation Status

### ✅ Implemented

- Full CRUD operations
- Team-based filtering
- Edge Function integration (create)
- Campaign statistics
- Campaign duplication

### 🚧 Mock/Placeholder

- `executeCampaign()`: Returns `{ success: true, executionId: 'exec-${id}' }`
- `getCampaignExecutions()`: Returns `[]`

### 🔜 Future Enhancements

- Real campaign execution via Edge Functions
- Execution history tracking
- Campaign performance analytics
- Integration with workflow engine

## 🎯 Architecture Benefits

- **✅ Zero strong dependencies**: Only constants imported from core
- **✅ High testability**: Easy to mock dependencies
- **✅ Flexible deployment**: Can be used with any Supabase instance
- **✅ Type safety**: Full TypeScript support
- **✅ Security by design**: Automatic team filtering
- **✅ Hybrid performance**: Edge Functions for sensitive ops, direct queries for speed
