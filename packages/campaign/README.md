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
npm install @omx-sdk/campaign
```

> **Note**: @omx-sdk/campaign depends on @omx-sdk/core, which will be automatically installed.

## 🏗️ Architecture Pattern

This module uses **Edge Function-only architecture** for clean separation:

- **No direct Supabase client** dependency
- **Only constants** imported: `SUPABASE_FN_BASE_URL`
- **Authentication via Edge Functions**: Uses clientId/secretKey → JWT token flow
- **All operations** go through Edge Functions for security

## 📖 Usage

### Basic Setup (Edge Function Architecture)

```typescript
import { createCampaignClient } from '@omx-sdk/campaign';

// Create campaign client with your credentials
const campaignClient = createCampaignClient({
  clientId: "your-client-id",
  secretKey: "your-secret-key",
  teamId: "your-team-id", // optional, defaults to auto-generated
});

// All operations are automatically authenticated via Edge Functions
const campaigns = await campaignClient.listCampaigns();
```

### Campaign CRUD Operations

```typescript
// Create a new campaign (calls Edge Function)
const newCampaign = await campaignClient.createCampaign({
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

// List campaigns with filters (via Edge Function)
const activeCampaigns = await campaignClient.listCampaigns({
  status: "active",
  industry: "ecommerce",
  search: "summer", // searches in campaign name
});

// Get specific campaign
const campaignDetails = await campaignClient.getCampaign("campaign-id");

// Update campaign
const updated = await campaignClient.updateCampaign("campaign-id", {
  name: "Updated Summer Sale 2024",
  targetValue: "20%",
});

// Change campaign status
await campaignClient.updateCampaignStatus("campaign-id", "paused");

// Duplicate campaign
const duplicated = await campaignClient.duplicateCampaign(
  "campaign-id",
  "Winter Sale 2024"
);

// Delete campaign
await campaignClient.deleteCampaign("campaign-id");
```

### Campaign Analytics

```typescript
// Get campaign statistics (counts by status)
const stats = await campaignClient.getCampaignStats();
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
const executionResult = await campaignClient.executeCampaign("campaign-id", {
  source: "geotrigger",
  location: { lat: 37.5665, lng: 126.978 },
  userId: "user-123",
});
// Returns: { success: true, executionId: 'exec-campaign-id' }

// Get execution history (returns empty array - placeholder)
const executions = await campaignClient.getCampaignExecutions("campaign-id");
// Returns: []
```

## 🔧 Class Structure

### CampaignClient Class

```typescript
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

  // All methods automatically authenticate via Edge Functions
  // All operations go through Edge Functions (no direct DB access)
}
```

### Factory Function

```typescript
export function createCampaignClient(config: {
  clientId: string;
  secretKey: string;
  teamId?: string;
}): CampaignClient {
  return new CampaignClient(config);
}
```

## 🏗️ Edge Function Architecture

### All Operations (Edge Function)

```typescript
// All operations go through Edge Functions with JWT authentication
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
```

### Authentication Flow

```typescript
// JWT token is automatically managed
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

    const data = await response.json();
    this.authToken = data.token;
  }
  return this.authToken;
}
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

### Minimal Dependencies

```typescript
// Only imports constants from core
import { SUPABASE_FN_BASE_URL } from "@omx-sdk/core";
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
  const campaign = await campaignClient.createCampaign(data);
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

- **✅ Zero runtime dependencies**: Only constants imported from core
- **✅ High security**: All operations via authenticated Edge Functions
- **✅ Easy to use**: Simple clientId/secretKey authentication
- **✅ Type safety**: Full TypeScript support
- **✅ Auto team isolation**: All operations automatically filtered by teamId
- **✅ Pure Edge Function**: No direct database access from client
- **✅ JWT token management**: Automatic authentication token handling
