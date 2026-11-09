import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { geocodeDestination, fetchRoute } from "./lib/directions";
import { spotsNearRoute } from "./lib/route";

// How close (in miles) a spot must be to the route to count as "along the way".
const MAX_MILES = 0.5;

// Screen where the user types a destination.
export default function RouteSearch({ visible, onClose, userLoc, spots, onRoute }) {
  const [dest, setDest] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  async function go() {
    const text = dest.trim();
    if (text.length < 2) {
      setMessage("Enter a destination.");
      return;
    }
    if (!userLoc) {
      setMessage("Turn on location access so we can start the route from where you are.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      // Plain place names get "Arlington, VA" added so they don't resolve to another city.
      const query = text.includes(",") ? text : text + ", Arlington, VA";
      const to = await geocodeDestination(query);
      if (!to) {
        setMessage("Couldn't find that place. Try a full street address.");
        return;
      }
      const r = await fetchRoute(userLoc, to);
      onRoute({
        coordinates: r.coordinates,
        distanceMiles: r.distanceMiles,
        durationMin: r.durationMin,
        spots: spotsNearRoute(spots, r.coordinates, MAX_MILES),
      });
      setDest("");
      onClose();
    } catch (e) {
      setMessage(e.message || "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Where to?</Text>
          <Text style={styles.sub}>
            We'll find the trending spots along your drive.
          </Text>
          <TextInput
            style={styles.input}
            value={dest}
            onChangeText={setDest}
            placeholder="e.g. Ballston Quarter or 4401 Wilson Blvd"
            autoFocus
            returnKeyType="go"
            onSubmitEditing={go}
          />
          {message && <Text style={styles.error}>{message}</Text>}
          <TouchableOpacity style={styles.primary} onPress={go} disabled={busy}>
            <Text style={styles.primaryText}>{busy ? "Finding route..." : "Find spots"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Panel at the bottom of the map listing the spots along the route.
export function RouteResults({ route, selected, onSelect, onClear }) {
  const n = route.spots.length;
  return (
    <View style={styles.results}>
      <View style={styles.resHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.resTitle}>
            {n === 0 ? "No spots along this route" : `${n} spot${n === 1 ? "" : "s"} along your route`}
          </Text>
          <Text style={styles.resMeta}>
            {route.distanceMiles.toFixed(1)} mi · {Math.round(route.durationMin)} min drive
          </Text>
        </View>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clear}>Clear</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ maxHeight: 220 }}>
        {route.spots.map((s) => {
          const open = selected && selected.id === s.id;
          return (
            <TouchableOpacity key={s.id} style={styles.row} onPress={() => onSelect(s)}>
              <Text style={styles.rowName}>{s.name}</Text>
              <Text style={styles.rowMeta}>
                {s.category} · {s.neighborhood} · {s.routeDistance.toFixed(2)} mi off route
              </Text>
              {open && <Text style={styles.rowWhy}>{s.whyViral}</Text>}
              {open && <Text style={styles.rowAddr}>{s.address}</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "white" },
  body: { padding: 20, paddingTop: 64 },
  title: { fontSize: 24, fontWeight: "700", color: "#111" },
  sub: { fontSize: 14, color: "#666", marginTop: 4, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#111",
  },
  error: { color: "#c0392b", marginTop: 12 },
  primary: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 20,
  },
  primaryText: { color: "white", fontSize: 16, fontWeight: "600" },
  cancel: { alignItems: "center", padding: 14 },
  cancelText: { color: "#666", fontSize: 15 },
  results: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 32,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  resHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  resTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  resMeta: { fontSize: 13, color: "#666", marginTop: 2 },
  clear: { fontSize: 15, fontWeight: "600", color: "#2563eb", padding: 6 },
  row: { paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#ddd" },
  rowName: { fontSize: 16, fontWeight: "600", color: "#111" },
  rowMeta: { fontSize: 12, color: "#666", marginTop: 2 },
  rowWhy: { fontSize: 14, color: "#222", marginTop: 6, lineHeight: 19 },
  rowAddr: { fontSize: 12, color: "#888", marginTop: 4 },
});
