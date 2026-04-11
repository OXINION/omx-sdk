// Configuration loader for OMX SDK examples
// This file safely loads environment variables and provides fallbacks

// For browser environments, you can set these on window object
// For Node.js environments, use process.env
const config = {
  // Supabase configuration
  SUPABASE_URL: typeof window !== 'undefined' 
    ? window.SUPABASE_URL || 'https://blhilidnsybhfdmwqsrx.supabase.co'
    : process.env.SUPABASE_URL || 'https://blhilidnsybhfdmwqsrx.supabase.co',
    
  SUPABASE_ANON_KEY: typeof window !== 'undefined'
    ? window.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE'
    : process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE',
    
  // OMX Platform configuration
  OMX_API_URL: typeof window !== 'undefined'
    ? window.OMX_API_URL || 'https://your-omx-platform.com/api'
    : process.env.OMX_API_URL || 'https://your-omx-platform.com/api',
    
  OMX_CLIENT_ID: typeof window !== 'undefined'
    ? window.OMX_CLIENT_ID || 'YOUR_CLIENT_ID_HERE'
    : process.env.OMX_CLIENT_ID || 'YOUR_CLIENT_ID_HERE'
};

// Validation warnings
if (config.SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
  console.warn('⚠️  Please set your SUPABASE_ANON_KEY in environment variables or window object');
}

if (config.OMX_CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
  console.warn('⚠️  Please set your OMX_CLIENT_ID in environment variables or window object');
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
} else if (typeof window !== 'undefined') {
  window.OMX_CONFIG = config;
}