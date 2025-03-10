// src/components/EditPaletteModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Photo } from "../interface/PhotoProps"; // Certifique-se de que esses tipos estão definidos corretamente
import { Color } from "../interface/ColorProps";

// Lista de cores pré-definidas para escolha
const predefinedColors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFFFFF",
  "#000000",
];

interface EditPaletteModalProps {
  visible: boolean;
  onClose: () => void;
  palette: Photo;
  onUpdate: (updatedPalette: Photo) => void;
  onDelete: () => void;
}

const EditPaletteModal: React.FC<EditPaletteModalProps> = ({
  visible,
  onClose,
  palette,
  onUpdate,
  onDelete,
}) => {
  const [title, setTitle] = useState(palette.title || "");
  const [isPublic, setIsPublic] = useState(palette.isPublic);
  // Inicializa o estado com um array, usando palette.colors ou [] como fallback
  const [colors, setColors] = useState<Color[]>(palette.colors || []);
  // Para saber qual linha de cor está sendo editada via picker
  const [selectedColorRowIndex, setSelectedColorRowIndex] = useState<number | null>(null);

  // Atualiza o estado interno quando a paleta selecionada muda
  useEffect(() => {
    setTitle(palette.title || "");
    setIsPublic(palette.isPublic);
    setColors(palette.colors || []);
    setSelectedColorRowIndex(null);
  }, [palette]);

  const handleColorChange = (index: number, newHex: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], hex: newHex };
    setColors(newColors);
  };

  const handleSave = async () => {
    try {
      const updatedPalette: Photo = {
        ...palette,
        title,
        isPublic,
        // Passa os objetos completos, mantendo todas as propriedades (como paletteId e originImageUrl)
        colors: colors,
      };
      onUpdate(updatedPalette);
      onClose();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao atualizar paleta.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja deletar essa paleta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Deletar", style: "destructive", onPress: onDelete },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Paleta</Text>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.label}>Título:</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Privacidade:</Text>
              <Switch value={isPublic} onValueChange={setIsPublic} />
              <Text style={styles.switchLabel}>
                {isPublic ? "Pública" : "Privada"}
              </Text>
            </View>
            <Text style={styles.label}>Cores:</Text>
            {colors.map((color, index) => (
              <View key={index} style={styles.colorRow}>
                <TouchableOpacity
                  onPress={() =>
                    setSelectedColorRowIndex(
                      selectedColorRowIndex === index ? null : index
                    )
                  }
                >
                  <View
                    style={[styles.colorPreview, { backgroundColor: color.hex }]}
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.inputColor}
                  value={color.hex}
                  onChangeText={(newHex) => handleColorChange(index, newHex)}
                />
                {selectedColorRowIndex === index && (
                  <View style={styles.pickerContainer}>
                    {predefinedColors.map((predef, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.swatch, { backgroundColor: predef }]}
                        onPress={() => {
                          handleColorChange(index, predef);
                          setSelectedColorRowIndex(null);
                        }}
                      />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash" size={20} color="#fff" />
              <Text style={styles.buttonText}>Deletar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name="save" size={20} color="#fff" />
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
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
    width: "90%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    position: "relative",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalContent: {
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  colorRow: {
    marginBottom: 15,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginBottom: 5,
  },
  inputColor: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  swatch: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginRight: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    justifyContent: "center",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default EditPaletteModal;
