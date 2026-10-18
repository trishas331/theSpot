# theSpot

A mobile app (React Native + Expo) that shows trending local spots near you on a map. v1 covers Arlington, VA with 16 hand-curated venues.

## Features (v1)
- Map opens on the Clarendon / Courthouse / Ballston corridor
- Pins for every spot; tap one to see why it's trending, its address, and how far away it is
- Category filter chips (Bakery, Cafe, Restaurant, Bar)
- "Near me" button that recenters the map on your location

## Run it
```bash
npm install
npx expo install react-native-maps expo-location
npx expo start
```
Scan the QR code with Expo Go on your phone.

## Status and roadmap
- [x] Map screen with filtering and distance
- [ ] Move spot data from a local file to Supabase
- [ ] Spot submission form (user-contributed spots)
- [ ] Route-based discovery (spots along a path to a destination)
- [ ] ML: venue extraction from TikTok captions (spaCy NER). See the analysis repo for the DBSCAN hotspot clustering.

## Data note
Coordinates in `data/spots.js` are approximate and the "why it's trending" text comes from web research, not verified TikTok data.
