import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { CustomButtonProps } from "../interfaces/CustomButtonProps";
import { buttonStyles } from "../styles/button";

export interface ExtendedCustomButtonProps extends CustomButtonProps {
  hasBorder?: boolean;
}

const CustomButton: React.FC<ExtendedCustomButtonProps> = ({
  title,
  onPress,
  filled = true,
  containerStyle,
  textStyle,
  style,
  disabled = false,
  hasBorder = true,
}) => {
  const defaultPaddingVertical = 15;
  const defaultPaddingHorizontal = 10;
  
  const borderWidth = hasBorder ? 2 : 0;
  const adjustedPaddingVertical = filled ? defaultPaddingVertical : defaultPaddingVertical - borderWidth;
  const adjustedPaddingHorizontal = filled ? defaultPaddingHorizontal : defaultPaddingHorizontal - borderWidth;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        buttonStyles.button,
        {
          paddingHorizontal: adjustedPaddingHorizontal,
          borderRadius: 5,
          backgroundColor: filled ? "#6a1b9a" : "transparent",
          borderColor: "#6a1b9a",
          borderWidth: filled ? 0 : borderWidth,
          opacity: disabled ? 0.5 : 1,
        },
        containerStyle,
        style,
      ]}
    >
      <Text
        style={[
          buttonStyles.buttonText,
          { color: filled ? "#fff" : "#6a1b9a" },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
