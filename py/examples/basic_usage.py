#!/usr/bin/env python3
"""
OMX SDK Python - Basic Usage Examples

This example demonstrates all the modules available in the OMX SDK for Python.
All methods use Pythonic keyword arguments instead of dictionary-based arguments.
"""

import asyncio
import os
from omx_sdk import OMXClient


async def main():
    """Example usage of all OMX SDK modules."""

    # Initialize client using async context manager (recommended)
    async with OMXClient(
        client_id=os.getenv("OMX_CLIENT_ID"),
        secret_key=os.getenv("OMX_SECRET_KEY")
        # base_url will default to environment variable OMX_API_BASE_URL or Supabase URL
    ) as omx:

        # ==================== Notification Module ====================
        print("\n=== Notification Examples ===")

        # Send push notification (Pythonic style with keyword arguments)
        notification_result = await omx.notification.send(
            title="Special Offer",
            message="Get 20% off your next purchase!",
            recipients=["user123", "user456"],
            data={"coupon_code": "SAVE20"},
            deep_link="myapp://offers"
        )
        print(f"Notification sent: {notification_result.message_id}")

        # Send to audience segment
        await omx.notification.send_to_segment(
            title="Location-based Alert",
            message="Welcome to downtown!",
            segment="downtown_visitors",
            deep_link="myapp://offers"
        )

        # Get notification history
        history = await omx.notification.get_history(
            limit=50,
            status="delivered"
        )
        print(f"Found {history.total} notifications")

        # Check notification status
        status = await omx.notification.get_status(notification_result.message_id)
        print(f"Notification status: {status.status}")


        # ==================== Email Module ====================
        print("\n=== Email Examples ===")

        # Send transactional email
        email_result = await omx.email.send(
            to="customer@example.com",
            subject="Welcome to our store!",
            template="welcome_template",
            variables={"first_name": "John", "discount_code": "WELCOME10"}
        )
        print(f"Email sent: {email_result.message_id}")

        # Create email template
        template = await omx.email.create_template(
            name="welcome_template",
            subject="Welcome {{first_name}}!",
            html="<h1>Welcome {{first_name}}!</h1><p>Use code {{discount_code}}</p>",
            variables=["first_name", "discount_code"]
        )
        print(f"Template created: {template.id}")

        # Create email campaign
        email_campaign = await omx.email.create_campaign(
            name="Monthly Newsletter",
            subject="Special Offers Inside!",
            template="newsletter_template",
            recipients=["segment:loyal_customers"],
            scheduled_at="2024-01-15T10:00:00Z"
        )
        print(f"Email campaign created: {email_campaign.id}")

        # Send the email campaign
        await omx.email.send_campaign(email_campaign.id)
        print(f"Email campaign sent: {email_campaign.name}")


        # ==================== GeoTrigger Module ====================
        print("\n=== GeoTrigger Examples ===")

        # Create circular geofence
        geofence = await omx.geo_trigger.create(
            name="Downtown Store",
            location={"lat": 40.7128, "lng": -74.006},
            radius=100,
            events=["enter", "exit"]
        )
        print(f"Geofence created: {geofence.id}")

        # Create polygon geofence
        polygon_fence = await omx.geo_trigger.create_polygon_fence(
            name="Shopping District",
            coordinates=[
                [40.7128, -74.006],
                [40.713, -74.0055],
                [40.7125, -74.005]
            ],
            events=["enter"]
        )
        print(f"Polygon geofence created: {polygon_fence.id}")

        # Get active geofences
        geofences = await omx.geo_trigger.get_geofences(
            active=True,
            near={"lat": 40.7128, "lng": -74.006, "radius": 1000}
        )
        print(f"Found {len(geofences)} geofences")

        # Check if location is inside geofence
        is_inside = await omx.geo_trigger.check_location(
            geofence_id=geofence.id,
            latitude=40.7128,
            longitude=-74.006
        )
        print(f"Location is inside geofence: {is_inside}")

        # Get location events
        events = await omx.geo_trigger.get_events(
            geofence_id=geofence.id,
            event_type="enter",
            since="2024-01-01T00:00:00Z"
        )
        print(f"Found {len(events)} geofence events")

        # Update geofence
        await omx.geo_trigger.update_geofence(
            geofence.id,
            name="Updated Store Name",
            radius=150,
            events=["enter", "exit", "dwell"]
        )


        # ==================== Beacon Module ====================
        print("\n=== Beacon Examples ===")

        # Register new beacon
        beacon = await omx.beacon.register(
            uuid="550e8400-e29b-41d4-a716-446655440000",
            major=1,
            minor=1,
            name="Store Entrance",
            location={
                "latitude": 40.7128,
                "longitude": -74.006,
                "description": "Main entrance beacon"
            }
        )
        print(f"Beacon registered: {beacon.id}")

        # Get nearby beacons
        nearby_beacons = await omx.beacon.get_nearby(
            latitude=40.7128,
            longitude=-74.006,
            radius=50
        )
        print(f"Found {len(nearby_beacons)} nearby beacons")

        # Update beacon configuration
        await omx.beacon.update_config(
            beacon.id,
            transmission_power=-12,
            advertising_interval=100,
            name="Updated Beacon Name"
        )

        # Check beacon status
        beacon_status = await omx.beacon.get_status(beacon.id)
        print(f"Beacon status: {beacon_status}")


        # ==================== Webhook Module ====================
        print("\n=== Webhook Examples ===")

        # Create webhook endpoint
        webhook = await omx.webhook.create(
            url="https://your-app.com/webhooks/omx",
            events=["geofence.enter", "campaign.completed", "notification.sent"],
            secret="your_webhook_secret",
            active=True
        )
        print(f"Webhook created: {webhook.id}")

        # Update webhook configuration
        await omx.webhook.update(
            webhook.id,
            events=["geofence.enter", "geofence.exit"],
            retry_policy={
                "max_retries": 3,
                "retry_delay": 1000
            }
        )

        # Get webhook delivery logs
        deliveries = await omx.webhook.get_deliveries(
            webhook_id=webhook.id,
            status="failed",
            limit=50
        )
        print(f"Found {len(deliveries)} webhook deliveries")

        # Get all webhooks
        webhooks = await omx.webhook.list(active=True)
        print(f"Found {len(webhooks)} active webhooks")


        # ==================== Campaign Module ====================
        print("\n=== Campaign Examples ===")

        # Create multi-channel marketing campaign
        campaign = await omx.campaign.create(
            name="Summer Sale 2024",
            description="Promote summer products with location-based offers",
            channels=["email", "push_notification"],
            schedule={
                "start_date": "2024-06-01T00:00:00Z",
                "end_date": "2024-08-31T23:59:59Z"
            },
            targeting={
                "segments": ["summer_shoppers", "location:downtown"],
                "geofences": ["store_123", "mall_456"]
            }
        )
        print(f"Campaign created: {campaign.id}")

        # Update campaign settings
        await omx.campaign.update(
            campaign.id,
            status="active",
            budget={"limit": 5000, "spent": 1250}
        )

        # Pause campaign
        await omx.campaign.pause(campaign.id)
        print(f"Campaign paused: {campaign.name}")

        # Resume campaign
        await omx.campaign.resume(campaign.id)
        print(f"Campaign resumed: {campaign.name}")

        # Execute multi-channel campaign
        await omx.campaign.execute(
            campaign.id,
            trigger_data={"user_id": "user_789", "location": "downtown"}
        )
        print(f"Campaign executed: {campaign.name}")

        # Get all campaigns
        campaigns = await omx.campaign.list(
            status="active",
            sort_by="created_date",
            limit=20
        )
        print(f"Found {len(campaigns)} campaigns")
        for c in campaigns:
            print(f"  - {c.name} ({c.status})")

        print("\n=== All examples completed successfully! ===")


# Alternative: Manual initialization without context manager
async def manual_initialization():
    """Example of manual client initialization."""
    omx = OMXClient(
        client_id=os.getenv("OMX_CLIENT_ID"),
        secret_key=os.getenv("OMX_SECRET_KEY")
    )

    try:
        # Your code here
        result = await omx.notification.send(
            title="Test",
            message="Hello World",
            recipients=["user123"]
        )
        print(f"Notification sent: {result.message_id}")
    finally:
        # Don't forget to close!
        await omx.close()


if __name__ == "__main__":
    # Run the main example
    asyncio.run(main())

    # Or run the manual initialization example
    # asyncio.run(manual_initialization())
