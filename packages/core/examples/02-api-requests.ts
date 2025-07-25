/**
 *const config: AuthConfig = {
  clientId: 'your-business-client-id',
  secretKey: 'your-business-secret-key', // Get this from omx.oxinion.com dashboard
};ple 2: Making Authenticated API Requests with Automatic Token Refresh
 */

import { ApiResponse, AuthConfig, CoreAuth } from '@omx-sdk/core';

const config: AuthConfig = {
  clientId: 'your-business-client-id',
  secretKey: 'your-business-secret-key',
};

interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  metadata?: Record<string, any>;
}

async function authenticatedApiRequestsExample() {
  const auth = new CoreAuth(config);

  try {
    console.log('🚀 Making authenticated API requests...');

    // Example 1: GET request to fetch user profile
    console.log('📖 Fetching user profile...');
    const profileResponse: ApiResponse<UserProfile> =
      await auth.makeAuthenticatedRequest(
        'https://api.yourdomain.com/v1/profile',
        {
          method: 'GET',
          timeout: 10000,
        }
      );

    if (profileResponse.success) {
      console.log('✅ Profile fetched:', profileResponse.data);
    } else {
      console.error('❌ Failed to fetch profile:', profileResponse.error);
    }

    // Example 2: POST request to create a new user
    console.log('👤 Creating new user...');
    const newUser: CreateUserRequest = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      metadata: {
        source: 'omx-sdk',
        timestamp: new Date().toISOString(),
      },
    };

    const createResponse: ApiResponse<UserProfile> =
      await auth.makeAuthenticatedRequest(
        'https://api.yourdomain.com/v1/users',
        {
          method: 'POST',
          body: newUser,
          headers: {
            'X-Source': 'OMX-SDK',
          },
          timeout: 15000,
          retries: 2,
        }
      );

    if (createResponse.success) {
      console.log('✅ User created:', createResponse.data);
    } else {
      console.error('❌ Failed to create user:', createResponse.error);
    }

    // Example 3: PUT request to update user
    console.log('📝 Updating user...');
    const updateData = {
      name: 'John Smith',
      metadata: {
        updated_at: new Date().toISOString(),
        updated_via: 'omx-sdk',
      },
    };

    const updateResponse: ApiResponse<UserProfile> =
      await auth.makeAuthenticatedRequest(
        'https://api.yourdomain.com/v1/users/123',
        {
          method: 'PUT',
          body: updateData,
        }
      );

    if (updateResponse.success) {
      console.log('✅ User updated:', updateResponse.data);
    } else {
      console.error('❌ Failed to update user:', updateResponse.error);
    }

    // Example 4: DELETE request
    console.log('🗑️ Deleting temporary resource...');
    const deleteResponse: ApiResponse<void> =
      await auth.makeAuthenticatedRequest(
        'https://api.yourdomain.com/v1/temp-resource/456',
        {
          method: 'DELETE',
        }
      );

    if (deleteResponse.success) {
      console.log('✅ Resource deleted successfully');
    } else {
      console.error('❌ Failed to delete resource:', deleteResponse.error);
    }

    // Example 5: Handling file upload with custom headers
    console.log('📤 Uploading file...');
    const fileData = new FormData();
    fileData.append(
      'file',
      new Blob(['test content'], { type: 'text/plain' }),
      'test.txt'
    );

    const uploadResponse: ApiResponse<{ fileId: string; url: string }> =
      await auth.makeAuthenticatedRequest(
        'https://api.yourdomain.com/v1/upload',
        {
          method: 'POST',
          body: fileData,
          headers: {
            // Don't set Content-Type for FormData, let the browser set it
          },
        }
      );

    if (uploadResponse.success) {
      console.log('✅ File uploaded:', uploadResponse.data);
    } else {
      console.error('❌ Failed to upload file:', uploadResponse.error);
    }
  } catch (error) {
    console.error('❌ API request failed:', error);
  } finally {
    // Clean up
    auth.dispose();
  }
}

// Advanced usage: Custom retry logic for specific endpoints
async function advancedRetryExample() {
  const auth = new CoreAuth(config);

  try {
    // Example with custom retry logic for critical operations
    const criticalData = { important: 'data' };

    const response = await auth.makeAuthenticatedRequest(
      'https://api.yourdomain.com/v1/critical-operation',
      {
        method: 'POST',
        body: criticalData,
        timeout: 30000, // 30 second timeout for critical operations
        retries: 5, // More retries for critical operations
      }
    );

    if (response.success) {
      console.log('✅ Critical operation completed:', response.data);
    } else {
      console.error(
        '❌ Critical operation failed after all retries:',
        response.error
      );
      // Handle critical failure (e.g., alert admin, fallback procedure)
    }
  } catch (error) {
    console.error('❌ Critical operation error:', error);
    // Emergency handling
  } finally {
    auth.dispose();
  }
}

export { advancedRetryExample, authenticatedApiRequestsExample };
