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
import { getFollowing } from "../services/userService";
import ScreenContainer from "../components/ScreenContainer";
import MiniTabView from "../components/TabView";
import { Ionicons } from "@expo/vector-icons";
import { followStyles } from "../styles/followScreen";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const FollowingScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { userId } = route.params;
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFollowing = async () => {
    try {
      const data = await getFollowing(userId);
      setFollowing(data);
    } catch (error) {
      console.error("Erro ao buscar usuários seguidos:", error);
      Alert.alert("Erro", "Não foi possível carregar os usuários seguidos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFollowing();
    }, [userId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowing();
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Seguindo",
      headerTitleAlign: "center",
      headerTintColor: "#000",
      headerStyle: { backgroundColor: "#fff", elevation: 0, shadowOpacity: 0 },
      headerLeft: () => (
        <TouchableOpacity style={followStyles.headerLeft} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleTabPress = (tab: "followers" | "following") => {
    if (tab === "followers") {
      navigation.replace("Followers", { userId });
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={followStyles.itemContainer}
      onPress={() => {
        console.log("Navegando para perfil de:", item.id);
        navigation.navigate("OtherUserProfile", { userId: item.id });
      }}
    >
      <Image source={{ uri: item.profilePhoto || DEFAULT_AVATAR }} style={followStyles.avatar} />
      <View style={followStyles.infoContainer}>
        <Text style={followStyles.name}>{item.name}</Text>
        <Text style={followStyles.username}>@{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer
      containerStyle={followStyles.container}
      refreshing={refreshing}
      onRefresh={onRefresh}
      scrollable={false}
    >
      <MiniTabView activeTab="following" onTabPress={handleTabPress} />
      {loading ? (
        <View style={followStyles.center}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : following.length === 0 ? (
        <View style={followStyles.center}>
          <Text style={followStyles.emptyText}>Nenhum usuário seguido encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={following}
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

export default FollowingScreen;
