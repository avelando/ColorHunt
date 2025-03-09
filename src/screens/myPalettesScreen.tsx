// src/screens/MyPalettesScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { fetchUserPhotos } from "../services/photoServices";
import PaletteCard from "../components/PaletteCard";
import EditPaletteModal from "../components/EditPaletteModal";

const MyPalettesScreen = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPalette, setSelectedPalette] = useState<Photo | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const photosData = await fetchUserPhotos();
        setPhotos(photosData);
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
});

export default MyPalettesScreen;
