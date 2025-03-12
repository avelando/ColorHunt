import { Color } from "./ColorProps";

export interface Palette {
  id: number;
  photoId: number;
  userId: number;
  title: string;
  isPublic: boolean;
  createdAt: string;
  showPrivacyStatus?: boolean;
  colors: Color[];
}
