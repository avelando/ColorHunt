import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseConfig";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [palettes, setPalettes] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
    fetchToken();
  }, []);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Você precisa permitir o uso da câmera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const photoUri = result.assets[0].uri;
      setImage(photoUri);
      uploadToFirebase(photoUri);
    }
  };

  const uploadToFirebase = async (imageUri: string) => {
    try {
      setLoading(true);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = `images/${Date.now()}.jpg`;
      const imageRef = ref(storage, filename);

      await uploadBytes(imageRef, blob);
      const downloadUrl = await getDownloadURL(imageRef);

      await uploadToAPI(downloadUrl);
    } catch (error) {
      Alert.alert("Erro", "Erro ao enviar a imagem.");
      console.error("Erro no Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadToAPI = async (imageUrl: string) => {
    try {
      const response = await fetch("https://colorhunt-api.onrender.com/api/photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setPalettes(data.palette || []);
      } else {
        Alert.alert("Erro", "Erro ao processar a paleta.");
      }
    } catch (error) {
      console.error("Erro ao enviar para API:", error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <>
          {image && (
            <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
          )}

          {palettes.length > 0 && (
            <View style={styles.paletteContainer}>
              <Text style={styles.subtitle}>Paleta de Cores:</Text>
              <View style={styles.colorRow}>
                {palettes.map((color, index) => (
                  <View key={index} style={[styles.colorBox, { backgroundColor: color }]} />
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Tirar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.historyButton]}
            onPress={() => navigation.navigate("HistoryScreen")}
          >
            <Text style={styles.buttonText}>Ver Histórico</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  paletteContainer: {
    marginBottom: 20,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  colorBox: {
    width: 50,
    height: 50,
    margin: 5,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  historyButton: {
    backgroundColor: "#00186C",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
