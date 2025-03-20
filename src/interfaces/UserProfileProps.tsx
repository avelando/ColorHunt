import { UserProps } from "./UserProps";

export interface UserProfileProps {
  user: UserProps;
  followersCount: number;
  followingCount: number;
  totalPalettesCount: number;
  palettes: any[];
  isFollowing: boolean;
}