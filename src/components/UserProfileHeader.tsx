import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { UserProfileHeaderProps } from "../interfaces/UserProfileHeaderProps";
import { styles } from "../styles/userProfileHeader";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const UserProfileHeader: React.FC<UserProfileHeaderProps & { onChangePhoto?: () => void }> = ({
  profilePhoto,
  name,
  username,
  followersCount,
  followingCount,
  paletteCount,
  isFollowing,
  isCurrentUser,
  onFollowToggle,
  onPressFollowers,
  onPressFollowing,
}) => {
  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: profilePhoto || DEFAULT_AVATAR }} style={styles.avatar} />
      </View>
      
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.username}>@{username}</Text>

      {!isCurrentUser && (
        <TouchableOpacity
          style={[styles.followButton, isFollowing ? styles.unfollowButton : styles.followButton]}
          onPress={onFollowToggle}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? "Deixar de seguir" : "Seguir"}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statBox} onPress={onPressFollowers}>
          <Text style={styles.statNumber}>{followersCount}</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statBox} onPress={onPressFollowing}>
          <Text style={styles.statNumber}>{followingCount}</Text>
          <Text style={styles.statLabel}>Seguindo</Text>
        </TouchableOpacity>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{paletteCount}</Text>
          <Text style={styles.statLabel}>Paletas</Text>
        </View>
      </View>
    </View>
  );
};

export default UserProfileHeader;
