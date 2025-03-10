import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../types/types";
import { API_BASE_URL } from "@env";

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

  const handleGeneratePalette = async () => {
    if (!title.trim()) {
      Alert.alert("Atenção", "Informe um título para a paleta.");
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/palettes/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl: imageUri, title, isPublic: true }),
      });
      const data = await response.json();
      if (response.ok) {
        setPaletteId(data.palette.id);
        setColors(data.palette.colors);
        setPhase("generated");
      } else {
        Alert.alert("Erro", data.error || "Erro ao gerar a paleta.");
      }
    } catch (error) {
      console.error("Erro ao gerar a paleta:", error);
      Alert.alert("Erro", "Erro de comunicação com o servidor.");
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
        const updateColorResponse = await fetch(
          `${API_BASE_URL}/colors/${color.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ hex: color.hex }),
          }
        );
        if (!updateColorResponse.ok) {
          console.error("Erro ao atualizar cor:", color.id);
        }
      }
      Alert.alert("Sucesso", "Paleta atualizada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar paleta:", error);
      Alert.alert("Erro", "Erro de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

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
      {phase === "initial" ? (
        <>
          {loading ? (
            <ActivityIndicator size="large" color="#6200ee" />
          ) : (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleGeneratePalette}
            >
              <Text style={styles.saveButtonText}>Gerar Paleta</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <Text style={styles.subHeading}>Paleta Gerada:</Text>
          <View style={styles.colorsContainer}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={color.id}
                onPress={() => handleColorPress(index)}
              >
                {editingIndex === index ? (
                  <TextInput
                    style={[styles.colorBox, { backgroundColor: color.hex }]}
                    value={editingValue}
                    onChangeText={setEditingValue}
                    onBlur={handleSaveColorEdit}
                    autoFocus
                  />
                ) : (
                  <View
                    style={[styles.colorBox, { backgroundColor: color.hex }]}
                  >
                    <Text style={styles.colorText}>{color.hex}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#6200ee" />
          ) : (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSavePalette}
            >
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          )}
        </>
      )}
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
});

export default CreatePaletteScreen;
