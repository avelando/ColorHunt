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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  createPaletteWithImage,
  updatePalette,
  deletePalette,
  getUserPalettes,
  updateColor,
} from "../services/paletteService";
import { Palette } from "../interfaces/PaletteProps";
import LoadingScreen from "../components/LoadingScreen";
import { paletteScreenStyles } from "../styles/paletteScreen";
import { PaletteScreenProps } from "../interfaces/PaletteScreenProps";
import { Ionicons } from "@expo/vector-icons";
import ColorPickerModal from "../components/ColorPickerModal";
import CustomButton from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";
import ColorBox from "../components/ColorBox";

const CreatePaletteScreen: React.FC<PaletteScreenProps> = ({ route, navigation }) => {
  const photoUriParam = route.params?.photoUri || null;

  const [paletteName, setPaletteName] = useState("Minha Paleta");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [isPaletteSaved, setIsPaletteSaved] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [hasLoadedPalette, setHasLoadedPalette] = useState(false);
  const [hasCreatedPalette, setHasCreatedPalette] = useState(false);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (
        (nextAppState === "background" || nextAppState === "inactive") &&
        !isPaletteSaved &&
        palette &&
        palette.id
      ) {
        await deletePalette(palette.id);
        console.log("🗑 Paleta descartada porque o app foi fechado sem salvar.");
      }
    };

    const unsubscribeBeforeRemove = navigation.addListener("beforeRemove", async (e: any) => {
      if (!isPaletteSaved && palette && palette.id) {
        e.preventDefault();

        Alert.alert(
          "Sair sem salvar?",
          "Se você sair agora, a paleta será excluída. Deseja continuar?",
          [
            { text: "Cancelar", style: "cancel", onPress: () => {} },
            {
              text: "Sair",
              style: "destructive",
              onPress: async () => {
                if (palette && palette.id) {
                  await deletePalette(palette.id);
                  console.log("🗑 Paleta excluída porque o usuário saiu sem salvar.");
                }
                navigation.dispatch(e.data.action);
              },
            },
          ]
        );
      }
    });

    const appStateListener = AppState.addEventListener("change", handleAppStateChange);

    const loadPaletteData = async () => {
      if (hasLoadedPalette) return;
      try {
        setLoading(true);

        if (photoUriParam && !hasCreatedPalette) {
          const existingPalettes = await getUserPalettes();
          const duplicatePalette = existingPalettes.find(
            (p) => p.photo?.imageUrl === photoUriParam
          );

          if (duplicatePalette) {
            setPalette(duplicatePalette);
            setPaletteName(duplicatePalette.title);
            setIsPublic(String(duplicatePalette.isPublic).toLowerCase() === "true");
            setIsPaletteSaved(true);
            setHasLoadedPalette(true);
            return;
          }

          const newPalette = await createPaletteWithImage(photoUriParam, paletteName, isPublic);
          setPalette(newPalette);
          setHasCreatedPalette(true);
          setHasLoadedPalette(true);
        }
      } catch (error: any) {
        console.error("❌ Erro ao criar paleta:", error);
        Alert.alert("Erro", "Não foi possível criar a paleta.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadPaletteData();

    return () => {
      unsubscribeBeforeRemove();
      appStateListener.remove();
    };
  }, [
    navigation,
    isPaletteSaved,
    palette,
    photoUriParam,
    hasLoadedPalette,
    hasCreatedPalette,
    paletteName,
    isPublic,
  ]);

  const handleDiscardPalette = async () => {
    if (!palette || !palette.id) {
      navigation.navigate("Tabs", { screen: "Minhas Paletas" });
      return;
    }
    try {
      setLoading(true);
      await deletePalette(palette.id);
      Alert.alert("Paleta Descartada", "A paleta não finalizada foi removida com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível descartar a paleta.");
    } finally {
      setLoading(false);
      navigation.navigate("Tabs", { screen: "Minhas Paletas" });
    }
  };

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
      setIsPaletteSaved(true);
      Alert.alert("Sucesso", "Paleta salva com sucesso!");
      navigation.navigate("Tabs", { screen: "Minhas Paletas" });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a paleta.");
    } finally {
      setLoading(false);
    }
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
    <ScreenContainer scrollable={true}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={paletteScreenStyles.container}>
          <Text style={[paletteScreenStyles.headerText, { marginBottom: 15, marginTop: 15 }]}>
            Criar Paleta
          </Text>

          {palette?.photo?.imageUrl ? (
            <Image source={{ uri: palette.photo.imageUrl }} style={paletteScreenStyles.photo} />
          ) : (
            <Text style={paletteScreenStyles.warningText}>Nenhuma imagem disponível.</Text>
          )}
  
          <View style={paletteScreenStyles.inputWrapper}>
            <TextInput
              style={paletteScreenStyles.input}
              value={paletteName}
              placeholder="Nome da Paleta"
              onChangeText={(text) => {
                setPaletteName(text);
              }}
            />
            <Ionicons name="pencil" size={20} color="#ccc" style={paletteScreenStyles.inputIconPencil} />
          </View>
  
          <TouchableOpacity
            onPress={() => {
              setIsPublic(!isPublic);
            }}
            style={[
              paletteScreenStyles.privacyToggle,
              {
                backgroundColor: isPublic ? "#6a1b9a" : "#fff",
                borderColor: "#6a1b9a",
              },
            ]}
          >
            <Ionicons
              name={isPublic ? "lock-open" : "lock-closed"}
              size={18}
              color={isPublic ? "#fff" : "#6a1b9a"}
            />
            <Text
              style={[
                paletteScreenStyles.privacyToggleText,
                { color: isPublic ? "#fff" : "#6a1b9a" },
              ]}
            >
              {isPublic ? "Pública" : "Privada"}
            </Text>
          </TouchableOpacity>
  
          {palette && palette.colors && palette.colors.length > 0 && (
            <View style={[paletteScreenStyles.colorsContainer, { marginBottom: 20 }]}>
              {palette.colors.map((color, index) => (
                <ColorBox
                  key={index}
                  hex={color.hex}
                  onPress={() => handleEditColor(color.id!, color.hex)}
                />
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
              }
            }}
          />

          <View style={paletteScreenStyles.fixedBottomButtons}>
            <CustomButton
              title="Descartar"
              onPress={handleDiscardPalette}
              filled={false}
              containerStyle={{
                ...paletteScreenStyles.buttonShared,
                borderColor: "#6a1b9a",
                borderWidth: 1.5,
              }}
              textStyle={{
                ...paletteScreenStyles.buttonTextShared,
                color: "#6a1b9a",
              }}
            />
            <CustomButton
              title="Salvar"
              onPress={handleSavePalette}
              filled={true}
              containerStyle={{
                ...paletteScreenStyles.buttonShared,
                backgroundColor: "#6a1b9a",
              }}
              textStyle={{
                ...paletteScreenStyles.buttonTextShared,
                color: "#fff",
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

export default CreatePaletteScreen;
