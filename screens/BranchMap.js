import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const MUMBAI_BRANCH = { latitude: 19.076, longitude: 72.8777 };

export default function BranchMap() {
  const [myLocation, setMyLocation] = useState(null);
  const [message, setMessage] = useState("");

  const findMyLocation = async () => {
    setMessage("");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setMessage("Location permission denied");
      return;
    }
    try {
      const position = await Location.getCurrentPositionAsync({});
      setMyLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (e) {
      setMessage("Location permission denied");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Branch Map</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: MUMBAI_BRANCH.latitude,
          longitude: MUMBAI_BRANCH.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={MUMBAI_BRANCH}
          title="MUMBAI"
          description="HDFC Life Branch"
          pinColor="#D42027"
        />
        {myLocation && (
          <Marker coordinate={myLocation} title="You" pinColor="#1a7a3c" />
        )}
      </MapView>

      <Pressable style={styles.button} onPress={findMyLocation}>
        <Text style={styles.buttonText}>My location</Text>
      </Pressable>

      {message ? <Text style={styles.warning}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "700", padding: 16, color: "#1a1a1a" },
  map: { flex: 1 },
  button: {
    backgroundColor: "#D42027",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    margin: 16,
  },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  warning: { color: "#a00", fontWeight: "600", textAlign: "center", marginBottom: 12 },
});
