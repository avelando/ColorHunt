import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@env";

export const uploadPalette = async (
  imageUrl: string,
  title: string
): Promise<{ paletteId?: number; colors?: any[]; error?: string }> => {
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

    if (response.ok) {
      return { paletteId: data.palette.id, colors: data.palette.colors };
    } else {
      return { error: data.error || "Erro ao gerar a paleta." };
    }
  } catch (error) {
    console.error("Erro ao gerar a paleta:", error);
    return { error: "Erro de comunicação com o servidor." };
  }
};
