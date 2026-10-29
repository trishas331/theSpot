# theSpot

A mobile app (React Native + Expo) that shows trending local spots near you on a map. The first version covers Arlington, VA with 16 hand-curated venues stored in a Supabase (Postgres) database.

<!-- Add screenshots here once you've uploaded them to the screenshots/ folder, for example:
<p>
  <img src="screenshots/map.png" width="250" />
  <img src="screenshots/card.png" width="250" />
</p>
-->

## Features
- Map opens on the Clarendon / Courthouse / Ballston corridor
- Pins for every spot, loaded from a Supabase database
- Tap a pin to see why it's trending, its address, and how far away it is
- Category filter chips (Bakery, Cafe, Restaurant, Bar)
- "Near me" button that recenters the map on your location

## Tech stack
React Native, Expo (SDK 58), react-native-maps, expo-location, Supabase (Postgres)

## Run it locally
1. Clone the repo and install packages:
   ```bash
   npm install
   ```
2. Create a free [Supabase](https://supabase.com) project. In its SQL Editor, run `supabase/setup.sql` to create the `spots` table and load the 16 venues.
3. Create a file named `.env.local` in the project root with your project's URL and publishable key (Project Settings, then API):
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
   EXPO_PUBLIC_SUPABASE_KEY=YOUR-PUBLISHABLE-KEY
   ```
   This file is git-ignored. Never commit it.
4. Start the app and scan the QR code with Expo Go (the Expo Go version must match the project's SDK):
   ```bash
   npx expo start -c
   ```

## Roadmap
- [x] Map screen with category filtering and distance
- [x] Move spot data from a local file to Supabase
- [ ] Spot submission form (user-contributed spots)
- [ ] Route-based discovery (spots along a path to a destination)
- [ ] Verify venue coordinates against OpenStreetMap (in progress, see analysis repo)
- [ ] ML: extract venue names from TikTok captions (spaCy NER, planned)

## Data analysis
Hotspot clustering (DBSCAN) and venue geocoding live in a companion repo: `theSpot-analysis`.

## Data notes
- Coordinates are hand-estimated and being verified; treat them as approximate.
- The "why it's trending" text comes from web research, not verified TikTok data.
