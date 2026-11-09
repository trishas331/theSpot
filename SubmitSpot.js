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
import { supabase } from "./lib/supabase";

const CATEGORIES = ["Bakery", "Cafe", "Restaurant", "Bar", "Other"];

export default function SubmitSpot({ visible, onClose }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(null);
  const [address, setAddress] = useState("");
  const [whyViral, setWhyViral] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [done, setDone] = useState(false);

  function reset() {
    setName("");
    setCategory(null);
    setAddress("");
    setWhyViral("");
    setMessage(null);
    setDone(false);
  }

  function close() {
    reset();
    onClose();
  }

  async function submit() {
    if (name.trim().length < 2) {
      setMessage("Please enter the spot's name.");
      return;
    }
    if (!category) {
      setMessage("Please pick a category.");
      return;
    }
    setBusy(true);
    setMessage(null);
    // Writes one row to the submissions table (status defaults to 'pending').
    const { error } = await supabase.from("submissions").insert({
      name: name.trim(),
      category,
      address: address.trim() || null,
      why_viral: whyViral.trim() || null,
    });
    setBusy(false);
    if (error) {
      setMessage("Couldn't submit: " + error.message);
    } else {
      setDone(true);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Suggest a spot</Text>

          {done ? (
            <View>
              <Text style={styles.thanks}>
                Thanks! Your suggestion is in. Spots are checked before they
                appear on the map.
              </Text>
              <TouchableOpacity style={styles.primary} onPress={close}>
                <Text style={styles.primaryText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Roggenart"
                maxLength={100}
              />

              <Text style={styles.label}>Category *</Text>
              <View style={styles.row}>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setCategory(c)}
                    style={[styles.chip, category === c && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, category === c && styles.chipTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Street address, Arlington, VA"
                maxLength={200}
              />

              <Text style={styles.label}>Why is it trending?</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={whyViral}
                onChangeText={setWhyViral}
                placeholder="What is it known for?"
                multiline
                maxLength={500}
              />

              {message && <Text style={styles.error}>{message}</Text>}

              <TouchableOpacity style={styles.primary} onPress={submit} disabled={busy}>
                <Text style={styles.primaryText}>{busy ? "Submitting..." : "Submit"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancel} onPress={close}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "white" },
  body: { padding: 20, paddingTop: 64 },
  title: { fontSize: 24, fontWeight: "700", color: "#111", marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600", color: "#444", marginTop: 16, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#111",
  },
  multiline: { minHeight: 90, textAlignVertical: "top" },
  row: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: "#111", borderColor: "#111" },
  chipText: { fontSize: 14, color: "#111" },
  chipTextActive: { color: "white" },
  error: { color: "#c0392b", marginTop: 12 },
  primary: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 24,
  },
  primaryText: { color: "white", fontSize: 16, fontWeight: "600" },
  cancel: { alignItems: "center", padding: 14 },
  cancelText: { color: "#666", fontSize: 15 },
  thanks: { fontSize: 16, color: "#222", lineHeight: 22, marginTop: 8 },
});
