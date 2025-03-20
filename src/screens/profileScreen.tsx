import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {
  getUser,
  updateUser,
  getFollowers,
  getFollowing,
  deleteUserAccount,
  uploadProfilePhoto,
} from "../services/userService";
import { getUserPalettes } from "../services/paletteService";
import CustomButton from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";
import UserProfileHeader from "../components/UserProfileHeader";

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
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Salvar</Text>
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
        <View style={styles.notAuthenticatedContainer}>
          <Text style={styles.infoText}>Você não está autenticado.</Text>
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
        <View style={styles.updatingOverlay}>
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

      <View style={styles.actionButtonsContainer}>
        <CustomButton
          title="Logout"
          onPress={handleLogout}
          style={styles.halfWidthButton}
          filled={false}
        />
        <CustomButton
          title="Editar"
          onPress={() => navigation.navigate("Editar")}
          style={styles.halfWidthButton}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  updatingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  headerButton: {
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  headerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  notAuthenticatedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    marginBottom: 20,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  halfWidthButton: {
    width: "48%",
  },
});

export default ProfileScreen;
