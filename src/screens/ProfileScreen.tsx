import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getUser,
  getFollowers,
  getFollowing,
} from "../services/userService";
import { getUserPalettes } from "../services/paletteService";
import CustomButton from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";
import UserProfileHeader from "../components/UserProfileHeader";
import { profileStyles } from "../styles/profileScreen";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    profilePhoto: DEFAULT_AVATAR,
  });
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [palettesCount, setPalettesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modified, setModified] = useState(false);

  const fetchData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) {
        Alert.alert("Erro", "Usuário não autenticado");
        return;
      }

      const userData = await getUser();
      setUser({ ...userData, profilePhoto: userData.profilePhoto || DEFAULT_AVATAR });

      const followers = await getFollowers(userData.id);
      setFollowersCount(followers.length);

      const following = await getFollowing(userData.id);
      setFollowingCount(following.length);

      const palettesRes = await getUserPalettes();
      setPalettesCount(palettesRes.length);
    } catch (error) {
      console.error("❌ Erro ao carregar dados do usuário:", error);
      Alert.alert("Erro", "Erro ao carregar dados do usuário");
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
      headerRight: () =>
        modified ? (
          <TouchableOpacity style={profileStyles.headerButton}>
            <Text style={profileStyles.headerButtonText}>Salvar</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, modified]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível fazer logout");
    }
  };

  if (loading) {
    return (
      <ScreenContainer scrollable refreshing={refreshing} onRefresh={onRefresh}>
        <ActivityIndicator size="large" color="#007BFF" />
      </ScreenContainer>
    );
  }

  if (!user.id) {
    return (
      <ScreenContainer>
        <View style={profileStyles.notAuthenticatedContainer}>
          <Text style={profileStyles.infoText}>Você não está autenticado.</Text>
          <CustomButton title="Login" onPress={() => navigation.navigate("Login")} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      scrollable
      refreshing={refreshing}
      onRefresh={onRefresh}
      containerStyle={{ flex: 1 }}
    >
      {updating && (
        <View style={profileStyles.updatingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <UserProfileHeader
        profilePhoto={user.profilePhoto}
        name={user.name}
        username={user.username}
        followersCount={followersCount}
        followingCount={followingCount}
        paletteCount={palettesCount}
        isFollowing={false}
        isCurrentUser={true}
        onFollowToggle={() => {}}
        onPressFollowers={() => navigation.navigate("Followers", { userId: user.id })}
        onPressFollowing={() => navigation.navigate("Following", { userId: user.id })}
      />

      <View style={{ flex: 1 }} />

      <View style={profileStyles.bottomButtonsContainer}>
        <CustomButton
          title="Logout"
          onPress={handleLogout}
          style={profileStyles.smallButton}
          filled={false}
        />
        <CustomButton
          title="Editar"
          onPress={() => navigation.navigate("Editar")}
          style={profileStyles.smallButton}
        />
      </View>
    </ScreenContainer>
  );
};

export default ProfileScreen;
