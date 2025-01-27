import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";

interface PaletteSelectionProps {
  image: string;
  palettes: string[][];
  onSelect: (palette: string[]) => void;
}

const PaletteSelectionComponent: React.FC<PaletteSelectionProps> = ({
  image,
  palettes,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha uma Paleta</Text>
      <Image source={{ uri: image }} style={styles.image} />
      <FlatList
        data={palettes}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.paletteContainer} onPress={() => onSelect(item)}>
            <View style={styles.colorRow}>
              {item.map((color, index) => (
                <View key={index} style={[styles.colorBox, { backgroundColor: color }]} />
              ))}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  paletteContainer: {
    marginBottom: 20,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  colorBox: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
    borderRadius: 5,
  },
});

export default PaletteSelectionComponent;
