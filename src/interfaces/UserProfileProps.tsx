import { UserProps } from "./UserProps";
import { Palette } from "./PaletteProps";

export interface UserProfileProps extends UserProps {
  followersCount: number;
  followingCount: number;
  totalPalettesCount: number;
  palettes: Palette[];
  isFollowing: boolean;
}
