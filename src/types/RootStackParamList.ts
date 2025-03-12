import { TabParamList } from "./TabParamList";

export type RootStackParamList = {
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