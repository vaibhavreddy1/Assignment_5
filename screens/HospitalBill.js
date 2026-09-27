import React, { useState } from "react";
import { View, Text, Pressable, Image, StyleSheet, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function HospitalBill() {
  const [photoUri, setPhotoUri] = useState(null);
  const [message, setMessage] = useState("");

  const takePhoto = async () => {
    setMessage("");
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setMessage("Camera permission denied");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const chooseFromGallery = async () => {
    setMessage("");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setMessage("Gallery permission denied");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Hospital Bill</Text>

      <Pressable style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take photo</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.secondaryButton]} onPress={chooseFromGallery}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Choose from gallery</Text>
      </Pressable>

      {message ? <Text style={styles.warning}>{message}</Text> : null}

      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No photo yet</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: "#1a1a1a" },
  button: {
    backgroundColor: "#D42027",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  secondaryButton: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#D42027" },
  secondaryButtonText: { color: "#D42027" },
  warning: { color: "#a00", fontWeight: "600", marginTop: 4, marginBottom: 10 },
  preview: {
    width: "100%",
    height: 260,
    borderRadius: 10,
    marginTop: 16,
    backgroundColor: "#eee",
  },
  placeholder: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 16,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: { color: "#999" },
});
