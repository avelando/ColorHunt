import React, { useState, useEffect } from "react";
import { 
  Text, 
  TouchableOpacity, 
  Alert, 
  FlatList, 
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SafeAreaView from "../components/ScreenContainer";
import PaletteCard from "../components/PaletteCard";
import { Palette } from "../interfaces/PaletteProps";
import { getUserPalettes } from "../services/paletteService";
import { myPaletteScreenStyles } from "../styles/myPalettesScreen";

const MyPalettesScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadPalettes = async () => {
    try {
      setLoading(true);
      const result = await getUserPalettes();
  
      console.log("🔍 Paletas recebidas:", result);
  
      if (!Array.isArray(result)) {
        throw new Error("Formato inesperado de resposta das paletas.");
      }
  
      const sortedPalettes = result.sort(
        (a: Palette, b: Palette) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  
      setPalettes(sortedPalettes);
    } catch (error) {
      console.error("❌ Erro ao carregar paletas:", error);
      Alert.alert("Erro", "Não foi possível carregar as paletas.");
    } finally {
      setLoading(false);
    }
  };  

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPalettes();
    setRefreshing(false);
  };

  useEffect(() => {
    loadPalettes();
  }, []);

  const handleTakePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert("Permissão necessária", "Você precisa permitir o uso da câmera!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      navigation.navigate("CreatePalette", { photoUri: imageUri, onSave: loadPalettes });
    }
  };

  const handleChooseFromGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      navigation.navigate("CreatePalette", { photoUri: imageUri, onSave: loadPalettes });
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Criar Nova Paleta",
      "Escolha uma opção",
      [
        { text: "📷 Tirar Foto", onPress: handleTakePhoto },
        { text: "📁 Escolher da Galeria", onPress: handleChooseFromGallery },
        { text: "❌ Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: Palette }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("EditPalette", { paletteId: item.id, onSave: loadPalettes })
      }
    >
      <PaletteCard
        palette={item}
        isPublic={item.isPublic}
        isCurrentUser={true}
        showPrivacyStatus={true}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView containerStyle={myPaletteScreenStyles.container} scrollable={false}>
      {loading ? (
        <Text style={myPaletteScreenStyles.loadingText}>Carregando...</Text>
      ) : (
        <FlatList
          data={palettes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={<View style={{ height: insets.top }} />} 
          ListEmptyComponent={
            <TouchableOpacity
              style={myPaletteScreenStyles.emptyContainer}
              onPress={showImageOptions}
            >
              <Text>Nenhuma paleta encontrada. Toque para criar uma.</Text>
            </TouchableOpacity>
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      <TouchableOpacity style={myPaletteScreenStyles.addButton} onPress={showImageOptions}>
        <Text style={myPaletteScreenStyles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MyPalettesScreen;
