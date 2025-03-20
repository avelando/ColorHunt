import React, { useState } from "react";
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PaletteDetailsModalProps } from "../interfaces/PaletteDetailsModalProps";
import { duplicatePalette } from "../services/paletteService";

const PaletteDetailsModal: React.FC<PaletteDetailsModalProps> = ({
  visible,
  onClose,
  imageUrl,
  palette,
  onAddToFavorites
}) => {
  const [loading, setLoading] = useState(false);

  if (!palette) return null;

  const finalImageUrl =
    imageUrl ||
    palette.imageUrl ||
    palette.photo?.imageUrl ||
    "https://via.placeholder.com/150";

  // Função para duplicar a paleta e adicioná-la à lista do usuário
  const handleAddToFavorites = async () => {
    if (!palette) return;
    
    setLoading(true);
    try {
      const duplicatedPalette = await duplicatePalette(palette.id.toString());
      Alert.alert("✅ Sucesso", "Paleta adicionada à sua lista!");
      onAddToFavorites(); // 🔄 Atualiza a lista de paletas
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("❌ Erro ao duplicar paleta:", error);
      Alert.alert("❌ Erro", "Não foi possível adicionar a paleta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={30} color="#555" />
          </TouchableOpacity>

          <Image 
            source={{ uri: finalImageUrl }} 
            style={styles.image}
          />

          <Text style={styles.paletteTitle}>{palette.title || "Sem título"}</Text>

          <Text style={styles.creator}>Criada por: @{palette.user?.username || "Anônimo"}</Text>

          <FlatList
            data={palette.colors}
            keyExtractor={(item) => item.hex}
            horizontal
            renderItem={({ item }) => (
              <View style={[styles.colorBox, { backgroundColor: item.hex }]}/>
            )}
          />

          {/* Botão para Adicionar à Minha Lista */}
          <TouchableOpacity 
            style={[styles.addButton, loading && { opacity: 0.5 }]}
            onPress={handleAddToFavorites}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>Adicionar à Minha Lista</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  image: {
    width: "60%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  paletteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  creator: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  colorBox: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PaletteDetailsModal;