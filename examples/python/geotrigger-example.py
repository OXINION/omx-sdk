#!/usr/bin/env python3
"""Simple geotrigger example matching the JavaScript version."""

import asyncio
import os
from omx_sdk import OMXClient

async def main():
    async with OMXClient(
        client_id=os.getenv("OMX_CLIENT_ID"),
        secret_key=os.getenv("OMX_SECRET_KEY")
    ) as omx:

        try:
            geotrigger = await omx.geo_trigger.create(
                name="Coffee Shop Promo",
                location={"lat": 43.6532, "lng": -79.3832},
                radius=100,
                events=["enter"]
            )
            
            print("GeoTrigger created:", geotrigger.id)
            
        except Exception as error:
            print("Failed to create GeoTrigger:", error)

if __name__ == "__main__":
    asyncio.run(main())