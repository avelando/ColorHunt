import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
  Image,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getFollowersWithStatus, followUser } from "../services/userService";
import ScreenContainer from "../components/ScreenContainer";
import MiniTabView from "../components/TabView";
import { Ionicons } from "@expo/vector-icons";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const FollowersScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { userId } = route.params;
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFollowers = async () => {
    try {
      const data = await getFollowersWithStatus(userId);
      console.log("Seguidores recebidos:", JSON.stringify(data, null, 2));
      setFollowers(data);
    } catch (error) {
      console.error("Erro ao buscar seguidores:", error);
      Alert.alert("Erro", "Não foi possível carregar os seguidores.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };  

  useFocusEffect(
    useCallback(() => {
      fetchFollowers();
    }, [userId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowers();
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Seguidores",
      headerTitleAlign: "center",
      headerTintColor: "#000",
      headerStyle: { backgroundColor: "#fff", elevation: 0, shadowOpacity: 0 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.navigate("Tabs", { screen: "Perfil" })}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleTabPress = (tab: "followers" | "following") => {
    if (tab === "following") {
      navigation.replace("Following", { userId });
    }
  };

  const handleFollow = async (followerId: number) => {
    try {
      await followUser(userId, followerId);
  
      setFollowers((prevFollowers) =>
        prevFollowers.map((f) =>
          f.id === followerId ? { ...f, followsBack: true } : f
        )
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível seguir o usuário.");
    }
  };  

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => navigation.navigate("OtherUserProfile", { userId: item.id })}
      >
        <Image source={{ uri: item.profilePhoto || DEFAULT_AVATAR }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>@{item.username}</Text>
        </View>
      </TouchableOpacity>
  
      {item.followsBack === false && (
        <TouchableOpacity style={styles.followButton} onPress={() => handleFollow(item.id)}>
          <Text style={styles.followButtonText}>Seguir</Text>
        </TouchableOpacity>
      )}
    </View>
  );      

  return (
    <ScreenContainer
      containerStyle={styles.container}
      refreshing={refreshing}
      onRefresh={onRefresh}
      scrollable={false}
    >
      <MiniTabView activeTab="followers" onTabPress={handleTabPress} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : followers.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nenhum seguidor encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={followers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerLeft: {
    marginLeft: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
  },
  infoContainer: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "#666",
  },
  followButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default FollowersScreen;
