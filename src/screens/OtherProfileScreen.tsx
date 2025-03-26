import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/RockStackParamList.types";
import {
  getUserProfile,
  followUser,
  unfollowUser,
} from "../services/userService";
import ScreenContainer from "../components/ScreenContainer";
import UserProfileHeader from "../components/UserProfileHeader";
import PaletteCard from "../components/PaletteCard";
import { profileStyles } from "../styles/profileScreen";
import { UserProfileProps } from "../interfaces/UserProfileProps";
import Icon from "react-native-vector-icons/Ionicons";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

type NavProp = StackNavigationProp<RootStackParamList, "OtherUserProfile">;

const OtherProfileScreen = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute();
  const { userId } = route.params as { userId: string };

  const [user, setUser] = useState<UserProfileProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingFollow, setUpdatingFollow] = useState(false);

  const fetchData = async () => {
    try {
      const userData = await getUserProfile(userId);
      setUser({
        ...userData,
        profilePhoto: userData.profilePhoto ?? DEFAULT_AVATAR,
      });
    } catch (error) {
      console.error("❌ Erro ao carregar perfil:", error);
      Alert.alert("Erro", "Não foi possível carregar o perfil do usuário.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: "Perfil do usuário",
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 12 }}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const handleFollowToggle = async () => {
    if (!user) return;
    try {
      setUpdatingFollow(true);
      if (user.isFollowing) {
        await unfollowUser(user.id);
        setUser({ ...user, isFollowing: false });
      } else {
        await followUser(user.id);
        setUser({ ...user, isFollowing: true });
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o status de seguimento.");
    } finally {
      setUpdatingFollow(false);
    }
  };

  if (loading || !user) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color="#007BFF" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerStyle={{ flex: 1 }}>
      <UserProfileHeader
        profilePhoto={user.profilePhoto ?? DEFAULT_AVATAR}
        name={user.name}
        username={user.username}
        followersCount={user.followersCount}
        followingCount={user.followingCount}
        paletteCount={user.totalPalettesCount}
        isFollowing={user.isFollowing}
        isCurrentUser={false}
        onFollowToggle={handleFollowToggle}
        onPressFollowers={() => navigation.navigate("Followers", { userId })}
        onPressFollowing={() => navigation.navigate("Following", { userId })}
      />

      {updatingFollow && (
        <ActivityIndicator size="small" color="#007BFF" />
      )}

      <Text style={[profileStyles.infoText, { marginTop: 16, marginBottom: 8 }]}>
        Paletas públicas
      </Text>

      <FlatList
        data={user.palettes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PaletteCard
            palette={item}
            isPublic={true}
            onPress={() =>
              navigation.navigate("PaletteDetail", { paletteId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={[profileStyles.infoText, { textAlign: "center" }]}>
            Nenhuma paleta pública encontrada.
          </Text>
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{
          paddingBottom: 24,
          flexGrow: 1,
        }}
      />
    </ScreenContainer>
  );
};

export default OtherProfileScreen;
