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
import { uploadToCloudinary, uploadToAPI } from "../services/photoServices";

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
      await handleUpload(photoUri);
    }
  };

  const handleUpload = async (imageUri: string) => {
    setLoading(true);
    try {
      const cloudinaryUrl = await uploadToCloudinary(imageUri);
      if (cloudinaryUrl) {
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
          return;
        }
        const apiResponse = await uploadToAPI(cloudinaryUrl, token);
        if (apiResponse && apiResponse.palette) {
          setPalettes(apiResponse.palette);
        } else {
          console.error("❌ A API não retornou uma paleta de cores!");
        }
      }
    } catch (error) {
      console.error("❌ Erro no processo de upload:", error);
      Alert.alert("Erro", "Falha ao enviar imagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <>
          {image && <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />}
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
