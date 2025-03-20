import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { API_BASE_URL } from '@env';

const BASE_URL = API_BASE_URL || Constants.expoConfig?.extra?.API_BASE_URL;

if (!BASE_URL) {
  console.warn("⚠️ API_BASE_URL não definida. Verifique seu arquivo .env!");
}

console.log("🌐 API_BASE_URL:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        console.log("🔑 Token encontrado:", token);
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("⚠️ Token ausente. Requisição pode falhar.");
      }
    } catch (error) {
      console.error("❌ Erro ao recuperar token do usuário:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
