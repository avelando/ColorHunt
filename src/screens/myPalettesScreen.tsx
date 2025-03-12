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
import SafeAreaView from "../components/ScreenContainer";
import { useFocusEffect } from "@react-navigation/native";

const MyPalettesScreen = ({ navigation }: { navigation: any }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const photosData = await fetchUserPhotos();
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
      <SafeAreaView containerStyle={{ flex: 1, padding: 10 }} scrollable={false}>
        <ActivityIndicator size="large" color="#007BFF" />
      </SafeAreaView>
    );
  }

  if (photos.length === 0) {
    return (
      <SafeAreaView containerStyle={{ flex: 1, padding: 10, justifyContent: "center", alignItems: "center" }} scrollable={false}>
        <Text>Nenhuma foto encontrada.</Text>
        <TouchableOpacity style={styles.plusButton} onPress={showImageOptions}>
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView containerStyle={{ flex: 1, padding: 10 }} scrollable={false} refreshing={refreshing} onRefresh={onRefresh}>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardPress(item)}>
            {item.palette ? (
              <PaletteCard
                palette={item.palette}
                imageUrl={item.imageUrl}
                isPublic={item.palette?.isPublic ?? false}
                isCurrentUser={true}
                showPrivacyStatus={true}
              />
            ) : (
              <Text style={{ textAlign: "center", marginVertical: 10 }}>Paleta inválida</Text>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <TouchableOpacity style={styles.plusButton} onPress={showImageOptions}>
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
