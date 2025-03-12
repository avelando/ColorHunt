import { TabParamList } from "./TabParamList";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: {
    screen?: keyof TabParamList;
  };
  CreatePalette: { imageUri: string };
  Followers: { userId: number };
  Following: { userId: number };
};