import { API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Resposta não é JSON: ${text}`);
    }

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "Credenciais inválidas.");
    }
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (
  name: string,
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, username, email, password }),
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Resposta não é JSON: ${text}`);
    }

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "Não foi possível registrar.");
    }
  } catch (error) {
    throw error;
  }
};

const processResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(`Resposta não é JSON: ${text}`);
  }
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || "Erro na requisição.");
  }
};

export const getUser = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await processResponse(response);
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userData: {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return await processResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getFollowers = async (userId: number) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/followers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await processResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getFollowing = async (userId: number) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/following`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await processResponse(response);
  } catch (error) {
    throw error;
  }
};

export const deleteUserAccount = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await processResponse(response);
  } catch (error) {
    throw error;
  }
};