import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import policies from "../data/policies.json";

export default function PolicyDetail({ route }) {
  const params = route.params || {};
  const policy =
    params.policy ||
    policies.find((p) => p.policyNo === params.policyNo);

  if (!policy) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Policy Detail</Text>
        <Text style={styles.notFound}>Policy not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Policy Detail</Text>
      <View style={styles.card}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.value}>{policy.policyNo}</Text>
        <Text style={styles.value}>{policy.customer}</Text>
        <Text style={styles.value}>{policy.type}</Text>
        <Text style={styles.value}>{policy.basePremium}</Text>
        <Text style={[styles.value, styles.status]}>{policy.status}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: "#1a1a1a" },
  card: {
    backgroundColor: "#f7f7f9",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  logo: { width: 56, height: 56, borderRadius: 10, marginBottom: 16 },
  value: { fontSize: 18, fontWeight: "600", color: "#1a1a1a", marginBottom: 10 },
  status: { color: "#1a7a3c" },
  notFound: { fontSize: 16, color: "#a00", padding: 16 },
});
