import { createOmxClient } from 'omx-sdk';

const omx = createOmxClient({
  clientId: process.env.OMX_CLIENT_ID,
  secretKey: process.env.OMX_SECRET_KEY
});

try {
  const geoTrigger = await omx.geoTrigger.create({
    name: "Coffee Shop Promo",
    location: {
      lat: 43.6532,
      lng: -79.3832
    },
    radius: 100,
    onEnter: {
      notification: {
        title: "Welcome!",
        body: "Get 30% off your order!"
      }
    }
  });
  
  console.log('GeoTrigger created:', geoTrigger.id);
} catch (error) {
  console.error('Failed to create GeoTrigger:', error.message);
}