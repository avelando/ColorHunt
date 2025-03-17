import api from './apiService';

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro no login.');
  }
};

export const registerUser = async (
  name: string,
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await api.post('/auth/register', { name, username, email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro no registro.');
  }
};
