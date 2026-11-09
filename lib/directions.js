import * as Location from "expo-location";

// Turn text like "Ballston Quarter" or "4401 Wilson Blvd" into coordinates.
// Uses the phone's built-in geocoder. Returns null if nothing is found.
export async function geocodeDestination(query) {
  const results = await Location.geocodeAsync(query);
  if (results.length === 0) return null;
  return { latitude: results[0].latitude, longitude: results[0].longitude };
}

// Ask the OSRM routing service for a driving route between two points.
// Returns the route as a list of {latitude, longitude} points, plus distance and time.
export async function fetchRoute(from, to) {
  // OSRM expects longitude first, then latitude.
  const url =
    "https://router.project-osrm.org/route/v1/driving/" +
    `${from.longitude},${from.latitude};${to.longitude},${to.latitude}` +
    "?overview=full&geometries=geojson";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Routing service error (" + res.status + ")");
  const json = await res.json();
  if (json.code !== "Ok" || !json.routes || json.routes.length === 0) {
    throw new Error("No route found");
  }
  const route = json.routes[0];
  return {
    // GeoJSON points are [longitude, latitude]; the map wants {latitude, longitude}.
    coordinates: route.geometry.coordinates.map(([lon, lat]) => ({
      latitude: lat,
      longitude: lon,
    })),
    distanceMiles: route.distance / 1609.34,
    durationMin: route.duration / 60,
  };
}
