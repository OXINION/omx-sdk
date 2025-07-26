import OMX from 'omx-sdk';

// Test configuration with clientId and secretKey
const config = {
  clientId: 'f7b294c9-12d1-477b-b454-552dedd28de3',
  secretKey: '87654321-4321-4321-4321-987654321cba',
};

// const omx = new OMXSDK(config); // Removed unused variable

async function testOMXInitialization() {
  console.log('🚀 Testing OMX SDK Initialization...');
  console.log('📋 Config:', {
    clientId: config.clientId,
    secretKey: config.secretKey.substring(0, 8) + '...', // Hide full secret in logs
  });

  try {
    // Test the OMX.initialize function
    console.log('\n🔐 Calling OMX.initialize()...');
    console.log(
      '📡 POST https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1/create-jwt-token'
    );
    console.log(
      '📦 Body:',
      JSON.stringify(
        {
          clientId: config.clientId,
          secretKey: '[HIDDEN]',
        },
        null,
        2
      )
    );

    const sdkInstance = await OMX.initialize(config);

    // Success case
    console.log('\n✅ OMX SDK initialized successfully!');
    console.log('🎟️ JWT Token obtained and stored internally');
    console.log('📦 SDK Instance created with authenticated connection');
    console.log('ℹ️ Token is automatically used for all subsequent API calls');

    return sdkInstance;
  } catch (error) {
    // Error handling with type checking
    const err = error as any; // Type assertion for error handling
    console.error('\n❌ OMX SDK initialization failed!');
    console.error('📄 Error details:', {
      message: err.message || 'Unknown error',
      status: err.status || 'Unknown',
      code: err.code || 'Unknown',
    });

    // Handle specific error cases
    if (err.message?.includes('invalid credentials')) {
      console.error('🔑 Authentication failed: Invalid clientId or secretKey');
      console.error(
        '💡 Please verify your credentials from omx.oxinion.com/token'
      );
    } else if (
      err.message?.includes('network') ||
      err.message?.includes('fetch')
    ) {
      console.error(
        '🌐 Network error: Could not reach authentication endpoint'
      );
      console.error('💡 Please check your internet connection and try again');
    } else if (err.message?.includes('timeout')) {
      console.error('⏰ Request timeout: Authentication took too long');
      console.error('💡 Please try again or check server status');
    } else if (err.status === 401) {
      console.error('🚫 Unauthorized: Invalid credentials provided');
    } else if (err.status === 500) {
      console.error(
        '🔧 Server error: Authentication service is experiencing issues'
      );
    }

    throw error;
  }
}

async function testDifferentScenarios() {
  console.log('\n🧪 Testing different authentication scenarios...\n');

  // Scenario 1: Valid credentials (main test)
  console.log('📝 Scenario 1: Valid credentials');
  try {
    const sdkInstance = await testOMXInitialization();
    console.log('✅ Scenario 1 passed\n');
    return sdkInstance;
  } catch (error) {
    console.log('❌ Scenario 1 failed\n');
  }

  // Scenario 2: Invalid clientId
  console.log('📝 Scenario 2: Invalid clientId');
  try {
    await OMX.initialize({
      clientId: 'invalid-client-id',
      secretKey: config.secretKey,
    });
    console.log("❌ Scenario 2: Should have failed but didn't\n");
  } catch (error) {
    console.log('✅ Scenario 2: Correctly rejected invalid clientId\n');
  }

  // Scenario 3: Invalid secretKey
  console.log('📝 Scenario 3: Invalid secretKey');
  try {
    await OMX.initialize({
      clientId: config.clientId,
      secretKey: 'invalid-secret-key',
    });
    console.log("❌ Scenario 3: Should have failed but didn't\n");
  } catch (error) {
    console.log('✅ Scenario 3: Correctly rejected invalid secretKey\n');
  }

  // Scenario 4: Empty credentials
  console.log('📝 Scenario 4: Empty credentials');
  try {
    await OMX.initialize({
      clientId: '',
      secretKey: '',
    });
    console.log("❌ Scenario 4: Should have failed but didn't\n");
  } catch (error) {
    console.log('✅ Scenario 4: Correctly rejected empty credentials\n');
  }

  // Return null if all scenarios failed
  console.log('❌ All authentication scenarios failed');
  return null;
}

async function main() {
  try {
    console.log('🎯 OMX SDK Authentication Flow Test');
    console.log('='.repeat(50));

    // Run authentication tests
    const omx = await testDifferentScenarios();

    if (!omx) {
      console.log(
        '⚠️ Could not get valid SDK instance, skipping further tests'
      );
      return;
    }

    // Check health status
    console.log('\n🔍 Testing SDK health check with authenticated token...');
    const health = await omx.healthCheck();
    console.log('📊 Health Check Result:', health);

    if (health.overall === 'healthy') {
      console.log('✅ All services are healthy');
    } else if (health.overall === 'unhealthy') {
      console.warn('⚠️ Some services are not available');
      Object.entries(health.services).forEach(([service, status]) => {
        const icon =
          status === 'healthy'
            ? '✅'
            : (status as any) === 'degraded'
              ? '⚠️'
              : (status as any) === 'unhealthy'
                ? '❌'
                : '❓';
        console.log(`  ${icon} ${service}: ${status}`);
      });
    } else {
      console.warn('⚠️ Some services may have issues');
      Object.entries(health.services).forEach(([service, status]) => {
        const icon =
          status === 'healthy'
            ? '✅'
            : (status as any) === 'degraded'
              ? '⚠️'
              : (status as any) === 'unhealthy'
                ? '❌'
                : '❓';
        console.log(`  ${icon} ${service}: ${status}`);
      });
    }

    // Test a simple API call to verify authentication is working
    console.log('\n🧪 Testing authenticated API call...');
    try {
      // Example: Send a test email to verify JWT token is working
      const emailResult = await omx.email.send({
        to: ['test@example.com'],
        subject: 'OMX SDK Authentication Test',
        body: 'This email confirms that JWT authentication is working correctly.',
        html: `
          <h2>🎉 Authentication Success!</h2>
          <p>Your OMX SDK is properly authenticated and ready to use.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        `,
      });

      if (emailResult.success) {
        console.log(
          '✅ Authenticated API call successful! Email sent with ID:',
          emailResult.messageId
        );
        console.log('🔐 JWT token is working correctly');
      } else {
        console.log('❌ API call failed:', emailResult.error);
      }
    } catch (apiError) {
      const err = apiError as any;
      console.error('❌ API call error:', err.message || 'Unknown error');
      if (err.status === 401) {
        console.error('🚫 Token appears to be invalid or expired');
      }
    }

    // Summary
    console.log('\n� Authentication Flow Summary:');
    console.log('='.repeat(50));
    console.log('1. ✅ Client credentials provided (clientId + secretKey)');
    console.log('2. ✅ POST to Supabase Edge Function (/create-jwt-token)');
    console.log('3. ✅ Edge Function validates credentials via RPC');
    console.log('4. ✅ JWT token generated and returned');
    console.log('5. ✅ SDK stores token internally for API requests');
    console.log('6. ✅ All subsequent calls use Bearer authentication');

    // Clean up
    console.log('\n🛑 Cleaning up...');
    if (omx.dispose && typeof omx.dispose === 'function') {
      omx.dispose();
      console.log('✅ SDK disposed successfully');
    }

    // Detect environment
    const isNode = typeof window === 'undefined';
    const isBrowser = typeof window !== 'undefined';
    console.log(`🌍 Running in: ${isNode ? 'Node.js' : 'Browser'} environment`);

    // 1. Geotrigger Example
    console.log('\n📍 Setting up geotrigger...');
    const geotrigger = omx.geotrigger;

    // Add a geofence region
    geotrigger.addRegion({
      id: 'headquarters',
      center: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      radius: 200, // 200 meters
      name: 'Company Headquarters',
    });

    // Start monitoring with event handler (skip in Node.js)
    if (isBrowser) {
      await geotrigger.startMonitoring((event) => {
        console.log(
          `🎯 Geofence Event: ${event.type} region ${event.regionId}`
        );

        // Send notification email when entering region
        if (event.type === 'enter') {
          omx.email
            .send({
              to: 'user@example.com',
              subject: 'Welcome!',
              body: `You've entered the ${event.regionId} region.`,
              html: `<h2>Welcome!</h2><p>You've entered the <strong>${event.regionId}</strong> region.</p>`,
            })
            .then((result) => {
              if (result.success) {
                console.log('📧 Welcome email sent successfully');
              }
            });
        }
      });
    } else {
      console.log('⚠️ Geolocation monitoring skipped in Node.js environment');
    }

    // Get current location (skip in Node.js)
    if (isBrowser) {
      try {
        const location = await geotrigger.getCurrentLocation();
        console.log('📍 Current location:', location);
      } catch (error) {
        const err = error as any;
        console.log('❌ Could not get current location:', err.message || 'Unknown error');
      }
    } else {
      console.log('⚠️ Location detection skipped in Node.js environment');
    }

    // 2. Email Example
    console.log('\n📧 Testing email functionality...');
    const email = omx.email;

    // Send a test email
    const emailResult = await email.send({
      to: ['user1@example.com', 'user2@example.com'],
      subject: 'OMX SDK Test Email',
      body: 'This is a test email from the OMX SDK.',
      html: `
        <h1>OMX SDK Test</h1>
        <p>This is a test email from the <strong>OMX SDK</strong>.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
      attachments: [
        {
          filename: 'test.txt',
          content: 'Hello from OMX SDK!',
          contentType: 'text/plain',
        },
      ],
    });

    if (emailResult.success) {
      console.log('✅ Email sent successfully:', emailResult.messageId);
    } else {
      console.log('❌ Email failed:', emailResult.error);
    }

    // Validate email addresses
    const testEmails = [
      'valid@example.com',
      'invalid-email',
      'test@domain.co.uk',
    ];
    testEmails.forEach((testEmail) => {
      const isValid = email.validateEmail(testEmail);
      console.log(`📧 ${testEmail}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    });

    // 3. Webhook Example
    console.log('\n🪝 Testing webhook functionality...');
    const webhook = omx.webhook;

    // Create a webhook subscription
    const subscription = await webhook.createSubscription(
      'https://your-app.com/webhook/handler',
      ['user.created', 'user.updated', 'order.completed'],
      'your-webhook-secret'
    );
    console.log('🪝 Webhook subscription created:', subscription.id);

    // Test a webhook endpoint
    const webhookTest = await webhook.testWebhook('https://httpbin.org/post');
    console.log('🪝 Webhook test result:', webhookTest);

    // Send a custom webhook
    const webhookSend = await webhook.send({
      url: 'https://httpbin.org/post',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer your-token',
      },
      data: {
        event: 'sdk.test',
        timestamp: new Date().toISOString(),
        data: { message: 'Hello from OMX SDK!' },
      },
    });
    console.log('🪝 Webhook sent:', webhookSend.success);

    // 4. Beacon Example (if supported)
    console.log('\n📡 Testing beacon functionality...');
    const beacon = omx.beacon;

    if (isBrowser) {
      try {
        await beacon.initialize();

        // Add beacon regions
        beacon.addRegion({
          id: 'entrance',
          uuid: 'B0702880-A295-A8AB-F734-031A98A512DE',
          major: 1,
          minor: 1,
          name: 'Main Entrance',
        });

        beacon.addRegion({
          id: 'conference-room',
          uuid: 'B0702880-A295-A8AB-F734-031A98A512DE',
          major: 1,
          minor: 2,
          name: 'Conference Room A',
        });

        // Set up event listeners
        beacon.addEventListener('enter', (event) => {
          console.log(`📡 Entered beacon region: ${event.region.name}`);
          event.beacons?.forEach((beacon) => {
            console.log(
              `  - Beacon ${beacon.id}: ${beacon.distance?.toFixed(2)}m away`
            );
          });
        });

        beacon.addEventListener('exit', (event) => {
          console.log(`📡 Exited beacon region: ${event.region.name}`);
        });

        beacon.addEventListener('range', (event) => {
          console.log(
            `📡 Ranging in ${event.region.name}: ${event.beacons?.length} beacons`
          );
        });

        // Start scanning
        await beacon.startScanning({
          interval: 1000,
          allowDuplicates: true,
        });
        console.log('📡 Beacon scanning started');

        // Get discovered beacons after 5 seconds
        setTimeout(() => {
          const discoveredBeacons = beacon.getDiscoveredBeacons();
          console.log(
            `📡 Discovered ${discoveredBeacons.length} beacons:`,
            discoveredBeacons
          );
        }, 5000);
      } catch (error) {
        const err = error as any;
        console.log('❌ Beacon functionality not available:', err.message || 'Unknown error');
      }
    } else {
      console.log('⚠️ Beacon functionality skipped in Node.js environment');
    }

    // 5. Push Notification Example
    console.log('\n🔔 Testing push notification functionality...');
    const push = omx.pushNotification;

    if (isBrowser) {
      try {
        await push.initialize();

        // Subscribe to push notifications
        const pushSubscription = await push.subscribe();
        if (pushSubscription.success) {
          console.log('🔔 Push notification subscription successful');

          // Show a local notification
          await push.showLocalNotification({
            title: 'OMX SDK Demo',
            body: 'Push notifications are now enabled!',
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            tag: 'demo-notification',
            data: {
              timestamp: Date.now(),
              source: 'omx-sdk-demo',
            },
            actions: [
              {
                action: 'view',
                title: 'View Details',
              },
              {
                action: 'dismiss',
                title: 'Dismiss',
              },
            ],
          });

          // Set up notification event handlers
          push.onNotificationClick((event) => {
            console.log('🔔 Notification clicked:', event);
            if (event.action === 'view') {
              console.log('👀 User wants to view details');
            }
          });

          push.onNotificationClose((event) => {
            console.log('🔔 Notification closed:', event);
          });
        } else {
          console.log(
            '❌ Push notification subscription failed:',
            pushSubscription.error
          );
        }
      } catch (error) {
        const err = error as any;
        console.log('❌ Push notifications not available:', err.message || 'Unknown error');
      }
    } else {
      console.log('⚠️ Push notifications skipped in Node.js environment');
    }

    // 6. Analytics Example
    console.log('\n📊 Getting SDK analytics...');
    const analytics = omx.getAnalytics();
    console.log('📊 SDK Analytics:', {
      geotrigger: analytics.geotrigger,
      webhook: analytics.webhook,
      beacon: analytics.beacon,
      pushNotification: analytics.pushNotification,
    });

    // Keep the example running for a while to see events
    const waitTime = isNode ? 5000 : 30000; // Shorter time for Node.js
    console.log(
      `\n⏰ Example will run for ${waitTime / 1000} seconds to demonstrate events...`
    );
    setTimeout(() => {
      console.log('\n🛑 Stopping all services...');

      // Stop monitoring
      if (isBrowser && geotrigger.isMonitoring()) {
        geotrigger.stopMonitoring();
      }

      if (isBrowser && beacon.isCurrentlyScanning()) {
        beacon.stopScanning();
      }

      // Clean up
      omx.dispose();
      console.log('✅ Example completed successfully!');

      //   // Exit in Node.js
      //   if (isNode) {
      //     process.exit(0);
      //   }
    }, waitTime);
  } catch (error) {
    const err = error as any;
    console.error('❌ Main test failed:', error);
    console.error('📄 Error details:', {
      message: err.message || 'Unknown error',
      stack: err.stack?.split('\n').slice(0, 3).join('\n'), // Show first 3 lines of stack
    });
  }
}

// Run the example
main();

// Export for module usage
export default main;
