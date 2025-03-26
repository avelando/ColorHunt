import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PaletteDetailsModalProps } from "../interfaces/PaletteDetailsModalProps";
import { duplicatePalette } from "../services/paletteService";
import CustomButton from "./CustomButton";
import ColorBox from "./ColorBox";
import { paletteModalStyles } from "../styles/paletteModal";

const PalettePublicModal: React.FC<PaletteDetailsModalProps> = ({
  visible,
  onClose,
  imageUrl,
  palette,
  onAddToFavorites,
}) => {
  const [loading, setLoading] = useState(false);

  if (!palette) return null;

  const finalImageUrl =
    imageUrl ||
    palette.imageUrl ||
    palette.photo?.imageUrl ||
    "https://via.placeholder.com/150";

  const handleAddToFavorites = async () => {
    if (!palette) return;

    setLoading(true);
    try {
      await duplicatePalette(palette.id.toString());
      Alert.alert("✅ Sucesso", "Paleta adicionada às suas paletas!");
      onAddToFavorites();
    } catch (error) {
      console.error("❌ Erro ao duplicar paleta:", error);
      Alert.alert("❌ Erro", "Não foi possível adicionar a paleta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={paletteModalStyles.modalOverlay}>
        <View style={paletteModalStyles.modalContainer}>
          <View style={paletteModalStyles.header}>
            <Text style={paletteModalStyles.paletteTitle}>{palette.title || "Sem título"}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: finalImageUrl }}
            style={paletteModalStyles.image}
          />

          <FlatList
            data={palette.colors}
            keyExtractor={(item) => item.hex}
            horizontal
            renderItem={({ item }) => <ColorBox hex={item.hex} />}
            contentContainerStyle={{ marginTop: 15 }}
          />

          <View style={paletteModalStyles.buttonContainer}>
            <CustomButton
              title={loading ? "Copiando..." : "Copiar paleta"}
              onPress={handleAddToFavorites}
              filled={true}
              containerStyle={[
                paletteModalStyles.button,
                { backgroundColor: "#6a1b9a" },
              ]}
              textStyle={{ fontSize: 15, color: "#fff" }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PalettePublicModal;
