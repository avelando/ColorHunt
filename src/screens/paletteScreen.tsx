// src/screens/PaletteScreen.tsx
import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Switch,
  View, // Importante garantir que o View está sendo importado
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../types/types";
import { API_BASE_URL } from "@env";
import { uploadPalette } from "../services/paletteServices";
import ScreenContainer from "../components/ScreenContainer";

type ColorItem = {
  id: number;
  hex: string;
};

type CreatePaletteParams = {
  imageUri?: string;
  palette?: {
    id: number;
    title: string;
    colors?: ColorItem[];
    isPublic: boolean;
  };
};

type PaletteScreenProps = StackScreenProps<RootStackParamList, "CreatePalette"> & {
  route: {
    params: CreatePaletteParams;
  };
};

const PaletteScreen: React.FC<PaletteScreenProps> = ({ navigation, route }) => {
  const { imageUri, palette } = route.params;
  const isEditMode = palette !== undefined;

  const [title, setTitle] = useState<string>(isEditMode ? palette!.title : "");
  const [loading, setLoading] = useState<boolean>(!isEditMode);
  const [phase, setPhase] = useState<"initial" | "generated">(isEditMode ? "generated" : "initial");
  const [paletteId, setPaletteId] = useState<number | null>(isEditMode ? palette!.id : null);
  const [colors, setColors] = useState<ColorItem[]>(isEditMode ? palette!.colors ?? [] : []);
  const [isPublic, setIsPublic] = useState<boolean>(isEditMode ? palette!.isPublic : false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [exitModalVisible, setExitModalVisible] = useState<boolean>(false);

  // Configuração do header: título e seta de voltar
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: isEditMode ? "Editar Paleta" : "Adicionar Paleta",
      headerTitleAlign: "center",
      headerTintColor: "#000",
      headerStyle: { backgroundColor: "#fff", elevation: 0, shadowOpacity: 0 },
      headerLeft: () => (
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditMode]);

  // Em modo de criação, gera a paleta a partir da imagem
  useEffect(() => {
    if (!isEditMode && imageUri) {
      generatePalette();
    }
  }, [imageUri]);

  const generatePalette = async () => {
    setLoading(true);
    const defaultTitle = "Minha Paleta";
    try {
      const result = await uploadPalette(imageUri!, defaultTitle);
      if (result.error) {
        Alert.alert("Erro", result.error);
      } else {
        setPaletteId(result.paletteId!);
        setColors(result.colors ?? []);
        setTitle(defaultTitle);
        setUnsavedChanges(true);
        setPhase("generated");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao gerar paleta.");
    } finally {
      setLoading(false);
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
      setUnsavedChanges(true);
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
      const updateResponse = await fetch(`${API_BASE_URL}/palettes/${paletteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, isPublic }),
      });
      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
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
      Alert.alert("Sucesso", "Paleta salva com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      setUnsavedChanges(false);
    } catch (error) {
      Alert.alert("Erro", "Erro ao salvar paleta.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = async () => {
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
    <ScreenContainer containerStyle={styles.container} scrollable={true}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : null}

          <TextInput
            style={styles.titleInput}
            placeholder="Digite um título para a paleta"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setUnsavedChanges(true);
            }}
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Pública:</Text>
            <Switch
              value={isPublic}
              onValueChange={(val) => {
                setIsPublic(val);
                setUnsavedChanges(true);
              }}
            />
          </View>
          <Text style={styles.subHeading}>Cores:</Text>
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
          <TouchableOpacity style={styles.saveButton} onPress={handleSavePalette}>
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </>
      )}
      <Modal visible={exitModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Deseja sair sem salvar a paleta?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setExitModalVisible(false)}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleDiscard}>
                <Text style={{ color: "red" }}>Sair sem salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  headerLeft: {
    marginLeft: 10,
  },
  backText: {
    fontSize: 18,
    color: "#000",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#000",
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
    backgroundColor: "#fff",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 8,
    color: "#000",
  },
  subHeading: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
    color: "#000",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
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

export default PaletteScreen;
