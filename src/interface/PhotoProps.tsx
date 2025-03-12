import { Color } from "./ColorProps";
import { Palette } from "./PaletteProps";

export interface Photo {
  photo: any;
  id: number;
  imageUrl: string;
  createdAt: string;
  palette?: Palette;
  colors?: Color[];
}
