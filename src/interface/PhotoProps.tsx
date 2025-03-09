interface Photo {
  id: number;
  imageUrl: string;
  title?: string;
  isPublic: boolean;
  createdAt: string;
  colors: Color[];
}