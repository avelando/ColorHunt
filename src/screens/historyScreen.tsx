import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HistoryScreen = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenAndPhotos = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
      if (savedToken) {
        fetchPhotos(savedToken);
      }
    };
    fetchTokenAndPhotos();
  }, []);

  const fetchPhotos = async (userToken: string) => {
    try {
      setLoading(true);
      const response = await fetch("https://colorhunt-api.onrender.com/api/photos", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setPhotos(data.photos || []);
      } else {
        console.error("Erro ao buscar fotos:", data.error);
      }
    } catch (error) {
      console.error("Erro ao buscar fotos:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPhotoCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
      <Text style={styles.cardTitle}>Paleta de Cores:</Text>
      <View style={styles.paletteRow}>
        {item.colors.map((color: string, index: number) => (
          <View key={index} style={[styles.colorBox, { backgroundColor: color }]} />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Fotos e Paletas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPhotoCard}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  paletteRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 5,
  },
});

export default HistoryScreen;