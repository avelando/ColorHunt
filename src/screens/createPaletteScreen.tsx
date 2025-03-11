import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../types/types";
import { API_BASE_URL } from "@env";
import { uploadPalette } from "../services/paletteServices";

type ColorItem = {
  id: number;
  hex: string;
};

type CreatePaletteScreenProps = StackScreenProps<
  RootStackParamList,
  "CreatePalette"
>;

const CreatePaletteScreen: React.FC<CreatePaletteScreenProps> = ({
  navigation,
  route,
}) => {
  const { imageUri } = route.params;
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"initial" | "generated">("initial");
  const [paletteId, setPaletteId] = useState<number | null>(null);
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);

  useEffect(() => {
    if (imageUri) {
      generatePalette();
    }
  }, [imageUri]);

  const generatePalette = async () => {
    setLoading(true);
    const titulo = "Título qualquer";
    const result = await uploadPalette(imageUri, titulo);
    setLoading(false);

    if (result.error) {
      Alert.alert("Erro", result.error);
    } else {
      setPaletteId(result.paletteId!);
      setColors(result.colors!);
      setPhase("generated");
      setUnsavedChanges(true); // 🔥 Marca como alterado
    }
  };

  const handleColorPress = (index: number) => {
    setEditingIndex(index);
    setEditingValue(colors[index].hex);
  };

  const handleSaveColorEdit = () => {
    if (editingIndex !== null) {
      const newColors = [...colors];
      newColors[editingIndex].hex = editingValue;
      setColors(newColors);
      setEditingIndex(null);
      setEditingValue("");
      setUnsavedChanges(true); // 🔥 Marca como alterado
    }
  };

  const handleSavePalette = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }
      const updatePaletteResponse = await fetch(
        `${API_BASE_URL}/palettes/${paletteId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, isPublic: true }),
        }
      );
      if (!updatePaletteResponse.ok) {
        const errorText = await updatePaletteResponse.text();
        Alert.alert("Erro", errorText);
        setLoading(false);
        return;
      }
      for (const color of colors) {
        await fetch(`${API_BASE_URL}/colors/${color.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ hex: color.hex }),
        });
      }
      Alert.alert("Sucesso", "Paleta atualizada com sucesso!");
      setUnsavedChanges(false); // 🔥 Reseta flag de alterações
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar paleta:", error);
      Alert.alert("Erro", "Erro de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscardPalette = async () => {
    if (paletteId) {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;

        await fetch(`${API_BASE_URL}/palettes/${paletteId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Erro ao excluir paleta:", error);
      }
    }
    setExitModalVisible(false);
    navigation.goBack();
  };

  useFocusEffect(
    React.useCallback(() => {
      const handleBeforeRemove = (e: any) => {
        if (!unsavedChanges) return;
        e.preventDefault();
        setExitModalVisible(true);
      };

      navigation.addListener("beforeRemove", handleBeforeRemove);
      return () => {
        navigation.removeListener("beforeRemove", handleBeforeRemove);
      };
    }, [unsavedChanges])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Criar Paleta</Text>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <TextInput
        style={styles.titleInput}
        placeholder="Digite um título para a paleta"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.subHeading}>Paleta Gerada:</Text>
      <View style={styles.colorsContainer}>
        {colors.map((color, index) => (
          <TouchableOpacity key={color.id} onPress={() => handleColorPress(index)}>
            {editingIndex === index ? (
              <TextInput
                style={[styles.colorBox, { backgroundColor: color.hex }]}
                value={editingValue}
                onChangeText={setEditingValue}
                onBlur={handleSaveColorEdit}
                autoFocus
              />
            ) : (
              <View style={[styles.colorBox, { backgroundColor: color.hex }]}>
                <Text style={styles.colorText}>{color.hex}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={handleSavePalette}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      )}
      <Modal visible={exitModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Deseja sair sem salvar a paleta?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setExitModalVisible(false)}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleDiscardPalette}>
                <Text style={{ color: "red" }}>Sair sem salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: "#6200ee",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  subHeading: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  colorsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  colorBox: {
    width: 60,
    height: 60,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  colorText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo escuro semi-transparente
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    backgroundColor: "#f0f0f0",
  },
});

export default CreatePaletteScreen;
