import { StyleProp, ViewStyle, TextStyle } from "react-native";

export interface CustomButtonProps {
  title: string;
  onPress: () => void;
  filled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}