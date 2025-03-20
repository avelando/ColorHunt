import React, { useState, useEffect, useCallback } from "react";
import {
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
import { followStyles } from "../styles/followScreen";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const FollowersScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { userId } = route.params;
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFollowers = async () => {
    try {
      const data = await getFollowersWithStatus(userId);

      if (!data || !Array.isArray(data)) {
        throw new Error("Dados de seguidores inválidos.");
      }

      console.log("Seguidores recebidos:", JSON.stringify(data, null, 2));

      setFollowers(data); // ✅ Agora armazenamos corretamente
    } catch (error) {
      console.error("Erro ao buscar seguidores:", error);
      Alert.alert("Erro", "Não foi possível carregar os seguidores.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTabPress = (tab: "followers" | "following") => {
    if (tab === "following") {
      navigation.replace("Following", { userId });
    } else {
      navigation.replace("Followers", { userId });
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
          style={followStyles.headerLeft}
          onPress={() => navigation.navigate("Tabs", { screen: "Perfil" })}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleFollow = async (followerId: string) => {
    console.log("🔍 Tentando seguir usuário com ID:", followerId);
  
    try {
      const response = await followUser(followerId);
      console.log("✅ Sucesso ao seguir:", response);
  
      setFollowers((prevFollowers) =>
        prevFollowers.map((f) =>
          f.id === followerId ? { ...f, seguindoDeVolta: true } : f
        )
      );
    } catch (error) {
      console.error("❌ Erro ao seguir usuário:", error);
      Alert.alert("Erro", "Não foi possível seguir o usuário.");
    }
  };  

  const renderItem = ({ item }: { item: any }) => (
    <View style={followStyles.itemContainer}>
      <TouchableOpacity
        style={followStyles.userInfo}
        onPress={() => navigation.navigate("OtherUserProfile", { userId: item.id })}
      >
        <Image source={{ uri: item.profilePhoto || DEFAULT_AVATAR }} style={followStyles.avatar} />
        <View style={followStyles.infoContainer}>
          <Text style={followStyles.name}>{item.name}</Text>
          <Text style={followStyles.username}>@{item.username}</Text>
        </View>
      </TouchableOpacity>

      {!item.seguindoDeVolta && (
        <TouchableOpacity
          style={followStyles.followButton}
          onPress={() => handleFollow(item.id)}
        >
          <Text style={followStyles.followButtonText}>Seguir</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScreenContainer
      containerStyle={followStyles.container}
      refreshing={refreshing}
      onRefresh={onRefresh}
      scrollable={false}
    >
      <MiniTabView activeTab="followers" onTabPress={handleTabPress} />
      {loading ? (
        <View style={followStyles.center}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : followers.length === 0 ? (
        <View style={followStyles.center}>
          <Text style={followStyles.emptyText}>Nenhum seguidor encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={followers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={followStyles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </ScreenContainer>
  );
};

export default FollowersScreen;
