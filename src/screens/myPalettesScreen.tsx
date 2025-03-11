// src/screens/MyPalettesScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { fetchUserPhotos, uploadToCloudinary } from "../services/photoServices";
import { Photo } from "../interface/PhotoProps";
import PaletteCard from "../components/PaletteCard";
import ScreenContainer from "../components/ScreenContainer";
import { useFocusEffect } from "@react-navigation/native";

const MyPalettesScreen = ({ navigation }: { navigation: any }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const photosData = await fetchUserPhotos();
      // Ordena as paletas pelas mais recentes (baseado em createdAt)
      const sortedPhotos = photosData.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setPhotos(
        sortedPhotos.map((photo) => ({
          ...photo,
          title: photo.palette?.title || "Paleta sem título",
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
      Alert.alert("Erro", "Não foi possível carregar as fotos.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  };

  // Ao clicar em um item, navega para a tela de edição, passando a paleta para edição.
  const handleCardPress = (photo: Photo) => {
    navigation.navigate("CreatePalette", { palette: photo });
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
        navigation.navigate("CreatePalette", { imageUri: secureUrl });
      } else {
        Alert.alert("Erro", "Não foi possível enviar a imagem para o Cloudinary.");
      }
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
      <ScreenContainer containerStyle={{ flex: 1, padding: 10 }} scrollable={false}>
        <ActivityIndicator size="large" color="#007BFF" />
      </ScreenContainer>
    );
  }

  if (photos.length === 0) {
    return (
      <ScreenContainer containerStyle={{ flex: 1, padding: 10, justifyContent: "center", alignItems: "center" }} scrollable={false}>
        <Text>Nenhuma foto encontrada.</Text>
        <TouchableOpacity style={styles.plusButton} onPress={showImageOptions}>
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerStyle={{ flex: 1, padding: 10 }} scrollable={false} refreshing={refreshing} onRefresh={onRefresh}>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardPress(item)}>
            <PaletteCard photo={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <TouchableOpacity style={styles.plusButton} onPress={showImageOptions}>
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
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
