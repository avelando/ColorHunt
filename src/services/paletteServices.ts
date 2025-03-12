import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@env";

export const uploadPalette = async (imageUrl: string, title: string) => {
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

    const text = await response.text();
    console.log("🔍 Resposta bruta da API:", text);

    try {
      const data = JSON.parse(text);
      if (!response.ok) {
        return { error: data.error || "Erro ao gerar a paleta." };
      }

      return {
        paletteId: data.palette?.id || null,
        photoId: data.palette?.photoId || null,
        colors: data.palette?.colors ?? [],
      };
    } catch (jsonError) {
      console.error("❌ Erro ao processar JSON:", jsonError);
      return { error: "Resposta inválida do servidor." };
    }
  } catch (error) {
    console.error("❌ Erro ao gerar a paleta:", error);
    return { error: "Erro de comunicação com o servidor." };
  }
};
