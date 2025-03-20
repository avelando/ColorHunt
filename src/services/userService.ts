import api from './apiService';
import { AxiosResponse } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProps } from '../interfaces/UserProps';
import { UserProfileProps } from '../interfaces/UserProfileProps';
import { UpdateUserDataProps } from '../interfaces/UpdateUserDataProps';

export const loginUser = async (email: string, password: string) => {
  try {
    console.log("📡 Enviando requisição de login...");

    const response = await api.post('/auth/login', { email, password });

    console.log("✅ Resposta da API:", response.data);

    const { token, userId } = response.data;

    if (!token || !userId) {
      throw new Error("Resposta inválida do servidor.");
    }

    await AsyncStorage.setItem("userToken", token);
    await AsyncStorage.setItem("userId", userId);

    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao logar:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro no login.");
  }
};

export const registerUser = async (
  name: string,
  username: string,
  email: string,
  password: string
) => {
  try {
    console.log("📡 Enviando requisição de registro...");
    const response = await api.post('/auth/register', { name, username, email, password });

    console.log("✅ Usuário registrado com sucesso:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao registrar:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro no registro.");
  }
};

export const getUser = async (): Promise<UserProps> => {
  try {
    const response: AxiosResponse<UserProps> = await api.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    throw error;
  }
};

export const updateUser = async (data: UpdateUserDataProps): Promise<{ message: string; updatedUser: UserProps }> => {
  try {
    const response: AxiosResponse<{ message: string; updatedUser: UserProps }> = await api.patch("/users/me", data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao atualizar usuário:", error);
    throw error;
  }
};

export const deleteUserAccount = async (): Promise<{ message: string }> => {
  try {
    const response: AxiosResponse<{ message: string }> = await api.delete("/users/me");
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userId");
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao deletar conta:", error);
    throw error;
  }
};

export const getFollowers = async (userId: string): Promise<UserProps[]> => {
  try {
    const response: AxiosResponse<UserProps[]> = await api.get(`/users/${userId}/followers`);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar seguidores:", error);
    throw error;
  }
};

export const getFollowing = async (userId: string): Promise<UserProps[]> => {
  try {
    const response: AxiosResponse<UserProps[]> = await api.get(`/users/${userId}/following`);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar quem o usuário segue:", error);
    throw error;
  }
};

export const getUserStats = async (userId: string): Promise<{ palettes: number; followers: number; following: number }> => {
  try {
    const response: AxiosResponse<{ palettes: number; followers: number; following: number }> = await api.get(`/users/${userId}/stats`);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas do usuário:", error);
    throw error;
  }
};

export const searchUsers = async (query: string): Promise<UserProps[]> => {
  try {
    const response: AxiosResponse<{ users: UserProps[] }> = await api.get(`/users/search?q=${query}`);
    return response.data.users;
  } catch (error) {
    console.error("❌ Erro ao buscar usuários:", error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfileProps> => {
  try {
    const response: AxiosResponse<UserProfileProps> = await api.get(`/users/${userId}/profile`);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar perfil do usuário:", error);
    throw error;
  }
};

export const followUser = async (followId: string): Promise<{ message: string }> => {
  try {
    const response: AxiosResponse<{ message: string }> = await api.post("/users/follow", { followId });
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao seguir usuário:", error);
    throw error;
  }
};

export const unfollowUser = async (followId: string): Promise<{ message: string }> => {
  try {
    const response: AxiosResponse<{ message: string }> = await api.post("/users/unfollow", { followId });
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao deixar de seguir usuário:", error);
    throw error;
  }
};

export const uploadProfilePhoto = async (fileUri: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: `profile_${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    const response: AxiosResponse<{ message: string; user: UserProps }> = await api.patch("/users/me/profile-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.user.profilePhoto || "";
  } catch (error) {
    console.error("❌ Erro ao enviar foto de perfil:", error);
    throw error;
  }
};
