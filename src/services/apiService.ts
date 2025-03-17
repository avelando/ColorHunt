import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("⚠️ Token ausente. Requisição pode falhar.");
      }

      if (userId) {
        config.headers['x-user-id'] = userId;
      } else {
        console.warn("⚠️ User ID ausente. Requisição pode falhar.");
      }
    } catch (error) {
      console.error('❌ Erro ao recuperar informações do usuário:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
