import { Palette } from '../interfaces/PaletteProps';

export interface PaletteDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  imageUrl?: string;
  palette: Palette;
  onAddToFavorites: () => void;
  navigation: any;
}