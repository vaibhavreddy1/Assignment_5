import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import policies from "../data/policies.json";

export default function PoliciesList({ navigation }) {
  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("PolicyDetail", { policyNo: item.policyNo })}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.rowText}>
        <Text style={styles.policyNo}>{item.policyNo}</Text>
        <Text style={styles.customer}>{item.customer}</Text>
      </View>
      <Text style={styles.chevron}>{">"}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>HDFC Life Advisor</Text>
      </View>
      <Text style={styles.heading}>Policies</Text>
      <FlatList
        data={policies}
        keyExtractor={(item) => item.policyNo}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  logo: { width: 32, height: 32, borderRadius: 6, marginRight: 10 },
  title: { fontSize: 18, fontWeight: "700", color: "#D42027" },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#1a1a1a",
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "#f7f7f9",
    borderRadius: 10,
    marginBottom: 10,
  },
  rowPressed: { backgroundColor: "#ececf1" },
  rowText: { flex: 1 },
  policyNo: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  customer: { fontSize: 14, color: "#555", marginTop: 2 },
  chevron: { fontSize: 18, color: "#999" },
});
