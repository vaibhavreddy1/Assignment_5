import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const NAME_KEY = "hdfc.advisorName";
const TOKEN_KEY = "hdfc.advisorToken";
const TOKEN_VALUE = "advisor-token-1001";

export default function Settings() {
  const [nameInput, setNameInput] = useState("");
  const [savedName, setSavedName] = useState("");
  const [tokenSaved, setTokenSaved] = useState(false);

  const [networkStatus, setNetworkStatus] = useState("idle"); // idle | loading | success | error
  const [networkResult, setNetworkResult] = useState("");

  // Load persisted advisor name on mount so it survives app reload.
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(NAME_KEY);
        if (stored) setSavedName(stored);
      } catch (e) {
        // ignore read errors, screen still renders with empty default
      }

      // Auto-issue the token on first Settings visit if not already present.
      try {
        const existingToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (existingToken) {
          setTokenSaved(true);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const saveName = async () => {
    try {
      await AsyncStorage.setItem(NAME_KEY, nameInput.trim());
      setSavedName(nameInput.trim());
    } catch (e) {
      // Fail silently in UI terms but do not crash
    }
  };

  const issueToken = async () => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, TOKEN_VALUE);
      const readBack = await SecureStore.getItemAsync(TOKEN_KEY);
      setTokenSaved(readBack === TOKEN_VALUE);
    } catch (e) {
      setTokenSaved(false);
    }
  };

  const checkNetwork = async () => {
    setNetworkStatus("loading");
    setNetworkResult("");
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
      if (!res.ok) {
        setNetworkStatus("error");
        return;
      }
      const data = await res.json();
      setNetworkResult(data.name);
      setNetworkStatus("success");
    } catch (e) {
      setNetworkStatus("error");
    }
  };

  const breakNetwork = async () => {
    setNetworkStatus("loading");
    setNetworkResult("");
    try {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/this-will-404-xyz"
      );
      if (!res.ok) {
        setNetworkStatus("error");
        return;
      }
      const data = await res.json();
      setNetworkResult(JSON.stringify(data));
      setNetworkStatus("success");
    } catch (e) {
      setNetworkStatus("error");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Settings</Text>

      {/* Advisor name — AsyncStorage */}
      <Text style={styles.section}>Advisor profile</Text>
      <Text style={styles.label}>Advisor name</Text>
      <TextInput
        style={styles.input}
        value={nameInput}
        onChangeText={setNameInput}
        placeholder="Enter your name"
      />
      <Pressable style={styles.button} onPress={saveName}>
        <Text style={styles.buttonText}>Save name</Text>
      </Pressable>
      <Text style={styles.readout}>
        {savedName ? `Advisor: ${savedName}` : "Advisor: (not set)"}
      </Text>

      {/* Token — SecureStore */}
      <Text style={styles.section}>Secure token</Text>
      <Pressable style={styles.button} onPress={issueToken}>
        <Text style={styles.buttonText}>Issue token</Text>
      </Pressable>
      {tokenSaved ? <Text style={styles.success}>Token saved</Text> : null}

      {/* Network demo */}
      <Text style={styles.section}>Network</Text>
      <View style={styles.row}>
        <Pressable style={[styles.button, styles.flexButton]} onPress={checkNetwork}>
          <Text style={styles.buttonText}>Check network</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.flexButton, styles.secondaryButton]}
          onPress={breakNetwork}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Break network
          </Text>
        </Pressable>
      </View>
      {networkStatus === "loading" && <Text style={styles.readout}>Loading</Text>}
      {networkStatus === "success" && (
        <Text style={styles.success}>{networkResult}</Text>
      )}
      {networkStatus === "error" && (
        <Text style={styles.error}>Network error</Text>
      )}

      {/* Deep link notes */}
      <Text style={styles.section}>Deep link</Text>
      <Text style={styles.readout}>Scheme: hdfclife</Text>
      <Text style={styles.readout}>
        Example: hdfclife://policy/HDFC-LIFE-1004
      </Text>
      <Text style={styles.hint}>
        Opening that URL (e.g. via `npx uri-scheme open` or a link on-device)
        navigates straight to Policy Detail for HDFC-LIFE-1004.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 8, color: "#1a1a1a" },
  section: {
    fontSize: 15,
    fontWeight: "700",
    color: "#D42027",
    marginTop: 20,
    marginBottom: 8,
  },
  label: { fontSize: 13, fontWeight: "600", color: "#555", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fafafa",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#D42027",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  flexButton: { flex: 1, marginRight: 8 },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D42027",
    marginRight: 0,
  },
  secondaryButtonText: { color: "#D42027" },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  row: { flexDirection: "row" },
  readout: { fontSize: 14, color: "#333", marginTop: 8 },
  hint: { fontSize: 12, color: "#777", marginTop: 6, lineHeight: 17 },
  success: { color: "#1a7a3c", fontWeight: "600", marginTop: 8 },
  error: { color: "#a00", fontWeight: "600", marginTop: 8 },
});
