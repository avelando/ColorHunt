export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
  CreatePalette: { imageUri: string };
  Followers: { userId: number };
  Following: { userId: number };
};
