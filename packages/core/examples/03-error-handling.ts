/**
 * Example const config: AuthConfig = {
  clientId: 'your-business-client-id',
  secretKey: 'your-business-secret-key', // Contact your administrator for credentials
};mprehensive Error Handling
 */

import {
  AuthConfig,
  ConfigurationError,
  CoreAuth,
  InvalidCredentialsError,
  NetworkError,
  RateLimitError,
  TokenExpiredError,
} from '@omx-sdk/core';

const config: AuthConfig = {
  clientId: 'your-business-client-id',
  secretKey: 'your-business-secret-key',
};

async function errorHandlingExample() {
  const auth = new CoreAuth(config);

  try {
    console.log('🔍 Testing error handling scenarios...');

    // Scenario 1: Handle invalid credentials
    await handleInvalidCredentials();

    // Scenario 2: Handle network errors
    await handleNetworkErrors(auth);

    // Scenario 3: Handle rate limiting
    await handleRateLimiting(auth);

    // Scenario 4: Handle token expiration
    await handleTokenExpiration(auth);

    // Scenario 5: Handle configuration errors
    await handleConfigurationErrors();
  } catch (error) {
    console.error('❌ Unexpected error in examples:', error);
  } finally {
    auth.dispose();
  }
}

async function handleInvalidCredentials() {
  console.log('\n🔐 Testing invalid credentials...');

  const invalidConfig: AuthConfig = {
    clientId: 'invalid-client-id',
    secretKey: 'invalid-secret-key',
  };

  const invalidAuth = new CoreAuth(invalidConfig);

  try {
    await invalidAuth.getToken();
    console.log('❌ Expected invalid credentials error but got success');
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      console.log(
        '✅ Invalid credentials error handled correctly:',
        error.message
      );
      console.log('📊 Error details:', {
        code: error.code,
        statusCode: error.statusCode,
      });
    } else {
      console.error('❌ Unexpected error type:', error);
    }
  } finally {
    invalidAuth.dispose();
  }
}

async function handleNetworkErrors(auth: CoreAuth) {
  console.log('\n🌐 Testing network errors...');

  try {
    // Try to make a request to an unreachable endpoint
    await auth.makeAuthenticatedRequest(
      'https://unreachable.invalid.domain/api',
      {
        method: 'GET',
        timeout: 5000,
        retries: 1, // Reduce retries for faster testing
      }
    );
    console.log('❌ Expected network error but got success');
  } catch (error) {
    if (error instanceof NetworkError) {
      console.log('✅ Network error handled correctly:', error.message);
      console.log('📊 Error details:', {
        code: error.code,
        details: error.details,
      });
    } else {
      console.error('❌ Unexpected error type:', error);
    }
  }
}

async function handleRateLimiting(auth: CoreAuth) {
  console.log('\n⏱️ Testing rate limiting (simulated)...');

  // This would typically be tested with a real API that enforces rate limits
  // For demonstration, we'll show how to handle RateLimitError
  try {
    // Simulate rate limit response
    const mockRateLimitError = new RateLimitError('Rate limit exceeded', 60000);
    throw mockRateLimitError;
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.log('✅ Rate limit error handled correctly:', error.message);
      console.log('📊 Error details:', {
        code: error.code,
        statusCode: error.statusCode,
        retryAfter: error.details?.retryAfter,
      });

      // In real implementation, you would wait for the retry period
      console.log(
        `⏳ Would wait ${error.details?.retryAfter / 1000} seconds before retrying`
      );
    }
  }
}

async function handleTokenExpiration(auth: CoreAuth) {
  console.log('\n⏰ Testing token expiration handling...');

  try {
    // Get a token first
    await auth.getToken();
    console.log('✅ Initial token obtained');

    // Clear the token to simulate expiration
    auth.clearToken();
    console.log('🔄 Token cleared (simulating expiration)');

    // Try to make a request (should automatically refresh token)
    const response = await auth.makeAuthenticatedRequest(
      'https://httpbin.org/get',
      {
        method: 'GET',
        timeout: 10000,
      }
    );

    if (response.success) {
      console.log('✅ Token automatically refreshed and request succeeded');
    } else {
      console.log('❌ Request failed after token refresh:', response.error);
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.log(
        '✅ Token expiration error handled correctly:',
        error.message
      );
    } else {
      console.error('❌ Unexpected error during token refresh:', error);
    }
  }
}

async function handleConfigurationErrors() {
  console.log('\n⚙️ Testing configuration errors...');

  const invalidConfigs = [
    {
      name: 'Missing clientId',
      config: {
        secretKey: 'valid-secret',
        supabaseUrl: 'https://valid.supabase.co',
        supabaseAnonKey: 'valid-anon-key',
      } as any,
    },
    {
      name: 'Invalid supabaseFnUrl',
      config: {
        clientId: 'valid-client',
        secretKey: 'valid-secret',
        supabaseFnUrl: 'not-a-valid-url',
      },
    },
    {
      name: 'Missing secretKey',
      config: {
        clientId: 'valid-client',
        supabaseFnUrl:
          'https://valid.supabase.co/functions/v1/create-jwt-token',
      } as any,
    },
  ];

  for (const { name, config } of invalidConfigs) {
    try {
      new CoreAuth(config);
      console.log(
        `❌ Expected configuration error for ${name} but got success`
      );
    } catch (error) {
      if (error instanceof ConfigurationError) {
        console.log(
          `✅ Configuration error for ${name} handled correctly:`,
          error.message
        );
      } else {
        console.error(`❌ Unexpected error type for ${name}:`, error);
      }
    }
  }
}

// Helper function to demonstrate graceful error recovery
async function resilientApiCall(auth: CoreAuth, url: string, maxAttempts = 3) {
  console.log(`\n🔄 Making resilient API call to ${url}...`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`📞 Attempt ${attempt}/${maxAttempts}`);

      const response = await auth.makeAuthenticatedRequest(url, {
        method: 'GET',
        timeout: 10000,
        retries: 1, // Use our own retry logic
      });

      if (response.success) {
        console.log(`✅ Success on attempt ${attempt}`);
        return response.data;
      } else {
        console.log(`⚠️ Failed attempt ${attempt}:`, response.error?.message);
      }
    } catch (error) {
      console.log(
        `❌ Error on attempt ${attempt}:`,
        error instanceof Error ? error.message : error
      );

      // Handle specific error types with different strategies
      if (error instanceof InvalidCredentialsError) {
        console.log('🔐 Invalid credentials - stopping retries');
        throw error;
      }

      if (error instanceof RateLimitError && attempt < maxAttempts) {
        const waitTime = error.details?.retryAfter || 1000;
        console.log(
          `⏳ Rate limited - waiting ${waitTime / 1000}s before retry`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      if (error instanceof NetworkError && attempt < maxAttempts) {
        const waitTime = 1000 * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(
          `🌐 Network error - waiting ${waitTime / 1000}s before retry`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      // If it's the last attempt or non-retryable error, throw
      if (attempt === maxAttempts) {
        console.log(`❌ All ${maxAttempts} attempts failed`);
        throw error;
      }
    }
  }
}

export {
  errorHandlingExample,
  handleConfigurationErrors,
  handleInvalidCredentials,
  handleNetworkErrors,
  handleRateLimiting,
  handleTokenExpiration,
  resilientApiCall,
};
