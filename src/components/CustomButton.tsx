import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { CustomButtonProps } from "../interfaces/CustomButtonProps";
import { buttonStyles } from "../styles/button";

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  filled = true,
  containerStyle,
  textStyle,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        buttonStyles.button,
        filled
          ? { backgroundColor: "#d9534f" }
          : { borderWidth: 2, borderColor: "#d9534f", backgroundColor: "transparent" },
        containerStyle,
        style,
      ]}
    >
      <Text
        style={[
          buttonStyles.buttonText,
          filled ? { color: "#fff" } : { color: "#d9534f" },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
