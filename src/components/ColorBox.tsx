import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

interface ColorBoxProps {
  hex: string;
  onPress?: () => void;
  totalColors?: number;
}

const ColorBox: React.FC<ColorBoxProps> = ({ hex, onPress, totalColors = 5 }) => {
  const screenWidth = Dimensions.get("window").width;
  const boxWidth = (screenWidth - 150) / totalColors;

  const content = (
    <View style={[styles.colorContainer, { width: boxWidth }]}>
      <View style={[styles.colorSwatch, { backgroundColor: hex, width: boxWidth * 0.9, height: boxWidth * 0.9 }]} />
      <Text style={styles.colorHex}>{hex}</Text>
    </View>
  );

  return onPress ? <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity> : content;
};

const styles = StyleSheet.create({
  colorContainer: {
    alignItems: "center",
    marginHorizontal: 2,
  },
  colorSwatch: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  colorHex: {
    marginTop: 4,
    fontSize: 11,
    color: "#333"
  },
});

export default ColorBox;
