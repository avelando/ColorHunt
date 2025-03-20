import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUserAccount, getUser, updateUser, uploadProfilePhoto } from "../services/userService";
import ScreenContainer from "../components/ScreenContainer";
import { Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { editStyles } from "../styles/editProfileScreen";
import CustomButton from "../components/CustomButton";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const EditProfileScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    profilePhoto: DEFAULT_AVATAR,
  });
  const [originalUser, setOriginalUser] = useState<typeof user | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newPhotoUri, setNewPhotoUri] = useState<string | null>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fetchUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) {
        Alert.alert("Erro", "Usuário não autenticado");
        return;
      }
      const userData = await getUser();
      const userFetched = {
        id: userData.id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        profilePhoto: userData.profilePhoto || DEFAULT_AVATAR,
      };
      setUser(userFetched);
      setOriginalUser(userFetched);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    fetchUserData()
  
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    }
  }, []);

  const handleChoosePhoto = () => {
    Alert.alert("Alterar Foto de Perfil", "Escolha uma opção", [
      { text: "Cancelar", style: "cancel" },
      { text: "Galeria", onPress: pickFromGallery },
      { text: "Câmera", onPress: pickFromCamera },
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
      setNewPhotoUri(result.assets[0].uri);
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
      setNewPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
  
      if (newPhotoUri) {
        await uploadProfilePhoto(newPhotoUri);
      }
  
      await updateUser({
        name: user.name,
        username: user.username,
        email: user.email,
        password: password || undefined,
      });
  
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setUpdating(false);
    }
  };    

  const isModified = originalUser
    ? user.name !== originalUser.name ||
      user.username !== originalUser.username ||
      user.email !== originalUser.email ||
      password.trim() !== "" ||
      newPhotoUri !== null
    : false;

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color="#007BFF" />
      </ScreenContainer>
    );
  }

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirmação",
      "Deseja realmente excluir sua conta? Essa ação não poderá ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: async () => {
            try {
              await deleteUserAccount();
              Alert.alert("Conta excluída", "Sua conta foi excluída com sucesso.");
              navigation.navigate("Login");
            } catch (error) {
              console.error("Erro ao excluir conta:", error);
              Alert.alert("Erro", "Não foi possível excluir sua conta.");
            }
          }
        },
      ]
    );
  };  

  return (
    <ScreenContainer>
      <View style={editStyles.container}>
        <TouchableOpacity style={editStyles.photoContainer} onPress={handleChoosePhoto}>
          <Image source={{ uri: newPhotoUri || user.profilePhoto }} style={editStyles.photo} />
          <View style={editStyles.changePhotoOverlay}>
            <Ionicons name="camera" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
        <View style={editStyles.inputContainer}>
          <View style={editStyles.inputWrapper}>
            <TextInput
              style={editStyles.input}
              value={user.name}
              placeholder="Nome"
              onChangeText={(text) => setUser((prev) => ({ ...prev, name: text }))}
            />
            <Ionicons name="pencil" size={20} color="#ccc" style={editStyles.inputIconPencil} />
          </View>
          <View style={editStyles.inputWrapper}>
            <TextInput
              style={editStyles.input}
              value={user.username}
              placeholder="Username"
              onChangeText={(text) => setUser((prev) => ({ ...prev, username: text }))}
            />
            <Ionicons name="pencil" size={20} color="#ccc" style={editStyles.inputIconPencil} />
          </View>
          <View style={editStyles.inputWrapper}>
            <TextInput
              style={editStyles.input}
              value={user.email}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={(text) => setUser((prev) => ({ ...prev, email: text }))}
            />
            <Ionicons name="pencil" size={20} color="#ccc" style={editStyles.inputIconPencil} />
          </View>
          <View style={editStyles.inputWrapper}>
            <TextInput
              style={editStyles.input}
              value={password}
              placeholder="Senha"
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={editStyles.inputIcon}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#ccc"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={editStyles.bottomButtonsContainer}>
        <CustomButton
          title="Excluir conta"
          onPress={handleDeleteAccount}
          style={editStyles.smallButton}
          filled={false}
        />
        <CustomButton
          title={updating ? "Salvando..." : "Salvar"}
          onPress={handleSave}
          style={[editStyles.smallButton, { opacity: isModified ? 1 : 0.5 }]}
          disabled={!isModified || updating}
        />
      </View>
    </ScreenContainer>
  );
};

export default EditProfileScreen;
