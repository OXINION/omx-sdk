#!/usr/bin/env python3
"""OMX SDK Python - Basic Usage Examples"""

import asyncio
import os
from omx_sdk import OMXClient


async def main():
    async with OMXClient(
        client_id=os.getenv("OMX_CLIENT_ID"),
        secret_key=os.getenv("OMX_SECRET_KEY")
    ) as omx:

        try:
            # Geotrigger example
            geotrigger = await omx.geo_trigger.create(
                name="Coffee Shop Downtown",
                location={"lat": 40.7128, "lng": -74.0060},
                radius=100,
                events=["enter", "exit"]
            )
            print(f"✅ Geotrigger created: {geotrigger.id}")

            # Email example
            email = await omx.email.send(
                to="user@example.com",
                subject="Welcome to OMX!",
                template="welcome_template",
                variables={"name": "John"}
            )
            print(f"✅ Email sent: {email.message_id}")

            # Notification example
            notification = await omx.notification.send(
                title="Welcome!",
                message="Thanks for visiting our store!",
                recipients=["user123"]
            )
            print(f"✅ Notification sent: {notification.message_id}")

            # Webhook example
            webhook = await omx.webhook.create(
                url="https://your-app.com/webhooks/omx",
                events=["geofence.enter", "email.sent"]
            )
            print(f"✅ Webhook created: {webhook.id}")

            # Campaign example
            campaign = await omx.campaign.create(
                name="Welcome Campaign",
                description="Automated welcome sequence",
                channels=["email", "push_notification"]
            )
            print(f"✅ Campaign created: {campaign.id}")

        except Exception as error:
            print(f"❌ Error: {error}")


if __name__ == "__main__":
    asyncio.run(main())