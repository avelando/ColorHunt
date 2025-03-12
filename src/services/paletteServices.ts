import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@env";

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

export const uploadPalette = async (
  imageUrl: string,
  title: string
): Promise<{ paletteId?: number; photoId?: number; colors?: any[]; error?: string }> => {
  if (!title.trim()) {
    return { error: "Informe um título para a paleta." };
  }

  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { error: "Token não encontrado. Faça login novamente." };
    }

    const response = await fetch(`${API_BASE_URL}/palettes/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl, title, isPublic: false }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Erro ao gerar a paleta." };
    }

    return {
      paletteId: data.palette.id,
      photoId: data.palette.photo.id,
      colors: data.palette.colors,
    };
  } catch (error) {
    console.error("Erro ao gerar a paleta:", error);
    return { error: "Erro de comunicação com o servidor." };
  }
};

export const getPaletteById = async (paletteId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/palettes/${paletteId}/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await processResponse(response);
    return data;
  } catch (error) {
    console.error("Erro ao buscar paleta:", error);
    throw error;
  };
};