import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Palette } from "../interface/PaletteProps";

const PaletteCard: React.FC<{ palette: Palette; imageUrl: string; isPublic: boolean; isCurrentUser: boolean; showPrivacyStatus?: boolean; }> = ({
  palette,
  imageUrl,
  isPublic,
  isCurrentUser,
  showPrivacyStatus
}) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.photo} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{palette.title || "Sem título"}</Text>
        <View style={styles.paletteRow}>
          {palette.colors.map((color, index) => (
            <View key={index} style={[styles.colorBox, { backgroundColor: color.hex }]} />
          ))}
        </View>
        <View style={styles.infoRow}>
          {showPrivacyStatus && (
            <>
              <Ionicons
                name={isPublic ? "lock-open" : "lock-closed"}
                size={20}
                color={isPublic ? "green" : "red"}
              />
              <Text style={[styles.statusText, { color: isPublic ? "green" : "red" }]}>
                {isPublic ? "Pública" : "Privada"}
              </Text>
            </>
          )}
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
  noColorsText: {
    fontSize: 12,
    color: "#888",
    marginTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  statusText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  errorCard: {
    padding: 10,
    backgroundColor: "#f8d7da",
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  errorText: {
    color: "#721c24",
    fontWeight: "bold",
  },
});

export default PaletteCard;
