import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { fetchUserPhotos, uploadToCloudinary } from "../services/photoServices";
import { Photo } from "../interface/PhotoProps";
import PaletteCard from "../components/PaletteCard";
import EditPaletteModal from "../components/EditPaletteModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@env";

const MyPalettesScreen = ({ navigation }: { navigation: any }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPalette, setSelectedPalette] = useState<Photo | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const photosData = await fetchUserPhotos();
  
        setPhotos(
          photosData.map((photo) => ({
            ...photo,
            title: photo.palette?.title || "Paleta sem título",
          }))
        );
      } catch (error) {
        console.error("Erro ao carregar fotos:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadPhotos();
  }, []);

  const handleCardPress = (photo: Photo) => {
    setSelectedPalette(photo);
    setModalVisible(true);
  };

  const handleUpdatePalette = (updatedPalette: Photo) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === updatedPalette.id ? updatedPalette : p))
    );
  };

  const handleDeletePalette = () => {
    if (selectedPalette) {
      setPhotos((prev) => prev.filter((p) => p.id !== selectedPalette.id));
      setModalVisible(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Adicionar Foto",
      "Escolha uma opção",
      [
        { text: "Tirar Foto", onPress: handleTakePhoto },
        { text: "Escolher da Galeria", onPress: handleChooseFromGallery },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleTakePhoto = async () => {
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
      const secureUrl = await uploadToCloudinary(photoUri);
      if (secureUrl) {
        const generatedPalette = await generatePalette(secureUrl);
        if (generatedPalette) {
          navigation.navigate("CreatePalette", { imageUri: secureUrl, palette: generatedPalette });
        } else {
          Alert.alert("Erro", "Não foi possível gerar a paleta.");
        }
      } else {
        Alert.alert("Erro", "Não foi possível enviar a imagem para o Cloudinary.");
      }
    }
  };

  const generatePalette = async (imageUrl: string) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        return null;
      }
      const response = await fetch(`${API_BASE_URL}/palettes/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl, title: "Default Title", isPublic: true }),
      });
      const data = await response.json();
      if (response.ok) {
        return data.palette;
      } else {
        Alert.alert("Erro", data.error || "Erro ao gerar a paleta.");
        return null;
      }
    } catch (error) {
      console.error("Erro ao gerar a paleta:", error);
      Alert.alert("Erro", "Erro de comunicação com o servidor.");
      return null;
    }
  };

  const handleChooseFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const photoUri = result.assets[0].uri;
      const secureUrl = await uploadToCloudinary(photoUri);
      if (secureUrl) {
        navigation.navigate("CreatePalette", { imageUri: secureUrl });
      } else {
        Alert.alert("Erro", "Não foi possível enviar a imagem para o Cloudinary.");
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Nenhuma foto encontrada.</Text>
        <TouchableOpacity style={styles.plusButton} onPress={showImageOptions}>
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardPress(item)}>
            <PaletteCard photo={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      {selectedPalette && (
        <EditPaletteModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          palette={selectedPalette}
          onUpdate={handleUpdatePalette}
          onDelete={handleDeletePalette}
        />
      )}
      <TouchableOpacity style={styles.plusButton} onPress={showImageOptions}>
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  plusButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#6200ee",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  plusButtonText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
});

export default MyPalettesScreen;
