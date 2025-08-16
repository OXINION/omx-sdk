# @omx-sdk/geotrigger

Geotrigger management module for the OMX platform. Provides comprehensive CRUD operations and location-based trigger capabilities using dependency injection pattern.

## Deployment

```bash
npm publish packages/geotrigger
```

## ✅ Features

| Feature                   | Method Example                           | Description                                                          |
| ------------------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| **Create Geotrigger**     | `createGeotrigger(data)`                 | Creates a new location-based trigger (via Edge Function)            |
| **List Geotriggers**      | `listGeotriggers(filters?)`              | Fetches geotriggers with optional filtering (status, type, search)  |
| **Get Geotrigger**        | `getGeotrigger(id)`                      | Retrieves a specific geotrigger by ID                               |
| **Update Geotrigger**     | `updateGeotrigger(id, updates)`          | Updates geotrigger details                                           |
| **Delete Geotrigger**     | `deleteGeotrigger(id)`                   | Removes a geotrigger                                                 |
| **Status Management**     | `updateGeotriggerStatus(id, status)`     | Changes geotrigger status                                            |
| **Duplicate Geotrigger**  | `duplicateGeotrigger(id, newName?)`      | Creates a copy of existing geotrigger                                |
| **Geotrigger Stats**      | `getGeotriggerStats()`                   | Gets geotrigger statistics and metrics                              |
| **Browser Monitoring**    | `startMonitoring(callback)`              | Starts real-time location monitoring (browser only)                 |
| **Location Services**     | `getCurrentLocation()`                   | Gets current location (browser only)                                |

## 🚀 Installation

```bash
npm install @omx-sdk/geotrigger
```

> **Note**: @omx-sdk/geotrigger has zero dependencies and works standalone.

## 🏗️ Architecture Pattern

This module uses **Edge Function-only architecture** for complete independence:

- **Zero dependencies**: No external package dependencies
- **Hardcoded constants**: Supabase Edge Function URL included directly
- **Authentication via Edge Functions**: Uses clientId/secretKey → JWT token flow
- **All operations** go through Edge Functions for security

## 📖 Usage

### Basic Setup (Zero Dependency Architecture)

```typescript
import { createGeotriggerClient } from "@omx-sdk/geotrigger";

// Create geotrigger client with your credentials
const geotriggerClient = createGeotriggerClient({
  clientId: "your-client-id",
  secretKey: "your-secret-key",
  teamId: "your-team-id", // optional, defaults to auto-generated
});

// All operations are automatically authenticated via Edge Functions
const geotriggers = await geotriggerClient.listGeotriggers();
```

### Geotrigger CRUD Operations

```typescript
// Create a new geotrigger (calls Edge Function)
const newGeotrigger = await geotriggerClient.createGeotrigger({
  name: "Coffee Shop Alert",
  description: "Trigger when near favorite coffee shop",
  location: {
    latitude: 37.7749,
    longitude: -122.4194,
  },
  radius: 100, // meters
  event_type: "webhook",
  event_payload: {
    webhook_url: "https://your-app.com/webhook",
    message: "Welcome to our coffee shop!",
  },
  status: "active",
});

// List geotriggers with filters (via Edge Function)
const activeGeotriggers = await geotriggerClient.listGeotriggers({
  status: "active",
  event_type: "webhook",
  search: "coffee", // searches in geotrigger name
});

// Get specific geotrigger
const geotriggerDetails = await geotriggerClient.getGeotrigger("geotrigger-id");

// Update geotrigger
const updated = await geotriggerClient.updateGeotrigger("geotrigger-id", {
  name: "Updated Coffee Shop Alert",
  radius: 150,
});

// Change geotrigger status
await geotriggerClient.updateGeotriggerStatus("geotrigger-id", "inactive");

// Duplicate geotrigger
const duplicated = await geotriggerClient.duplicateGeotrigger(
  "geotrigger-id",
  "Coffee Shop Alert (Copy)"
);

// Delete geotrigger
await geotriggerClient.deleteGeotrigger("geotrigger-id");
```

### Geotrigger Analytics

```typescript
// Get geotrigger statistics (counts by status)
const stats = await geotriggerClient.getGeotriggerStats();
console.log(stats);
// Output:
// {
//   totalGeotriggers: 25,
//   activeGeotriggers: 12,
//   inactiveGeotriggers: 13,
//   teamId: "team-xyz"
// }
```

### Browser-based Location Monitoring

```typescript
// Add geofence regions for browser monitoring
geotriggerClient.addRegion({
  id: "office",
  center: {
    latitude: 37.7749,
    longitude: -122.4194,
  },
  radius: 100, // meters
  name: "Office Building",
});

// Start monitoring geofences (browser only)
await geotriggerClient.startMonitoring((event) => {
  console.log(`Geofence ${event.type}: ${event.regionId}`, event);
});

// Get current location (browser only)
const location = await geotriggerClient.getCurrentLocation();
console.log("Current location:", location);

// Stop monitoring
geotriggerClient.stopMonitoring();
```

## 🔧 Class Structure

### GeotriggerClient Class

```typescript
export class GeotriggerClient {
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
    this.teamId = config.teamId || generateUUID();
  }

  // All methods automatically authenticate via Edge Functions
  // All operations go through Edge Functions (no direct DB access)
}
```

### Factory Function

```typescript
export function createGeotriggerClient(config: {
  clientId: string;
  secretKey: string;
  teamId?: string;
}): GeotriggerClient {
  return new GeotriggerClient(config);
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
packages/geotrigger/
├── src/
│   ├── index.ts          # GeotriggerClient class & factory function
│   └── types.ts          # TypeScript interfaces
└── README.md
```

## 🔧 Dependencies

### Zero Dependencies

```typescript
// No external dependencies - completely standalone
const SUPABASE_FN_BASE_URL =
  "https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1";
```

### TypeScript Interfaces

```typescript
import {
  GeotriggerData,
  GeotriggerUpdateData,
  GeotriggerFilters,
  GeotriggerStats,
  Location,
  GeofenceRegion,
  TriggerEvent,
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

**omx.workflow_nodes**

```sql
CREATE TABLE omx.workflow_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL, -- References business.workflows(id)
  type VARCHAR NOT NULL, -- 'geotrigger' for geotrigger nodes
  config JSONB, -- stores geotrigger-specific configuration
  position JSONB, -- UI position data
  node_key VARCHAR, -- unique node identifier
  module_instance_id UUID, -- References business.module_instances(id)
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Geotrigger config structure:
-- {
--   "name": "Coffee Shop Trigger",
--   "description": "Trigger when near coffee shop",
--   "team_id": "uuid", -- stored here for filtering since not in table
--   "location": { "latitude": 37.7749, "longitude": -122.4194 },
--   "coordinates": "POINT(-122.4194 37.7749)", -- PostGIS format
--   "radius": 100,
--   "event_type": "webhook",
--   "event_payload": { "webhook_url": "https://...", "message": "..." },
--   "status": "active"
-- }

-- Add indexes for efficient queries
CREATE INDEX idx_workflow_nodes_type ON omx.workflow_nodes (type);
CREATE INDEX idx_workflow_nodes_workflow_id ON omx.workflow_nodes (workflow_id);
CREATE INDEX idx_workflow_nodes_config_gin ON omx.workflow_nodes USING GIN (config);
```

### Required Edge Function

**supabase/functions/database-access/index.ts** (handles geotriggers via workflow_nodes)

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { table, schema, action, data, filters } = await req.json();
    
    // Handle geotrigger operations through workflow_nodes
    if (table === "workflow_nodes" && schema === "omx") {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      switch (action) {
        case "create":
          // Create geotrigger as workflow node
          const { data: created, error: createError } = await supabase
            .from("omx.workflow_nodes")
            .insert([{
              workflow_id: data.workflow_id,
              type: "geotrigger",
              config: {
                name: data.config.name,
                description: data.config.description,
                team_id: data.config.team_id,
                location: data.config.location,
                coordinates: data.config.coordinates,
                radius: data.config.radius,
                event_type: data.config.event_type,
                event_payload: data.config.event_payload,
                status: data.config.status || "active",
              },
              position: data.position || { x: 0, y: 0 },
              node_key: data.node_key,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }])
            .select()
            .single();

          if (createError) throw createError;
          return new Response(JSON.stringify({ success: true, data: created }));

        case "update":
          // Update geotrigger workflow node
          const { data: updated, error: updateError } = await supabase
            .from("omx.workflow_nodes")
            .update({
              config: data.config,
              updated_at: new Date().toISOString(),
            })
            .match(filters)
            .select()
            .single();

          if (updateError) throw updateError;
          return new Response(JSON.stringify({ success: true, data: updated }));

        case "delete":
          // Delete geotrigger workflow node
          const { error: deleteError } = await supabase
            .from("omx.workflow_nodes")
            .delete()
            .match(filters);

          if (deleteError) throw deleteError;
          return new Response(JSON.stringify({ success: true }));

        default:
          // List/get geotrigger workflow nodes
          const { data: results, error: selectError } = await supabase
            .from("omx.workflow_nodes")
            .select("*")
            .match(filters)
            .order("created_at", { ascending: false });

          if (selectError) throw selectError;
          return new Response(JSON.stringify({ success: true, data: results }));
      }
    }

    return new Response(JSON.stringify({ error: "Invalid table/schema" }), {
      status: 400,
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
ALTER TABLE omx.workflow_nodes ENABLE ROW LEVEL SECURITY;

-- Access through workflow -> team relationship
CREATE POLICY "workflow_nodes_team_access" ON omx.workflow_nodes
FOR ALL USING (
  workflow_id IN (
    SELECT id
    FROM business.workflows
    WHERE team_id IN (
      SELECT team_id
      FROM public.accounts
      WHERE id = auth.uid()
    )
  )
);

-- Additional policy for geotrigger-specific nodes
CREATE POLICY "geotrigger_nodes_access" ON omx.workflow_nodes
FOR ALL USING (
  type = 'geotrigger' AND workflow_id IN (
    SELECT id
    FROM business.workflows
    WHERE team_id IN (
      SELECT team_id
      FROM public.accounts
      WHERE id = auth.uid()
    )
  )
);
```

## 🚦 Error Handling

All methods throw descriptive errors:

```typescript
try {
  const geotrigger = await geotriggerClient.createGeotrigger(data);
} catch (error) {
  console.error("Geotrigger creation failed:", error.message);
  // Handle error appropriately
}
```

## 📊 Current Implementation Status

### ✅ Implemented

- Full CRUD operations
- Team-based filtering
- Edge Function integration
- Geotrigger statistics
- Geotrigger duplication
- Browser-based location monitoring
- Real-time geofence detection

### 🔜 Future Enhancements

- Advanced spatial queries
- Geotrigger execution history
- Performance analytics
- Integration with campaign triggers
- Mobile app SDK support

## 🎯 Architecture Benefits

- **✅ Zero dependencies**: Completely standalone package
- **✅ High security**: All operations via authenticated Edge Functions
- **✅ Easy to use**: Simple clientId/secretKey authentication
- **✅ Type safety**: Full TypeScript support
- **✅ Auto team isolation**: All operations automatically filtered by teamId
- **✅ Pure Edge Function**: No direct database access from client
- **✅ JWT token management**: Automatic authentication token handling
- **✅ No version conflicts**: No dependency on other OMX SDK packages
- **✅ Browser compatibility**: Real-time location monitoring support

## API Reference

### GeotriggerData Interface

```typescript
interface GeotriggerData {
  id?: string;
  team_id: string;
  name: string;
  description?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  coordinates?: string; // PostGIS POINT format
  radius: number; // meters
  event_type?: "webhook" | "email" | "campaign";
  event_payload?: any;
  status?: "active" | "inactive";
}
```

### Location Interface

```typescript
interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
```

### GeofenceRegion Interface

```typescript
interface GeofenceRegion {
  id: string;
  center: Location;
  radius: number; // meters
  name?: string;
}
```

### TriggerEvent Interface

```typescript
interface TriggerEvent {
  regionId: string;
  type: "enter" | "exit";
  location: Location;
  timestamp: Date;
}
```

## License

MIT