import React from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PaletteCardProps } from "../interfaces/PaletteCardProps";
import { paletteCardStyles } from "../styles/paletteCard";

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
    <View style={paletteCardStyles.card}>
      <View style={paletteCardStyles.imageContainer}>
        <Image source={{ uri: finalImageUrl }} style={paletteCardStyles.photo} />
      </View>

      <View style={paletteCardStyles.cardContent}>
        {showPrivacyStatus && (
          <View style={paletteCardStyles.privacyStatus}>
            <Ionicons
              name={publicStatus ? "lock-open" : "lock-closed"}
              size={20}
              color={publicStatus ? "green" : "red"}
            />
          </View>
        )}

        <Text style={paletteCardStyles.title}>{palette.title || "Sem título"}</Text>
        <Text style={paletteCardStyles.username}>
          @{palette.user?.username || palette.userId}
        </Text>

        <View style={paletteCardStyles.paletteRow}>
          {palette.colors && palette.colors.length > 0 ? (
            palette.colors.map((colorObj, index) => (
              <View
                key={index}
                style={[paletteCardStyles.colorBox, { backgroundColor: colorObj.hex }]}
              />
            ))
          ) : (
            <Text style={paletteCardStyles.noColorsText}>Sem cores disponíveis</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default PaletteCard;
