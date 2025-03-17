import React, { useState, useEffect } from "react";
import { 
  Text, 
  TouchableOpacity, 
  Alert, 
  FlatList, 
  StyleSheet 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import SafeAreaView from "../components/ScreenContainer";
import PaletteCard from "../components/PaletteCard";
import { Palette } from "../interface/PaletteProps";
import { getUserPalettes } from "../services/paletteService";

const MyPalettesScreen = ({ navigation }: { navigation: any }) => {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Função para carregar as paletas do usuário
  const loadPalettes = async () => {
    try {
      setLoading(true);
      const result = await getUserPalettes();
      console.log("Paletas recebidas do serviço:", result);
      const sortedPalettes = result.palettes.sort(
        (a: Palette, b: Palette) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPalettes(sortedPalettes);
    } catch (error) {
      console.error("Erro ao carregar paletas:", error);
      Alert.alert("Erro", "Não foi possível carregar as paletas.");
    } finally {
      setLoading(false);
    }
  };

  // Atualiza as paletas ao puxar para atualizar
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPalettes();
    setRefreshing(false);
  };

  useEffect(() => {
    loadPalettes();
  }, []);

  // Função para tirar foto e navegar para a tela de criação de paleta
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

  // Função para escolher foto da galeria e navegar para a tela de criação de paleta
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

  // Renderiza cada paleta usando o PaletteCard
  const renderItem = ({ item }: { item: Palette }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("CreatePalette", { paletteId: item.id, onSave: loadPalettes })
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
    <SafeAreaView containerStyle={styles.container} scrollable={false}>
      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : (
        <FlatList
          data={palettes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <TouchableOpacity
              style={styles.emptyContainer}
              onPress={showImageOptions}
            >
              <Text>Nenhuma paleta encontrada. Toque para criar uma.</Text>
            </TouchableOpacity>
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      {/* Botão flutuante para adicionar nova paleta */}
      <TouchableOpacity style={styles.addButton} onPress={showImageOptions}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#6200ee",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default MyPalettesScreen;
