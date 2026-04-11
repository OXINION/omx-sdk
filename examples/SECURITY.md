# Security Best Practices for OMX SDK Examples

## ⚠️ Important Security Notice

**NEVER** commit API keys, tokens, or other sensitive credentials to public repositories. This includes:
- Supabase anon keys
- Service keys  
- JWT tokens
- Client secrets

## Environment Setup

### 1. Copy Environment Template
```bash
cp .env.example .env
```

### 2. Fill in Your Credentials
Edit `.env` with your actual values:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
OMX_API_URL=https://your-omx-platform.com/api
OMX_CLIENT_ID=your_client_id_here
```

### 3. Verify .env is Gitignored
The `.env` file should **never** be committed to git. Verify it's in `.gitignore`:
```
.env
.env.local
.env.production
```

## For Browser Examples

Set configuration in your HTML:
```html
<script>
  // Set these BEFORE loading config.js
  window.SUPABASE_URL = 'https://your-project.supabase.co';
  window.SUPABASE_ANON_KEY = 'your_actual_key_here';
</script>
<script src="config.js"></script>
```

## For Node.js Examples

The `config.js` file will automatically load from `process.env`:
```javascript
const OMX_CONFIG = require('./config.js');
// Uses process.env.SUPABASE_ANON_KEY automatically
```

## Rotating Compromised Keys

If you accidentally expose keys:

1. **Immediately rotate** the key in Supabase dashboard
2. **Update** all environments with the new key  
3. **Check git history** for any committed keys
4. **Force push** to remove from git history if needed

## Row Level Security (RLS)

Always enable RLS on sensitive Supabase tables:
```sql
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Create appropriate policies
CREATE POLICY "Users can only access their own data" 
ON your_table FOR ALL 
USING (auth.uid() = user_id);
```

## Production Deployment

- Use environment variables in production
- Enable CORS properly for your domain
- Use HTTPS only
- Monitor API usage for unusual patterns

## Additional Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/overview#security-best-practices)
- [OMX Platform Security Guide](https://your-platform-docs.com/security)