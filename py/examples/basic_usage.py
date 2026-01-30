#!/usr/bin/env python3
"""
OMX SDK Python - Basic Usage Examples

Simple examples showing all available features in the OMX SDK for Python.
"""

import asyncio
import os
from omx_sdk import OMXClient


async def main():
    """Example usage of OMX SDK."""

    # Initialize client
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

            # Beacon example
            beacon = await omx.beacon.register(
                uuid="f7826da6-4fa2-4e98-8024-bc5b71e0893e",
                major=1,
                minor=1,
                name="Store Entrance"
            )
            print(f"✅ Beacon created: {beacon.id}")

            # Workflow example
            workflow = await omx.workflow.create_workflow(
                name="Customer Onboarding",
                description="Automated welcome sequence",
                config={
                    "triggers": ["user_signup"],
                    "actions": [
                        {"type": "send_email", "template": "welcome"},
                        {"type": "send_notification", "title": "Welcome!"}
                    ]
                }
            )
            print(f"✅ Workflow created: {workflow.id}")

            # Segment example
            segment = await omx.segment.create_segment(
                name="Active Users",
                description="Users who visited in the last 30 days",
                criteria={"last_visit": {"$gte": "2024-01-01"}}
            )
            print(f"✅ Segment created: {segment.id}")

            # Analytics example
            analytics = await omx.analytics.get_geotrigger_stats(
                geotrigger_id=geotrigger.id,
                time_range="7d"
            )
            print(f"✅ Analytics retrieved: {len(analytics.metrics)} metrics")

            # Event tracking example
            await omx.events.track_event(
                user_id="user123",
                event_type="store_visit",
                data={"location": "downtown", "duration": 300}
            )
            print("✅ Event tracked successfully")

        except Exception as error:
            print(f"❌ Error: {error}")


if __name__ == "__main__":
    asyncio.run(main())