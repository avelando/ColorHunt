import { GestureResponderEvent, ViewStyle, TextStyle } from 'react-native'

export interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  filled?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}