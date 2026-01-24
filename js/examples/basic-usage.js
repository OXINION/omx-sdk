#!/usr/bin/env node

// Example 1: Using the meta package (recommended)
import { OMXClient, GeotriggerManager, EmailManager } from 'omx-sdk'

// Example 2: Using individual packages
// import { OMXClient } from '@omx-sdk/core'
// import { GeotriggerManager } from '@omx-sdk/geotrigger' 
// import { EmailManager } from '@omx-sdk/email'

async function main() {
  // Initialize client
  const client = new OMXClient({
    apiKey: process.env.OMX_API_KEY,
    secretKey: process.env.OMX_SECRET_KEY,
    baseUrl: 'https://api.oxinion.com/v1'
  })

  try {
    // Authenticate
    await client.authenticate()
    console.log('✅ Authentication successful')

    // Geotrigger example
    const geotrigger = await client.geotriggers.create({
      name: 'Coffee Shop Downtown',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100
    })
    console.log('✅ Geotrigger created:', geotrigger.id)

    // Email example
    const emailResult = await client.email.send({
      to: ['user@example.com'],
      subject: 'Welcome to OMX!',
      content: '<h1>Hello from OMX SDK</h1>',
    })
    console.log('✅ Email sent:', emailResult.messageId)

    // Webhook example
    const webhook = await client.webhooks.create({
      url: 'https://your-app.com/webhooks/omx',
      events: ['geotrigger.entered', 'email.sent']
    })
    console.log('✅ Webhook created:', webhook.id)

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

main().catch(console.error)