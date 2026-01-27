#!/usr/bin/env python3

import asyncio
import os
from omx_sdk import OMXClient

# Alternative imports for specific modules:
# from omx_sdk.core import OMXClient
# from omx_sdk.geo_trigger import GeotriggerManager
# from omx_sdk.email import EmailManager
# from omx_sdk.webhook import WebhookManager

async def main():
    """Example usage of OMX SDK Python client."""
    
    # Initialize client
    client = OMXClient(
        client_id=os.getenv("OMX_CLIENT_ID"),
        secret_key=os.getenv("OMX_SECRET_KEY")
        # base_url will default to environment variable OMX_API_BASE_URL or Supabase URL
    )

    try:
        # Authenticate
        await client.authenticate()
        print("✅ Authentication successful")

        # Geotrigger example
        geotrigger = await client.geotriggers.create(
            name="Coffee Shop Downtown",
            latitude=40.7128,
            longitude=-74.0060,
            radius=100
        )
        print(f"✅ Geotrigger created: {geotrigger.id}")

        # Email example
        email_result = await client.email.send(
            to=["user@example.com"],
            subject="Welcome to OMX!",
            content="<h1>Hello from OMX SDK</h1>"
        )
        print(f"✅ Email sent: {email_result.message_id}")

        # Webhook example
        webhook = await client.webhooks.create(
            url="https://your-app.com/webhooks/omx",
            events=["geotrigger.entered", "email.sent"]
        )
        print(f"✅ Webhook created: {webhook.id}")

        # List existing geotriggers
        geotriggers = await client.geotriggers.list()
        print(f"📍 Found {len(geotriggers)} geotriggers")

        # List existing webhooks
        webhooks = await client.webhooks.list()
        print(f"🔗 Found {len(webhooks)} webhooks")

    except Exception as error:
        print(f"❌ Error: {error}")
    
    finally:
        # Clean up
        await client.close()

if __name__ == "__main__":
    asyncio.run(main())