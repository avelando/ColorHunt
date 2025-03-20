import { TabParamList } from "./TabParamList.types";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  OtherUserProfile: { userId: number };
  Tabs: {
    screen?: keyof TabParamList;
  };
  CreatePalette: { imageUri: string };
  Followers: { userId: number };
  Following: { userId: number };
};
