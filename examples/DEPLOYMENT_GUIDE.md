# 🚀 Supabase Edge Function Deployment Guide

## Current Issue

You're getting a `401 Unauthorized` error with missing CORS headers because the Edge Function is not properly deployed or configured.

## Step-by-Step Fix

### 1. **Install Supabase CLI**

```bash
npm install -g supabase
# or
brew install supabase
```

### 2. **Login to Supabase**

```bash
supabase login
```

### 3. **Initialize Your Project**

```bash
cd /path/to/your/project
supabase init
```

### 4. **Create the Edge Function**

```bash
supabase functions new create-jwt-token
```

### 5. **Replace the Function Code**

Copy the content from `create-jwt-token-fixed.ts` into:

```
supabase/functions/create-jwt-token/index.ts
```

### 6. **Set Environment Variables**

In your Supabase Dashboard:

- Go to Settings → Edge Functions
- Add these environment variables:
  - `SUPABASE_URL`: Your project URL
  - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

### 7. **Deploy the Function**

```bash
supabase functions deploy create-jwt-token --project-ref YOUR_PROJECT_REF
```

### 8. **Test the Deployment**

The function should be available at:

```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-jwt-token
```

## Expected Database Schema

Make sure you have this table in the `business` schema:

```sql
-- Create the business schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS business;

-- Create the api_keys table
CREATE TABLE business.api_keys (
    id SERIAL PRIMARY KEY,
    client_id UUID NOT NULL UNIQUE,
    secret_key UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Insert your test data
INSERT INTO business.api_keys (client_id, secret_key) VALUES (
    'f7b294c9-12d1-477b-b454-552dedd28de3',
    '87654321-4321-4321-4321-987654321cba'
);
```

## Testing Steps

1. **Test CORS first**: Click "🌐 Test CORS" in the HTML demo
2. **Check OPTIONS response**: Should return 200 with proper CORS headers
3. **Test authentication**: Click "🔐 Test Authentication"
4. **Verify JWT token**: Should receive a valid token response

## Troubleshooting

### If you get "Function not found":

- Check the function is deployed: `supabase functions list`
- Verify the URL matches your project

### If you get "Invalid credentials":

- Verify the data exists in `business.api_keys` table
- Check the schema name is correct

### If you get CORS errors:

- Ensure the function includes proper CORS headers
- Check the OPTIONS handler is working

## Expected Success Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2IyOTRjOS0xMmQxLTQ3N2ItYjQ1NC01NTJkZWRkMjhkZTMiLCJpYXQiOjE3MzY3OTcyMDAsImV4cCI6MTczNjgwNDQwMCwiY2xpZW50X2lkIjoiZjdiMjk0YzktMTJkMS00NzdiLWI0NTQtNTUyZGVkZDI4ZGUzIn0.signature"
}
```
