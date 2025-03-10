import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser, updateUser, getFollowers, getFollowing } from "../services/userServices";
import { getUserPalettes } from "../services/photoServices";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState({
    id: 0,
    name: "",
    username: "",
    email: "",
  });
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [palettesCount, setPalettesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [modified, setModified] = useState(false);

  const fetchData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) {
        Alert.alert("Erro", "Usuário não autenticado");
        return;
      }
      const userId = parseInt(storedUserId, 10);

      const userData = await getUser();
      setUser({ ...userData });

      const followers = await getFollowers(userId);
      setFollowersCount(followers.length);

      const following = await getFollowing(userId);
      setFollowingCount(following.length);

      const palettesRes = await getUserPalettes();
      setPalettesCount(palettesRes.length);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "Erro ao carregar dados do usuário");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (modified) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity style={styles.headerButton} onPress={handleUpdate}>
            <Text style={styles.headerButtonText}>Salvar</Text>
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({ headerRight: () => null });
    }
  }, [navigation, modified]);

  const handleUpdate = async () => {
    if (!user.name || !user.username || !user.email) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }
    try {
      setUpdating(true);
      const dataToUpdate = {
        name: user.name,
        username: user.username,
        email: user.email,
      };
      const updated = await updateUser(dataToUpdate);
      setUser({ ...updated.updatedUser });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso");
      setModified(false);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.message || "Falha ao atualizar perfil");
    } finally {
      setUpdating(false);
    }
  };

  const navigateToScreen = (screen: string) => {
    navigation.navigate(screen, { userId: user.id });
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
      <View style={[styles.center, styles.container]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={user.name}
          onChangeText={(text) => {
            setUser({ ...user, name: text });
            setModified(true);
          }}
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={user.username}
          onChangeText={(text) => {
            setUser({ ...user, username: text });
            setModified(true);
          }}
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={user.email}
          onChangeText={(text) => {
            setUser({ ...user, email: text });
            setModified(true);
          }}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statBox} onPress={() => navigateToScreen("Followers")}>
          <Text style={styles.statNumber}>{followersCount}</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statBox} onPress={() => navigateToScreen("Following")}>
          <Text style={styles.statNumber}>{followingCount}</Text>
          <Text style={styles.statLabel}>Seguindo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statBox} onPress={() => navigateToScreen("MyPalettes")}>
          <Text style={styles.statNumber}>{palettesCount}</Text>
          <Text style={styles.statLabel}>Paletas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerButton: {
    marginRight: 10,
    padding: 5,
  },
  headerButtonText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  logoutContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
