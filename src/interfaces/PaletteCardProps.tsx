import { Palette } from "./PaletteProps";

export interface PaletteCardProps {
  palette: Palette;
  imageUrl?: string;
  isPublic: boolean | string;
  isCurrentUser: boolean;
  showPrivacyStatus?: boolean;
}
