import React, { useState, useEffect, useCallback } from "react";
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
  View,
  AppState,
  AppStateStatus,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../types/RootStackParamList";
import { API_BASE_URL } from "@env";
import { uploadPalette } from "../services/paletteServices";
import ScreenContainer from "../components/ScreenContainer";
import { Ionicons } from "@expo/vector-icons";

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
    photo?: { id: number; imageUrl?: string };
  };
};

type PaletteScreenProps = StackScreenProps<RootStackParamList, "CreatePalette"> & {
  route: { params: CreatePaletteParams };
};

const PaletteScreen: React.FC<PaletteScreenProps> = ({ navigation, route }) => {
  const { imageUri, palette } = route.params;
  const isEditMode = Boolean(palette);
  const [title, setTitle] = useState(isEditMode ? palette!.title : "");
  const [loading, setLoading] = useState(!isEditMode);
  const [paletteId, setPaletteId] = useState<number | null>(isEditMode ? palette!.id : null);
  const [photoId, setPhotoId] = useState<number | null>(
    isEditMode && palette?.photo ? palette.photo.id : null
  );
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    isEditMode && palette?.photo && palette?.photo.imageUrl ? palette.photo.imageUrl : null
  );
  const [colors, setColors] = useState<ColorItem[]>(isEditMode ? palette!.colors ?? [] : []);
  const [isPublic, setIsPublic] = useState(isEditMode ? palette!.isPublic : false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const displayImageUri =
    imageUri || photoUrl || (isEditMode && photoId ? `${API_BASE_URL}/photos/${photoId}` : null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: isEditMode ? "Editar Paleta" : "Adicionar Paleta",
      headerTitleAlign: "center",
      headerTintColor: "#000",
      headerStyle: { backgroundColor: "#fff", elevation: 0, shadowOpacity: 0 },
      headerLeft: () => (
        <TouchableOpacity style={styles.headerLeft} onPress={tryDiscard}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditMode, unsavedChanges]);

  useEffect(() => {
    if (!isEditMode && imageUri) {
      generatePalette();
    }
  }, [imageUri]);

  useEffect(() => {
    if (isEditMode && paletteId) {
      fetchPaletteDetails();
    }
  }, [isEditMode, paletteId]);

  function handleAppStateChange(nextAppState: AppStateStatus) {
    if (nextAppState === "background" && unsavedChanges) {
      handleDiscard();
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [unsavedChanges]);

  const generatePalette = async () => {
    setLoading(true);
    const defaultTitle = "Minha Paleta";
    try {
      const result = await uploadPalette(imageUri!, defaultTitle);
  
      console.log("📥 Resposta da API no Frontend:", result);
  
      if (result.error) {
        Alert.alert("Erro", result.error);
      } else {
        if (result.paletteId === undefined || result.photoId === undefined) {
          Alert.alert("Erro", "Resposta inválida do servidor.");
          return;
        }
        setPaletteId(result.paletteId);
        setPhotoId(result.photoId);
        setColors(result.colors ?? []);
        setTitle(defaultTitle);
        setUnsavedChanges(true);
      }
    } catch (error) {
      console.error("Erro ao gerar paleta:", error);
      Alert.alert("Erro", "Erro ao gerar paleta.");
    } finally {
      setLoading(false);
    }
  };  

  const fetchPaletteDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token || !paletteId) return;
      const response = await fetch(`${API_BASE_URL}/palettes/${paletteId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.palette) {
          setTitle(data.palette.title);
          setColors(data.palette.colors);
          setIsPublic(data.palette.isPublic);
          if (data.palette.photo) {
            setPhotoUrl(data.palette.photo.imageUrl || null);
            setPhotoId(data.palette.photo.id);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao buscar paleta:", error);
    }
  };

  const handleColorPress = (index: number) => {
    setEditingIndex(index);
    setEditingValue(colors[index].hex);
  };

  const handleSaveColorEdit = () => {
    if (editingIndex !== null) {
      const updatedColors = [...colors];
      updatedColors[editingIndex].hex = editingValue;
      setColors(updatedColors);
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
      if (!paletteId) {
        Alert.alert("Erro", "Não há paleta para salvar.");
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
      if (!isEditMode) {
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
      }
      Alert.alert("Sucesso", "Paleta salva com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            setUnsavedChanges(false);
            navigation.navigate("Tabs", { screen: "Minhas Paletas" });
          },
        },
      ]);
    } catch {
      Alert.alert("Erro", "Erro ao salvar paleta.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePalette = async () => {
    Alert.alert("Confirmar Exclusão", "Deseja realmente excluir esta paleta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) return;
            const response = await fetch(`${API_BASE_URL}/palettes/${paletteId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            if (!response.ok) {
              const errorText = await response.text();
              Alert.alert("Erro", `Erro ao excluir a paleta: ${errorText}`);
              return;
            }
            setUnsavedChanges(false);
            navigation.navigate("Tabs", { screen: "Minhas Paletas" });
          } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao excluir a paleta.");
          }
        },
      },
    ]);
  };

  const handleDiscard = async () => {
    setExitModalVisible(false);
    if (!isEditMode && paletteId) {
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
        console.error(error);
      }
    }
    setUnsavedChanges(false);
    navigation.navigate("Tabs", { screen: "Minhas Paletas" });
  };

  const tryDiscard = () => {
    if (unsavedChanges) {
      setExitModalVisible(true);
    } else {
      navigation.navigate("Tabs", { screen: "Minhas Paletas" });
    }
  };

  const handleBeforeRemove = useCallback(
    (e: any) => {
      if (!unsavedChanges) return;
      e.preventDefault();
      setExitModalVisible(true);
    },
    [unsavedChanges]
  );

  useFocusEffect(
    useCallback(() => {
      navigation.addListener("beforeRemove", handleBeforeRemove);
      return () => {
        navigation.removeListener("beforeRemove", handleBeforeRemove);
      };
    }, [handleBeforeRemove, navigation])
  );

  return (
    <ScreenContainer containerStyle={styles.container} scrollable>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <>
          {displayImageUri && (
            <Image source={{ uri: displayImageUri }} style={styles.image} />
          )}
          <TextInput
            style={styles.titleInput}
            placeholder="Digite um título para a paleta"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setUnsavedChanges(true);
            }}
          />
          <View style={styles.switchStatusContainer}>
            <Text>Privacidade:</Text>
            <View style={styles.switchContainer}>
              <Switch
                value={isPublic}
                onValueChange={(val) => {
                  setIsPublic(val);
                  setUnsavedChanges(true);
                }}
              />
            </View>
            <View style={styles.statusWrapper}>
              {isPublic ? (
                <View style={styles.statusCard}>
                  <Ionicons name="lock-open" size={20} color="green" />
                  <Text style={styles.statusText}>Pública</Text>
                </View>
              ) : (
                <View style={styles.statusCard}>
                  <Ionicons name="lock-closed" size={20} color="red" />
                  <Text style={styles.statusText}>Privada</Text>
                </View>
              )}
            </View>
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
        </>
      )}
      {!loading &&
        (isEditMode ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.halfButtonDelete} onPress={handleDeletePalette}>
              <Ionicons name="trash" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.halfButtonSave} onPress={handleSavePalette}>
              <Ionicons name="checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.fullButton} onPress={handleSavePalette}>
              <Ionicons name="checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        ))}
      <Modal visible={exitModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {isEditMode
                ? "Deseja sair sem salvar as alterações?"
                : "Deseja sair sem salvar a paleta?"}
            </Text>
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
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  headerLeft: { marginLeft: 10 },
  titleInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  switchStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  switchContainer: { flexDirection: "row", alignItems: "center" },
  statusWrapper: { flex: 1, alignItems: "flex-end" },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: { fontSize: 16, color: "#333", marginLeft: 8, fontWeight: "bold" },
  image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 16 },
  subHeading: { fontSize: 18, marginBottom: 8, textAlign: "center", color: "#000" },
  colorsContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  colorBox: {
    width: 60,
    height: 60,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  colorText: { color: "#fff", fontWeight: "bold" },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fullButton: {
    width: "100%",
    backgroundColor: "green",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  halfButtonDelete: {
    width: "48%",
    backgroundColor: "red",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  halfButtonSave: {
    width: "48%",
    backgroundColor: "green",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10, alignItems: "center" },
  modalText: { fontSize: 18, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  modalButtons: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
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
