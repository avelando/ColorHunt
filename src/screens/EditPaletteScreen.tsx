import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
  AppState,
} from "react-native";
import {
  updatePalette,
  deletePalette,
  getPalette,
  updateColor,
} from "../services/paletteService";
import { Palette } from "../interfaces/PaletteProps";
import LoadingScreen from "../components/LoadingScreen";
import { paletteScreenStyles } from "../styles/paletteScreen";
import { PaletteScreenProps } from "../interfaces/PaletteScreenProps";
import { Ionicons } from "@expo/vector-icons";
import ColorPickerModal from "../components/ColorPickerModal";
import CustomButton from "../components/CustomButton";

const EditPaletteScreen: React.FC<PaletteScreenProps> = ({ route, navigation }) => {
  const paletteIdParam = route.params?.paletteId;
  
  const [paletteName, setPaletteName] = useState("Minha Paleta");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [originalPalette, setOriginalPalette] = useState<Palette | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [hasLoadedPalette, setHasLoadedPalette] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    const unsubscribeBeforeRemove = navigation.addListener("beforeRemove", (e: any) => {
      if (unsavedChanges) {
        e.preventDefault();
        Alert.alert(
          "Descartar alterações?",
          "Você tem alterações não salvas. Deseja descartar as alterações e sair?",
          [
            { text: "Cancelar", style: "cancel", onPress: () => {} },
            {
              text: "Descartar",
              style: "destructive",
              onPress: () => {
                setUnsavedChanges(false);
                navigation.dispatch(e.data.action);
              },
            },
          ]
        );
      }
    });

    return () => {
      unsubscribeBeforeRemove();
    };
  }, [navigation, unsavedChanges]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (
        (nextAppState === "inactive" || nextAppState === "background") &&
        unsavedChanges &&
        originalPalette
      ) {
        setPalette(originalPalette);
        setPaletteName(originalPalette.title);
        setIsPublic(String(originalPalette.isPublic).toLowerCase() === "true");
        setUnsavedChanges(false);
        console.log("Alterações não salvas foram descartadas ao sair do aplicativo.");
      }
    };

    const appStateSubscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      appStateSubscription.remove();
    };
  }, [unsavedChanges, originalPalette]);

  useEffect(() => {
    const loadPaletteData = async () => {
      if (hasLoadedPalette) return;
      if (!paletteIdParam) {
        Alert.alert("Erro", "ID da paleta não fornecido.");
        navigation.goBack();
        return;
      }
      try {
        setLoading(true);
        const existingPalette = await getPalette(paletteIdParam);
        if (!existingPalette) {
          throw new Error("404");
        }
        setPalette(existingPalette);
        setOriginalPalette(existingPalette);
        setPaletteName(existingPalette.title);
        setIsPublic(String(existingPalette.isPublic).toLowerCase() === "true");
        setHasLoadedPalette(true);
      } catch (error: any) {
        if (error.message === "404") {
          console.log("❌ Paleta não encontrada.");
          navigation.goBack();
        } else {
          console.error("❌ Erro ao carregar paleta:", error);
          Alert.alert("Erro", "Não foi possível carregar a paleta.");
          navigation.goBack();
        }
      } finally {
        setLoading(false);
      }
    };

    loadPaletteData();
  }, [navigation, paletteIdParam, hasLoadedPalette]);

  const handleSavePalette = async () => {
    if (!palette) return;
    try {
      setLoading(true);
      const updatedPalette = await updatePalette(palette.id, {
        title: paletteName,
        isPublic: isPublic ? "true" : "false",
      });
      setPalette(updatedPalette);
      await Promise.all(
        updatedPalette.colors.map(async (color, index) => {
          const newHex = palette.colors[index]?.hex;
          if (color.hex !== newHex) {
            await updateColor(color.id, newHex);
          }
        })
      );
      setUnsavedChanges(false);
      Alert.alert("Sucesso", "Paleta atualizada com sucesso!");
      navigation.navigate("Tabs", { screen: "Minhas Paletas" });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a paleta.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePalette = async () => {
    if (!palette) return;
    Alert.alert("Confirmar", "Deseja realmente excluir esta paleta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await deletePalette(palette.id);
            Alert.alert("Sucesso", "Paleta excluída com sucesso!");
            navigation.navigate("Tabs", { screen: "Minhas Paletas" });
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir a paleta.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleEditColor = (colorId: string, currentColor: string) => {
    setSelectedColorId(colorId);
    setSelectedColor(currentColor);
    setModalVisible(true);
  };

  if (loading) {
    return <LoadingScreen message="Carregando paleta, por favor aguarde..." />;
  }

  return (
    <SafeAreaView style={paletteScreenStyles.safeArea}>
      <ScrollView contentContainerStyle={paletteScreenStyles.container}>
        <Text style={paletteScreenStyles.headerText}>Editar Paleta</Text>

        {palette?.photo?.imageUrl ? (
          <Image
            source={{ uri: palette.photo.imageUrl }}
            style={paletteScreenStyles.photo}
          />
        ) : (
          <Text style={paletteScreenStyles.warningText}>Nenhuma imagem disponível.</Text>
        )}

        {palette?.colors && palette.colors.length > 0 && (
          <View style={paletteScreenStyles.colorsContainer}>
            {palette.colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={paletteScreenStyles.colorItem}
                onPress={() => handleEditColor(color.id!, color.hex)}
              >
                <View
                  style={[paletteScreenStyles.colorSwatch, { backgroundColor: color.hex }]}
                />
                <Text style={paletteScreenStyles.colorHex}>{color.hex}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ColorPickerModal
          visible={modalVisible}
          color={selectedColor}
          onClose={() => setModalVisible(false)}
          onColorSelect={(newColor) => {
            if (selectedColorId && palette) {
              const updatedColors = palette.colors.map((c) =>
                c.id === selectedColorId ? { ...c, hex: newColor } : c
              );
              setPalette({ ...palette, colors: updatedColors });
              setUnsavedChanges(true);
            }
          }}
        />

        <View style={paletteScreenStyles.inputWrapper}>
          <TextInput
            style={paletteScreenStyles.input}
            value={paletteName}
            placeholder="Nome da Paleta"
            onChangeText={(text) => {
              setPaletteName(text);
              setUnsavedChanges(true);
            }}
          />
          <Ionicons name="pencil" size={20} color="#ccc" style={paletteScreenStyles.inputIconPencil} />
        </View>

        <TouchableOpacity
          onPress={() => {
            setIsPublic(!isPublic);
            setUnsavedChanges(true);
          }}
          style={[
            paletteScreenStyles.privacyButton,
            { backgroundColor: isPublic ? "green" : "red" },
          ]}
        >
          <Ionicons
            name={isPublic ? "lock-open" : "lock-closed"}
            size={18}
            color="white"
          />
          <Text style={paletteScreenStyles.privacyButtonText}>
            {isPublic ? "Pública" : "Privada"}
          </Text>
        </TouchableOpacity>

        <View style={paletteScreenStyles.buttonsContainer}>
          <CustomButton
            title="Excluir Paleta"
            onPress={handleDeletePalette}
            filled={true}
            containerStyle={{
              ...paletteScreenStyles.buttonShared,
              backgroundColor: "#dc3545",
            }}
            textStyle={{ ...paletteScreenStyles.buttonTextShared, color: "#fff" }}
          />
          <CustomButton
            title="Salvar"
            onPress={handleSavePalette}
            filled={true}
            containerStyle={{
              ...paletteScreenStyles.buttonShared,
              backgroundColor: "#28a745",
            }}
            textStyle={{ ...paletteScreenStyles.buttonTextShared, color: "#fff" }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditPaletteScreen;
