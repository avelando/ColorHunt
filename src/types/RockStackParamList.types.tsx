import { TabParamList } from "./TabParamList.types";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  OtherUserProfile: { userId: string };
  Tabs: {
    screen?: keyof TabParamList;
  };
  CreatePalette: { imageUri: string };
  Followers: { userId: string };
  Following: { userId: string };
  PaletteDetail: { paletteId: string };
};
