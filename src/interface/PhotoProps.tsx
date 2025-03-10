import { Color } from "./ColorProps";
export interface Photo {
  id: number;
  imageUrl: string;
  title?: string;
  isPublic: boolean;
  createdAt: string;
  palette?: {
    id: number;
    photoId: number;
    userId: number;
    title: string;
    isPublic: boolean;
    createdAt: string;
    colors: Color[];
  };
  colors?: Color[];
}
