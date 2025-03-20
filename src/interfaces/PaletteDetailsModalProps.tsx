import { Palette } from "./PaletteProps";

export interface PaletteDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  imageUrl?: string;
  palette: Palette | null;
  onAddToFavorites: () => void;
}