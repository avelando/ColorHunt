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

  colors: {
    id?: string;
    hex: string;
  }[];

  user?: {
    id: string;
    name: string;
    username: string;
    profilePhoto: string;
  };

  imageUrl?: string;
}
