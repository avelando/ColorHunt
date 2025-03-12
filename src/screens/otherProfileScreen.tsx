import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  View,
  Alert,
} from "react-native";
import { getUserProfile, followUser, unfollowUser } from "../services/userServices";
import { Ionicons } from "@expo/vector-icons";
import PaletteCard from "../components/PaletteCard";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenContainer from "../components/ScreenContainer";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const OtherUserProfileScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { userId } = route.params;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followsBack, setFollowsBack] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const loggedUser = await AsyncStorage.getItem("userId");
        const loggedUserId = loggedUser ? parseInt(loggedUser, 10) : null;
        const data = await getUserProfile(userId);
  
        if (data && data.user) {
          const isCurrentUser = loggedUserId === userId;
  
          setUser({
            ...data.user,
            isCurrentUser,
          });
  
          setIsFollowing(data.user.isFollowing || false);
          setFollowsBack(data.user.followsBack || false);          
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        Alert.alert("Erro", "Não foi possível carregar o perfil.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserProfile();
  }, [userId]);  
  
  const handleFollowToggle = async () => {
    try {
      const loggedUser = await AsyncStorage.getItem("userId");
      const loggedUserId = loggedUser ? parseInt(loggedUser, 10) : null;
  
      if (!loggedUserId) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
  
      if (isFollowing) {
        Alert.alert(
          "Deixar de seguir",
          `Você deseja deixar de seguir ${user.name}?`,
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Confirmar",
              onPress: async () => {
                try {
                  await unfollowUser(user.id, loggedUserId);
                  setIsFollowing(false);
                  setUser((prevUser: { followersCount: number } & Record<string, any>) => ({
                    ...prevUser,
                    followersCount: Math.max(0, prevUser.followersCount - 1),
                  }));
                } catch (error) {
                  Alert.alert("Erro", "Não foi possível deixar de seguir o usuário.");
                }
              },
            },
          ]
        );
      } else {
        try {
          await followUser(loggedUserId, user.id);
          setIsFollowing(true);
          setUser((prevUser: { followersCount: number } & Record<string, any>) => ({
            ...prevUser,
            followersCount: prevUser.followersCount + 1,
          }));
        } catch (error) {
          Alert.alert("Erro", "Não foi possível seguir o usuário.");
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o status de seguimento.");
    }
  };  
  
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Perfil",
      headerStyle: { backgroundColor: "#fff", elevation: 0, shadowOpacity: 0 },
      headerLeft: () => (
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, user]);

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      </ScreenContainer>
    );
  }

  if (!user) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={styles.errorText}>Usuário não encontrado.</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.profilePhoto || DEFAULT_AVATAR }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>

        {!user.isCurrentUser && (
          <TouchableOpacity
            style={[styles.followButton, isFollowing ? styles.unfollowButton : styles.followButton]}
            onPress={handleFollowToggle}
          >
            <Text style={styles.followButtonText}>
              {isFollowing ? "Deixar de seguir" : "Seguir"}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.followersCount}</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.followingCount}</Text>
            <Text style={styles.statLabel}>Seguindo</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.palettes.length}</Text>
            <Text style={styles.statLabel}>Paletas</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Paletas</Text>

      {user.palettes.length === 0 ? (
        <Text style={styles.emptyText}>Este usuário não tem paletas públicas.</Text>
      ) : (
        <FlatList
          data={user.palettes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PaletteCard
              palette={item}
              imageUrl={item.photo ? item.photo.imageUrl : DEFAULT_AVATAR}
              isPublic={Boolean(item.isPublic)}
              isCurrentUser={user.isCurrentUser}
              showPrivacyStatus={false}
            />          
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
  profileHeader: {
    alignItems: "center",
    marginTop: -30,
    paddingTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    borderWidth: 2,
    borderColor: "#007BFF",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  username: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    width: "100%",
  },
  statBox: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f1f3f5",
    borderRadius: 10,
    width: "30%",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 15,
    color: "#444",
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#888",
  },
  headerLeft: {
    marginLeft: 10,
  },
  followButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
    alignItems: "center",
    elevation: 3,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  unfollowButton: {
    backgroundColor: "#FF4D4D",
  },
});

export default OtherUserProfileScreen;
