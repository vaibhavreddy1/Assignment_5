import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const CLAIMS_KEY = "hdfc.claims";
const URGENCY_LEVELS = ["HIGH", "MEDIUM", "LOW"];

export default function ClaimForm({ navigation }) {
  const [policyNo, setPolicyNo] = useState("");
  const [amount, setAmount] = useState("");
  const [urgency, setUrgency] = useState("MEDIUM");
  const [hospital, setHospital] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [notifMsg, setNotifMsg] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");
    setNotifMsg("");

    if (!policyNo.trim()) {
      setError("Policy number is required");
      return;
    }

    const claim = {
      policyNo: policyNo.trim(),
      amount: amount ? Number(amount) : 0,
      urgency,
      hospital: hospital.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      const existingRaw = await AsyncStorage.getItem(CLAIMS_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      existing.push(claim);
      await AsyncStorage.setItem(CLAIMS_KEY, JSON.stringify(existing));
    } catch (e) {
      Alert.alert("Storage error", "Could not save the claim locally.");
    }

    setSuccessMsg(`Claim submitted for ${claim.policyNo}`);

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        setNotifMsg("Notification permission denied");
      } else {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "HDFC Life",
            body: `Claim submitted for ${claim.policyNo}`,
          },
          trigger: null, // fire immediately
        });
      }
    } catch (e) {
      setNotifMsg("Notification permission denied");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>File a Claim</Text>

      <Text style={styles.label}>Policy number</Text>
      <TextInput
        style={styles.input}
        value={policyNo}
        onChangeText={setPolicyNo}
        placeholder="HDFC-LIFE-1001"
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="25000"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Urgency</Text>
      <View style={styles.urgencyRow}>
        {URGENCY_LEVELS.map((level) => (
          <Pressable
            key={level}
            onPress={() => setUrgency(level)}
            style={[
              styles.urgencyButton,
              urgency === level && styles.urgencyButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.urgencyText,
                urgency === level && styles.urgencyTextSelected,
              ]}
            >
              {level}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Hospital</Text>
      <TextInput
        style={styles.input}
        value={hospital}
        onChangeText={setHospital}
        placeholder="Optional"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit claim</Text>
      </Pressable>

      {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}
      {notifMsg ? <Text style={styles.notifWarning}>{notifMsg}</Text> : null}

      <Pressable
        style={styles.billButton}
        onPress={() => navigation.navigate("HospitalBill")}
      >
        <Text style={styles.billButtonText}>Add hospital bill photo</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: "#1a1a1a" },
  label: { fontSize: 13, fontWeight: "600", color: "#555", marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },
  urgencyRow: { flexDirection: "row", gap: 8 },
  urgencyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    marginRight: 8,
  },
  urgencyButtonSelected: { backgroundColor: "#D42027", borderColor: "#D42027" },
  urgencyText: { color: "#555", fontWeight: "600" },
  urgencyTextSelected: { color: "#fff" },
  error: { color: "#a00", marginTop: 14, fontWeight: "600" },
  success: { color: "#1a7a3c", marginTop: 14, fontWeight: "600" },
  notifWarning: { color: "#a06a00", marginTop: 8, fontWeight: "500" },
  submitButton: {
    backgroundColor: "#D42027",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 22,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  billButton: {
    marginTop: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D42027",
  },
  billButtonText: { color: "#D42027", fontWeight: "600" },
});
