import { ColorProps } from "./ColorProps";

export interface Palette {
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

  original?: {
    id: string;
    photoId: string;
    userId: string;
    title: string;
    isPublic: string;
    createdAt: string;
    originalId?: string;
    user?: {
      id: string;
      username: string;
    };
  };

  imageUrl?: string;
}
