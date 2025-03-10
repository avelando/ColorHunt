// src/screens/ProfileScreen.tsx
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
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import {
  getUser,
  updateUser,
  getFollowers,
  getFollowing,
  deleteUserAccount,
} from "../services/userServices";
import { getUserPalettes, uploadProfilePhotoToCloudinary } from "../services/photoServices";
import { API_BASE_URL } from "@env";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
  profilePhoto?: string | null;
}

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<UserData>({
    id: 0,
    name: "",
    username: "",
    email: "",
    profilePhoto: null,
  });
  // Guarda os dados originais para comparação
  const [originalUser, setOriginalUser] = useState<UserData>({
    id: 0,
    name: "",
    username: "",
    email: "",
    profilePhoto: null,
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
      setOriginalUser({ ...userData });

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

  // Compara os dados atuais com os originais
  useEffect(() => {
    if (
      user.name !== originalUser.name ||
      user.username !== originalUser.username ||
      user.email !== originalUser.email
    ) {
      setModified(true);
    } else {
      setModified(false);
    }
  }, [user, originalUser]);

  // Define o botão "Salvar" no header somente se houver modificação
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        modified ? (
          <TouchableOpacity style={styles.headerButton} onPress={handleUpdate}>
            <Text style={styles.headerButtonText}>Salvar</Text>
          </TouchableOpacity>
        ) : null,
    });
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
      setOriginalUser({ ...updated.updatedUser });
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

  const handleChooseProfilePhoto = () => {
    Alert.alert("Alterar Foto de Perfil", "Escolha uma opção", [
      { text: "Cancelar", style: "cancel" },
      { text: "Escolher da Galeria", onPress: pickFromGallery },
      { text: "Tirar Foto", onPress: pickFromCamera },
    ]);
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      await uploadProfilePhoto(uri);
    }
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Você precisa permitir o uso da câmera!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      await uploadProfilePhoto(uri);
    }
  };

  const uploadProfilePhoto = async (localUri: string) => {
    try {
      setUpdating(true);
      const cloudinaryUrl = await uploadProfilePhotoToCloudinary(localUri);
      if (!cloudinaryUrl) {
        Alert.alert("Erro", "Não foi possível enviar a imagem para o Cloudinary.");
        return;
      }
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/users/me/profile-photo`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profilePhotoUrl: cloudinaryUrl }),
      });
      const data = await response.json();
      if (response.status === 403) {
        Alert.alert("Sessão expirada", "Sua sessão expirou, por favor, faça login novamente.");
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userId");
        navigation.navigate("Login");
        return;
      }
      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar foto de perfil");
      }
      setUser((prev) => ({
        ...prev,
        profilePhoto: data.user.profilePhoto,
      }));
      setOriginalUser((prev) => ({
        ...prev,
        profilePhoto: data.user.profilePhoto,
      }));
      Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.message || "Falha ao atualizar foto de perfil");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja deletar sua conta? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar Conta",
          style: "destructive",
          onPress: async () => {
            try {
              setUpdating(true);
              await deleteUserAccount();
              Alert.alert("Conta Deletada", "Sua conta foi deletada com sucesso.");
              await AsyncStorage.removeItem("userToken");
              await AsyncStorage.removeItem("userId");
              navigation.navigate("Login");
            } catch (error: any) {
              console.error(error);
              Alert.alert("Erro", error.message || "Falha ao deletar conta");
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, styles.container]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { justifyContent: "space-between" }]}>
      {updating && (
        <View style={styles.updatingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Conteúdo Superior */}
      <View>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handleChooseProfilePhoto}>
            <Image
              source={{ uri: user.profilePhoto || DEFAULT_AVATAR }}
              style={styles.avatar}
            />
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

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
      </View>

      {/* Botões de Ação na Parte Inferior */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>Deletar Conta</Text>
        </TouchableOpacity>
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007BFF",
    borderRadius: 20,
    padding: 4,
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
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    borderColor: "#d9534f",
    borderWidth: 2,
    padding: 15,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#d9534f",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
