import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseConfig";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [palettes, setPalettes] = useState<string[][]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };

    fetchToken();
    fetchPalettes();
  }, []);

  const fetchPalettes = async () => {
    try {
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const response = await fetch(
        "https://colorhunt-api.onrender.com/api/photos",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPalettes(data.palettes || []);
      } else {
        Alert.alert("Erro", data.message || "Não foi possível carregar as paletas.");
      }
    } catch (error) {
      console.error("Erro ao carregar paletas:", error);
      Alert.alert("Erro", "Erro ao carregar paletas.");
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
    }
  };

  const uploadToFirebase = async () => {
    if (!image) {
      Alert.alert("Erro", "Nenhuma foto para enviar.");
      return;
    }

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = `images/${Date.now()}.jpg`;
      const imageRef = ref(storage, filename);

      await uploadBytes(imageRef, blob);

      const downloadUrl = await getDownloadURL(imageRef);
      Alert.alert("Sucesso", "Foto enviada para o Firebase!");

      await sendToAPI(downloadUrl);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar a foto.");
      console.error("Erro ao enviar para o Firebase:", error);
    }
  };

  const sendToAPI = async (downloadUrl: string) => {
    if (!token) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

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
        Alert.alert("Sucesso", "Paleta gerada com sucesso!");
        navigation.navigate("Palette", { palette: data.palette });
      } else {
        Alert.alert("Erro", data.message || "Não foi possível gerar a paleta.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao comunicar com a API.");
      console.error("Erro ao comunicar com a API:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Paletas</Text>

      {palettes.length === 0 ? (
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

      {image && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: image }} style={styles.image} />
          <Button title="Enviar para Firebase" onPress={uploadToFirebase} />
        </View>
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
  imagePreview: {
    marginVertical: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
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
