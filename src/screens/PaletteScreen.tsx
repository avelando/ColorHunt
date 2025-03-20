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
  createPaletteWithImage,
  updatePalette,
  deletePalette,
  getUserPalettes,
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

const PaletteScreen: React.FC<PaletteScreenProps> = ({ route, navigation }) => {
  const paletteIdParam = route.params?.paletteId || null;
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

  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const isEditMode = Boolean(route.params?.palette);

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
            { text: "Cancelar", style: "cancel", onPress: () => { } },
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
    
        if (paletteIdParam) {
          const existingPalette = await getPalette(paletteIdParam);
    
          if (!existingPalette) {
            throw new Error("404");
          }
    
          setPalette(existingPalette);
          setPaletteName(existingPalette.title);
          setIsPublic(String(existingPalette.isPublic).toLowerCase() === "true");
          setHasLoadedPalette(true);
          return;
        }
    
        if (photoUriParam && !hasCreatedPalette) {
          const existingPalettes = await getUserPalettes();
          const duplicatePalette = existingPalettes.find((p) => p.photo?.imageUrl === photoUriParam);
    
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
        if (error.message === "404") {
          console.log("❌ [Oculto] Erro 404: Paleta não encontrada");
          navigation.goBack();
        } else {
          console.error("❌ Erro ao carregar/criar paleta:", error);
          Alert.alert("Erro", "Não foi possível carregar ou criar a paleta.");
          navigation.goBack();
        }
      } finally {
        setLoading(false);
      }
    };    

    loadPaletteData();

    return () => {
      unsubscribeBeforeRemove();
      appStateListener.remove();
    };
  }, [navigation, isPaletteSaved, palette, paletteIdParam, photoUriParam, hasLoadedPalette, hasCreatedPalette]);

  const handleDiscardPalette = async () => {
    setExitModalVisible(false);
  
    if (isEditMode) {
      setUnsavedChanges(false);
      Alert.alert("Alterações descartadas", "As alterações não salvas foram descartadas.");
      navigation.navigate("Tabs", { screen: "Minhas Paletas" });
    } else {
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
            Alert.alert("Paleta excluída com sucesso!");
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

  const handleUpdatePalette = async () => {
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

      Alert.alert("Sucesso", "Paleta atualizada com sucesso!");
      navigation.navigate("Tabs", { screen: "Minhas Paletas" });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a paleta.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePalette = async () => {
    await handleUpdatePalette();
    setIsPaletteSaved(true);
    Alert.alert("Sucesso", "Paleta salva com sucesso!");
    navigation.navigate("Tabs", { screen: "Minhas Paletas" });
  };

  if (loading) {
    return <LoadingScreen message="Carregando paleta, por favor aguarde..." />;
  }

  const handleEditColor = (colorId: string, currentColor: string) => {
    setSelectedColorId(colorId);
    setSelectedColor(currentColor);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={paletteScreenStyles.safeArea}>
      <ScrollView contentContainerStyle={paletteScreenStyles.container}>
        <Text style={paletteScreenStyles.headerText}>
          {paletteIdParam ? "Editar Paleta" : "Criar Nova Paleta"}
        </Text>

        {palette?.photo?.imageUrl || photoUriParam ? (
          <Image
            source={{ uri: palette?.photo?.imageUrl || photoUriParam }}
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
            }
          }}
        />

        <TextInput
          placeholder="Nome da Paleta"
          value={paletteName}
          onChangeText={(text) => setPaletteName(text)}
          style={paletteScreenStyles.input}
        />

        <TouchableOpacity
          onPress={() => setIsPublic(!isPublic)}
          style={[
            paletteScreenStyles.privacyButton,
            { backgroundColor: isPublic ? "green" : "red" },
          ]}
        >
          <Ionicons name={isPublic ? "lock-open" : "lock-closed"} size={18} color="white" />
          <Text style={paletteScreenStyles.privacyButtonText}>
            {isPublic ? "Pública" : "Privada"}
          </Text>
        </TouchableOpacity>

        <View style={paletteScreenStyles.buttonsContainer}>
          {paletteIdParam ? (
            <CustomButton
              title="Excluir Paleta"
              onPress={handleDeletePalette}
              filled={true}
              containerStyle={{ ...paletteScreenStyles.buttonShared, backgroundColor: "#dc3545" }}
              textStyle={{ ...paletteScreenStyles.buttonTextShared, color: "#fff" }}
            />
          ) : (
            <CustomButton
              title="Descartar"
              onPress={handleDiscardPalette}
              filled={true}
              containerStyle={{ ...paletteScreenStyles.buttonShared, backgroundColor: "#dc3545" }}
              textStyle={{ ...paletteScreenStyles.buttonTextShared, color: "#fff" }}
            />
          )}

          <CustomButton
            title="Salvar Paleta"
            onPress={handleSavePalette}
            filled={true}
            containerStyle={{ ...paletteScreenStyles.buttonShared, backgroundColor: "#28a745" }}
            textStyle={{ ...paletteScreenStyles.buttonTextShared, color: "#fff" }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaletteScreen;
