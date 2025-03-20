import { ColorProps } from "./ColorProps";

export interface Palette {
  palette: Palette | PromiseLike<Palette>;
  id: string;
  photoId: string;
  title: string;
  isPublic: string;
  userId: string;
  createdAt: string;

  photo?: {
    id: string;
    imageUrl: string;
  };

  colors: ColorProps[];

  user?: {
    id: string;
    name: string;
    username: string;
    profilePhoto: string;
  };

  imageUrl?: string;
}
