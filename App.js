import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SPOTS } from "./data/spots";

// Where the map opens: the Clarendon / Courthouse / Ballston corridor,
// where the seed data is densest.
const INITIAL_REGION = {
  latitude: 38.8875,
  longitude: -77.0935,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

// Straight-line distance between two lat/lon points, in miles (haversine formula).
function distanceMiles(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export default function App() {
  const mapRef = useRef(null);
  const [selected, setSelected] = useState(null); // the spot whose card is open
  const [category, setCategory] = useState("All");
  const [userLoc, setUserLoc] = useState(null); // { latitude, longitude } or null

  // Ask for location permission once, when the app opens.
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return; // app still works, just without distances
      const pos = await Location.getCurrentPositionAsync({});
      setUserLoc({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    })();
  }, []);

  // Build the filter chips from the data: All, Bakery, Cafe, ...
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(SPOTS.map((s) => s.category)))],
    []
  );

  const visibleSpots = useMemo(
    () => SPOTS.filter((s) => category === "All" || s.category === category),
    [category]
  );

  function pickCategory(cat) {
    setCategory(cat);
    setSelected(null); // close the card so it can't show a spot that's now hidden
  }

  function goToMe() {
    if (!userLoc || !mapRef.current) return;
    mapRef.current.animateToRegion(
      { ...userLoc, latitudeDelta: 0.02, longitudeDelta: 0.02 },
      600
    );
  }

  const selectedDistance =
    selected && userLoc
      ? distanceMiles(
          userLoc.latitude,
          userLoc.longitude,
          selected.lat,
          selected.lon
        )
      : null;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        onPress={() => setSelected(null)}
      >
        {visibleSpots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.lat, longitude: spot.lon }}
            onPress={(e) => {
              e.stopPropagation(); // don't let the map's onPress close the card
              setSelected(spot);
            }}
          />
        ))}
      </MapView>

      {/* Category filter chips */}
      <View style={styles.chipBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => pickCategory(cat)}
              style={[styles.chip, category === cat && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  category === cat && styles.chipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Jump to my location */}
      {userLoc && (
        <TouchableOpacity style={styles.locateBtn} onPress={goToMe}>
          <Text style={styles.locateText}>Near me</Text>
        </TouchableOpacity>
      )}

      {/* Detail card for the tapped spot */}
      {selected && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{selected.name}</Text>
          <Text style={styles.cardMeta}>
            {selected.category} · {selected.neighborhood}
            {selectedDistance !== null
              ? ` · ${selectedDistance.toFixed(1)} mi away`
              : ""}
          </Text>
          <Text style={styles.cardWhy}>{selected.whyViral}</Text>
          <Text style={styles.cardAddress}>{selected.address}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chipBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
  },
  chip: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  chipActive: { backgroundColor: "#111" },
  chipText: { fontSize: 14, fontWeight: "600", color: "#111" },
  chipTextActive: { color: "white" },
  locateBtn: {
    position: "absolute",
    right: 16,
    top: Platform.OS === "ios" ? 110 : 90,
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  locateText: { fontWeight: "600", color: "#111" },
  card: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 40,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTitle: { fontSize: 20, fontWeight: "700", color: "#111" },
  cardMeta: { fontSize: 13, color: "#666", marginTop: 2, marginBottom: 8 },
  cardWhy: { fontSize: 14, color: "#222", lineHeight: 20 },
  cardAddress: { fontSize: 12, color: "#888", marginTop: 8 },
});
