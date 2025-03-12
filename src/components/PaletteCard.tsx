import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PaletteCardProps } from "../interface/PaletteCardProps";

const PaletteCard: React.FC<PaletteCardProps> = ({ photo }) => {
  const colors = photo.palette?.colors || photo.colors || [];

  return (
    <View style={styles.card}>
      <Image source={{ uri: photo.imageUrl }} style={styles.photo} />
      <View style={styles.cardContent}>
      <Text style={styles.title}>
      {photo.palette?.title && photo.palette.title.trim() !== "" 
      ? photo.palette.title 
      : "Paleta sem título"}
      </Text>
        <View style={styles.paletteRow}>
          {colors.map((colorObj, index) => (
            <View
              key={index}
              style={[styles.colorBox, { backgroundColor: colorObj.hex }]}
            />
          ))}
        </View>
        <View style={styles.infoRow}>
          <Ionicons
            name="lock-open"
            size={20}
            color={photo.palette?.isPublic ? "green" : "red"}
          />
          <Text style={styles.statusText}>
            {photo.palette?.isPublic ? "Pública" : "Privada"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
  },
  photo: {
    width: 120,
    height: 120,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  paletteRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginRight: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  statusText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#333",
  },
});

export default PaletteCard;
