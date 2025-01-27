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
import PaletteSelectionComponent from "../components/PaleteSelection";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [palettes, setPalettes] = useState<string[][]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedPalettes, setGeneratedPalettes] = useState<string[][]>([]);

  useEffect(() => {
    const fetchToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };

    fetchToken();
    fetchPalettes();
  }, [token]);

  const fetchPalettes = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch("https://colorhunt-api.onrender.com/api/photos", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setPalettes(data.palettes || []);
      }
    } catch (error) {
      console.error("Erro ao carregar paletas:", error);
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
      setImage(result.assets[0].uri);

      uploadToFirebase(result.assets[0].uri);
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

      sendToAPI(downloadUrl);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar a foto.");
      console.error("Erro ao enviar para o Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendToAPI = async (downloadUrl: string) => {
    if (!token) return;

    try {
      const response = await fetch("https://colorhunt-api.onrender.com/api/photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl: downloadUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedPalettes(data.palettes);
      }
    } catch (error) {
      console.error("Erro ao comunicar com a API:", error);
    }
  };

  const handlePaletteSelect = (palette: string[]) => {
    Alert.alert("Paleta selecionada!", `Cores escolhidas: ${palette.join(", ")}`);
    navigation.navigate("Home");
  };

  if (generatedPalettes.length > 0 && image) {
    return (
      <PaletteSelectionComponent
        image={image}
        palettes={generatedPalettes}
        onSelect={handlePaletteSelect}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Paletas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : palettes.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma paleta disponível.</Text>
      ) : (
        <FlatList
          data={palettes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.paletteContainer}>
              {item.map((color, index) => (
                <View
                  key={index}
                  style={[styles.colorBox, { backgroundColor: color }]}
                />
              ))}
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Tirar Foto</Text>
      </TouchableOpacity>
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
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: 16,
  },
  paletteContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
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
