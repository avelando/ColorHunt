import { Palette } from "./PaletteProps";

export interface PaletteCardProps {
  palette: Palette;
  imageUrl?: string;
  isPublic: boolean | string;
  onPress?: () => void;
  showPrivacyStatus?: boolean;
  isCurrentUser?: boolean;
}
