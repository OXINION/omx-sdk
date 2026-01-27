#!/usr/bin/env node

// Example 1: Using the unified SDK (recommended)
import { OMXSdk, createOmxSdk } from 'omx-sdk'

// Example 2: Using individual packages
// import { OMXClient } from '@omx-sdk/core'
// import { GeoTriggerManager } from '@omx-sdk/geotrigger' 
// import { EmailManager } from '@omx-sdk/email'

async function main() {
  // Initialize SDK
  const sdk = createOmxSdk({
    clientId: process.env.OMX_CLIENT_ID,
    secretKey: process.env.OMX_SECRET_KEY
  })

  try {
    // Geotrigger example
    const geotrigger = await sdk.geotrigger.create({
      name: 'Coffee Shop Downtown',
      location: {
        lat: 40.7128,
        lng: -74.0060
      },
      radius: 100
    })
    console.log('✅ Geotrigger created:', geotrigger.id)

    // Email example
    const emailResult = await sdk.email.send({
      to: 'user@example.com',
      subject: 'Welcome to OMX!',
      content: 'Hello from OMX SDK!',
      htmlContent: '<h1>Hello from OMX SDK</h1>'
    })
    console.log('✅ Email sent:', emailResult.messageId)

    // Notification example
    const notification = await sdk.notification.sendPushNotification({
      userId: 'user123',
      title: 'Welcome!',
      body: 'Thanks for visiting our store!'
    })
    console.log('✅ Notification sent:', notification.messageId)

    // Webhook example
    const webhook = await sdk.webhook.create({
      url: 'https://your-app.com/webhooks/omx',
      events: ['geotrigger.enter', 'email.sent']
    })
    console.log('✅ Webhook created:', webhook.id)

    // Campaign example
    const campaign = await sdk.campaign.create({
      name: 'Welcome Campaign',
      type: 'geotrigger',
      status: 'draft',
      actions: [
        {
          type: 'notification',
          config: {
            title: 'Welcome!',
            body: 'Thanks for visiting!'
          }
        }
      ]
    })
    console.log('✅ Campaign created:', campaign.id)

    // Beacon example
    const beacon = await sdk.beacon.create({
      uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
      major: 1,
      minor: 1,
      name: 'Store Entrance'
    })
    console.log('✅ Beacon created:', beacon.id)

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

main().catch(console.error)