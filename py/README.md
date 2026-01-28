# OMX SDK for Python

Python SDK for Oxinion Marketing Exchange (OMX) - A comprehensive toolkit for multi-channel marketing automation, geotrigger management, push notifications, email campaigns, and webhook integration.

## Installation

```bash
pip install omx-sdk
```

## Quick Start

```python
import asyncio
import os
from omx_sdk import OMXClient

async def main():
    # Recommended: Use async context manager (auto-cleanup)
    async with OMXClient(
        client_id=os.getenv("OMX_CLIENT_ID"),
        secret_key=os.getenv("OMX_SECRET_KEY")
    ) as omx:
        # Send push notification (Pythonic style with keyword arguments)
        result = await omx.notification.send(
            title="Special Offer",
            message="Get 20% off your next purchase!",
            recipients=["user123", "user456"],
            data={"coupon_code": "SAVE20"}
        )
        print(f"Notification sent: {result.message_id}")

        # Create geofence
        geofence = await omx.geo_trigger.create(
            name="Downtown Store",
            location={"lat": 40.7128, "lng": -74.006},
            radius=100,
            events=["enter", "exit"]
        )
        print(f"Geofence created: {geofence.id}")

        # Send email
        email = await omx.email.send(
            to="customer@example.com",
            subject="Welcome!",
            template="welcome_template",
            variables={"first_name": "John"}
        )
        print(f"Email sent: {email.message_id}")

        # Create webhook
        webhook = await omx.webhook.create(
            url="https://your-app.com/webhooks/omx",
            events=["geofence.enter", "notification.sent"],
            secret="your_webhook_secret"
        )
        print(f"Webhook created: {webhook.id}")

if __name__ == "__main__":
    asyncio.run(main())
```

## Features

- 📱 **Push Notifications** - Send targeted push notifications with deep linking
- 🌍 **GeoTrigger Management** - Create and manage location-based automation
- 📧 **Email Marketing** - Send transactional emails and email campaigns
- 📡 **Beacon Management** - Bluetooth beacon proximity marketing
- 🔗 **Webhook Integration** - Real-time event notifications and webhooks
- 🎯 **Campaign Automation** - Multi-channel marketing campaigns
- 🔐 **Secure Authentication** - Automatic token management
- ⚡ **Async Support** - Built with httpx for high-performance async/await

## All Available Modules

### Notification Module
```python
# Send push notifications
await omx.notification.send(
    title="Hello",
    message="Welcome!",
    recipients=["user123"]
)

# Send to audience segment
await omx.notification.send_to_segment(
    title="Sale Alert",
    message="50% off today!",
    segment="vip_customers"
)

# Get notification history
history = await omx.notification.get_history(limit=50, status="delivered")
```

### Email Module
```python
# Send transactional email
await omx.email.send(
    to="user@example.com",
    subject="Welcome!",
    template="welcome_template",
    variables={"name": "John"}
)

# Create email campaign
campaign = await omx.email.create_campaign(
    name="Monthly Newsletter",
    subject="Special Offers",
    template="newsletter",
    recipients=["segment:all_users"]
)
```

### GeoTrigger Module
```python
# Create circular geofence
geofence = await omx.geo_trigger.create(
    name="Store Location",
    location={"lat": 40.7128, "lng": -74.006},
    radius=100,
    events=["enter", "exit"]
)

# Check if location is inside geofence
is_inside = await omx.geo_trigger.check_location(
    geofence_id="fence_123",
    latitude=40.7128,
    longitude=-74.006
)
```

### Beacon Module
```python
# Register beacon
beacon = await omx.beacon.register(
    uuid="550e8400-e29b-41d4-a716-446655440000",
    major=1,
    minor=1,
    name="Store Entrance"
)

# Get nearby beacons
beacons = await omx.beacon.get_nearby(
    latitude=40.7128,
    longitude=-74.006,
    radius=50
)
```

### Webhook Module
```python
# Create webhook
webhook = await omx.webhook.create(
    url="https://yourapp.com/webhook",
    events=["geofence.enter", "notification.sent"],
    secret="your_secret"
)

# Get delivery logs
deliveries = await omx.webhook.get_deliveries(
    webhook_id="webhook_123",
    status="failed"
)
```

### Campaign Module
```python
# Create multi-channel campaign
campaign = await omx.campaign.create(
    name="Summer Sale",
    description="Seasonal promotion",
    channels=["email", "push_notification"],
    schedule={"start_date": "2024-06-01T00:00:00Z"},
    targeting={"segments": ["active_users"]}
)

# Execute campaign
await omx.campaign.execute(
    campaign.id,
    trigger_data={"user_id": "user_123"}
)
```

## Configuration

Set your credentials as environment variables:

```bash
export OMX_CLIENT_ID="your_client_id"
export OMX_SECRET_KEY="your_secret_key"
```

## Documentation

For detailed documentation and API reference, visit: https://github.com/oxinion/omx-sdk

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@oxinion.com
- 🐛 Issues: https://github.com/oxinion/omx-sdk/issues
- 📖 Documentation: https://github.com/oxinion/omx-sdk#readme
