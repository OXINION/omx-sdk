import os
from omx_sdk import OMXClient

omx = OMXClient(
    client_id=os.getenv("OMX_CLIENT_ID"),
    secret_key=os.getenv("OMX_SECRET_KEY")
)

geo_trigger = await omx.geo_trigger.create({
    "name": "Coffee Shop Promo",
    "location": {
        "lat": 43.6532,
        "lng": -79.3832
    },
    "radius": 100,
    "on_enter": {
        "notification": {
            "title": "Welcome!",
            "body": "Get 30% off your order!"
        }
    }
})

print("GeoTrigger created:", geo_trigger.id)