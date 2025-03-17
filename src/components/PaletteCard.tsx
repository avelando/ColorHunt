import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Palette } from "../interface/PaletteProps";

interface PaletteCardProps {
  palette: Palette;
  imageUrl?: string;
  isPublic: boolean | string;
  isCurrentUser: boolean;
  showPrivacyStatus?: boolean;
}

const PaletteCard: React.FC<PaletteCardProps> = ({
  palette,
  imageUrl,
  isPublic,
  showPrivacyStatus,
}) => {
  const publicStatus = String(isPublic).toLowerCase() === "true";

  const finalImageUrl =
    imageUrl ||
    palette.imageUrl ||
    palette.photo?.imageUrl ||
    "https://via.placeholder.com/150";

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: finalImageUrl }} style={styles.photo} />
      </View>

      <View style={styles.cardContent}>
        {showPrivacyStatus && (
          <View style={styles.privacyStatus}>
            <Ionicons
              name={publicStatus ? "lock-open" : "lock-closed"}
              size={20}
              color={publicStatus ? "green" : "red"}
            />
          </View>
        )}

        <Text style={styles.title}>{palette.title || "Sem título"}</Text>
        <Text style={styles.username}>
          @{palette.user?.username || palette.userId}
        </Text>

        <View style={styles.paletteRow}>
          {palette.colors && palette.colors.length > 0 ? (
            palette.colors.map((colorObj, index) => (
              <View
                key={index}
                style={[styles.colorBox, { backgroundColor: colorObj.hex }]}
              />
            ))
          ) : (
            <Text style={styles.noColorsText}>Sem cores disponíveis</Text>
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    height: 120,
  },
  imageContainer: {
    width: 120,
    height: "100%",
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
    position: "relative",
  },
  privacyStatus: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
    padding: 2,
    zIndex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  username: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
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
});

export default PaletteCard;
