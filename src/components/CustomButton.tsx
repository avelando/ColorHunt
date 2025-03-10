import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { CustomButtonProps } from "../interface/CustomButtonProps";

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  filled = true,
  containerStyle,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        filled ? styles.filledButton : styles.outlineButton,
        containerStyle,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          filled ? styles.filledText : styles.outlineText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "40%",
  },
  filledButton: {
    backgroundColor: "#d9534f",
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: "#d9534f",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  filledText: {
    color: "#fff",
  },
  outlineText: {
    color: "#d9534f",
  },
});

export default CustomButton;
