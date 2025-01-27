import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseConfig";
import PaletteSelectionComponent from "../components/PaletteSelection";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [palettes, setPalettes] = useState<string[][]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
  
    fetchToken();
  }, []);
  
  useEffect(() => {
    if (token) {
      fetchSavedPalette();
    }
  }, [token]);

  const fetchSavedPalette = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://colorhunt-api.onrender.com/api/users/palette", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok && data.palette) {
        setSelectedPalette(data.palette);
      }
    } catch (error) {
      console.error("Erro ao buscar paleta salva:", error);
    } finally {
      setLoading(false);
    }
  };

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
        setPalettes(data.palettes || []);
      }
    } catch (error) {
      console.error("Erro ao enviar para API:", error);
    }
  };

  const handlePaletteSelect = async (palette: string[]) => {
    try {
      const response = await fetch("https://colorhunt-api.onrender.com/api/users/palette", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ palette }),
      });

      if (response.ok) {
        setSelectedPalette(palette);
        setPalettes([]);
        setImage(null);
        Alert.alert("Paleta salva com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar paleta:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Paletas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : selectedPalette ? (
        <View style={styles.paletteContainer}>
          <Text style={styles.subtitle}>Paleta Selecionada:</Text>
          <View style={styles.colorRow}>
            {selectedPalette.map((color, index) => (
              <View key={index} style={[styles.colorBox, { backgroundColor: color }]} />
            ))}
          </View>
        </View>
      ) : (
        <Text style={styles.emptyText}>Nenhuma paleta selecionada.</Text>
      )}

      {image && palettes.length > 0 ? (
        <PaletteSelectionComponent
          image={image}
          palettes={palettes}
          onSelect={handlePaletteSelect}
        />
      ) : (
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>
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
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: 16,
  },
  paletteContainer: {
    marginVertical: 20,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  colorBox: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
