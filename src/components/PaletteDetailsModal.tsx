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
import CustomButton from "./CustomButton";

const PaletteDetailsModal: React.FC<PaletteDetailsModalProps> = ({
  visible,
  onClose,
  imageUrl,
  palette,
  onAddToFavorites,
  navigation // Para navegar até o perfil do usuário
}) => {
  const [loading, setLoading] = useState(false);

  if (!palette) return null;

  const finalImageUrl =
    imageUrl ||
    palette.imageUrl ||
    palette.photo?.imageUrl ||
    "https://via.placeholder.com/150";

  // Função para duplicar a paleta e adicionar à lista do usuário
  const handleAddToFavorites = async () => {
    if (!palette) return;
    
    setLoading(true);
    try {
      await duplicatePalette(palette.id.toString());
      Alert.alert("✅ Sucesso", "Paleta adicionada às suas paletas!");
      onAddToFavorites(); // Atualiza a lista de paletas
    } catch (error) {
      console.error("❌ Erro ao duplicar paleta:", error);
      Alert.alert("❌ Erro", "Não foi possível adicionar a paleta.");
    } finally {
      setLoading(false);
    }
  };

  // Função para navegar até o perfil do criador da paleta
  const handleGoToProfile = () => {
    if (palette.user?.id) {
      navigation.navigate("UserProfile", { userId: palette.user.id });
    } else {
      Alert.alert("⚠️ Aviso", "Este usuário não tem um perfil disponível.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Botão de Fechar */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={30} color="#555" />
          </TouchableOpacity>

          {/* Imagem da Paleta */}
          <Image 
            source={{ uri: finalImageUrl }} 
            style={styles.image}
          />

          {/* Nome da Paleta */}
          <Text style={styles.paletteTitle}>{palette.title || "Sem título"}</Text>

          {/* Nome do Criador */}
          <Text style={styles.creator}>Criada por: @{palette.user?.username || "Anônimo"}</Text>

          {/* Lista de Cores com Hexadecimal */}
          <FlatList
            data={palette.colors}
            keyExtractor={(item) => item.hex}
            horizontal
            renderItem={({ item }) => (
              <View style={styles.colorContainer}>
                <View style={[styles.colorBox, { backgroundColor: item.hex }]}/>
                <Text style={styles.colorHex}>{item.hex}</Text>
              </View>
            )}
          />

          {/* Botões */}
          <View style={styles.buttonContainer}>
            {/* Botão para Ir para o Perfil do Criador */}
            <CustomButton 
              title="Perfil do criador"
              onPress={handleGoToProfile}
              filled={false}
              containerStyle={[styles.button, { borderColor: "#6a1b9a", justifyContent: "center" }]} 
              textStyle={{ fontSize: 13, color: "#6a1b9a" }}
            />

            <CustomButton 
              title={loading ? "Salvando..." : "Salvar paleta"}
              onPress={handleAddToFavorites}
              filled={true}
              containerStyle={[styles.button, { backgroundColor: "#6a1b9a"}]}
              textStyle={{ fontSize: 14, color: "#fff" }}
            />
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.67)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    height: "60%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  image: {
    width: "85%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  paletteTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  creator: {
    fontSize: 14,
    color: "#555",
  },
  colorContainer: {
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 15,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  colorHex: {
    marginTop: 5,
    fontSize: 10,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    height: 80,
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default PaletteDetailsModal;