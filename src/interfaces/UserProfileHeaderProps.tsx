export interface UserProfileHeaderProps {
  profilePhoto?: string;
  name: string;
  username: string;
  followersCount: number;
  followingCount: number;
  paletteCount: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
  onFollowToggle: () => void;
  isEditing?: boolean;
  onChangeName?: (newName: string) => void;
  onChangeUsername?: (newUsername: string) => void;
  onPressFollowers?: () => void;
  onPressFollowing?: () => void;
}
