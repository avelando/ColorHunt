import { StyleProp, ViewStyle } from "react-native";

export interface ScreenContainerProps {
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
}