# @omx-sdk/core

The foundation module that provides authentication for all other OMX SDK modules.

<https://www.npmjs.com/package/@omx-sdk/core>

## Installation

```bash
npm install @omx-sdk/core
```

## Basic Usage

```js
import { createOmxClient } from "@omx-sdk/core";

// Initialize with your business credentials
const omx = createOmxClient({
  clientId: "your_client_id",
  secretKey: "your_secret_key",
});
```

## Core Methods

```js
// Check authentication status (optional)
const tokenInfo = omx.auth.getTokenInfo();
console.log("Authenticated:", tokenInfo.isValid);

// Clear token when logging out
omx.auth.clearToken();
```

## What This Module Does

- ✅ **Authentication** - Manages JWT tokens with your backend
- ✅ **Foundation** - Provides auth for other SDK modules
- ✅ **Configuration** - Handles SDK settings
- ✅ **Error Handling** - Standardized error types

## What This Module Does NOT Do

- ❌ **Business Logic** - Use `@omx-sdk/workflow`, `@omx-sdk/campaign`, etc.
- ❌ **Direct Database Access** - Users can't access your Supabase
- ❌ **UI Components** - This is a backend SDK
