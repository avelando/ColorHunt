import React, { useState, useEffect } from "react";
import { 
  Text, 
  FlatList, 
  View, 
  TouchableOpacity,
  Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SafeAreaView from "../components/ScreenContainer";
import PaletteCard from "../components/PaletteCard";
import PaletteDetailsModal from "../components/PaletteDetailsModal";
import { Palette } from "../interfaces/PaletteProps";
import { getPublicPalettes } from "../services/paletteService";
import { exploreStyles } from "../styles/explore";

const ExplorePalettesScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const loadPublicPalettes = async () => {
    try {
      setLoading(true);
      const result = await getPublicPalettes();

      console.log("🔍 Paletas públicas recebidas:", result);

      if (!Array.isArray(result)) {
        throw new Error("Formato inesperado de resposta das paletas.");
      }

      const sortedPalettes = result.sort(
        (a: Palette, b: Palette) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPalettes(sortedPalettes);
    } catch (error) {
      console.error("❌ Erro ao carregar paletas públicas:", error);
      Alert.alert("Erro", "Não foi possível carregar as paletas públicas.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPublicPalettes();
    setRefreshing(false);
  };

  useEffect(() => {
    loadPublicPalettes();
  }, []);

  const handleOpenModal = (palette: Palette) => {
    setSelectedPalette(palette);
    setModalVisible(true);
  };

  const handleAddToFavorites = () => {
    Alert.alert("✅ Sucesso", "Paleta adicionada à sua lista!");
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: Palette }) => (
    <TouchableOpacity onPress={() => handleOpenModal(item)}>
      <PaletteCard
        palette={item}
        isPublic={item.isPublic}
        isCurrentUser={false}
        showPrivacyStatus={true}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView containerStyle={exploreStyles.container} scrollable={false}>
      {loading ? (
        <Text style={exploreStyles.loadingText}>Carregando...</Text>
      ) : (
        <FlatList
          data={palettes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={<View style={{ height: insets.top }} />}
          ListEmptyComponent={
            <View style={exploreStyles.emptyContainer}>
              <Text>Nenhuma paleta pública encontrada.</Text>
            </View>
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      {/* Modal de Detalhes da Paleta */}
      <PaletteDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        palette={selectedPalette}
        onAddToFavorites={onRefresh}
      />
    </SafeAreaView>
  );
};

export default ExplorePalettesScreen;
