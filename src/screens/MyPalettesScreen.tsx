import React, { useState, useEffect, useRef } from "react";
import { 
  Text, 
  TouchableOpacity, 
  Alert, 
  FlatList, 
  View,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SafeAreaView from "../components/ScreenContainer";
import PaletteCard from "../components/PaletteCard";
import { Palette } from "../interfaces/PaletteProps";
import { getUserPalettes } from "../services/paletteService";
import { myPaletteScreenStyles } from "../styles/myPalettesScreen";
import { Ionicons } from "@expo/vector-icons"

const MyPalettesScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [expandOptions, setExpandOptions] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

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
    Animated.timing(slideAnim, {
      toValue: expandOptions ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();    
  }, [expandOptions]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadPalettes();
    });
    return unsubscribe;
  }, [navigation]);  

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
            >
              <Text>Nenhuma paleta encontrada.</Text>
            </TouchableOpacity>
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      <View style={myPaletteScreenStyles.fabContainer}>
        <Animated.View
          style={[
            myPaletteScreenStyles.fabOptionsContainer,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0], // inicia 50 unidades abaixo e desliza para a posição final
                  }),
                },
              ],
              opacity: slideAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={myPaletteScreenStyles.fabOptionButton}
            onPress={() => {
              setExpandOptions(false);
              handleTakePhoto();
            }}
          >
            <Ionicons name="camera" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={myPaletteScreenStyles.fabOptionButton}
            onPress={() => {
              setExpandOptions(false);
              handleChooseFromGallery();
            }}
          >
            <Ionicons name="image" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={myPaletteScreenStyles.fabButton}
          onPress={() => setExpandOptions(!expandOptions)}
        >
          <Text style={myPaletteScreenStyles.fabButtonText}>
            {expandOptions ? "✕" : "+"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyPalettesScreen;
