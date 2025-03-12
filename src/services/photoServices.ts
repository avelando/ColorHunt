import { CLOUDINARY_API_URL, CLOUDINARY_UPLOAD_PRESET, API_BASE_URL, PROFILE_UPLOAD_PRESET } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Palette } from "../interface/PaletteProps";
import { Photo } from "../interface/PhotoProps";
import { Color } from "../interface/ColorProps";

export const uploadToCloudinary = async (imageUri: string): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_API_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok && data.secure_url) {
      console.log("✅ Imagem enviada para Cloudinary:", data.secure_url);
      
      return data.secure_url;
    } else {
      throw new Error("Erro ao enviar imagem para o Cloudinary");
    }
  } catch (error) {
    console.error("❌ Erro no upload para o Cloudinary:", error);
    return null;
  }
};

export const uploadToAPI = async (imageUrl: string, token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/photos/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Imagem salva na API e paleta gerada:", data);
      return data;
    } else {
      throw new Error(data.message || "Erro ao processar a paleta.");
    }
  } catch (error) {
    console.error("❌ Erro ao enviar para API:", error);
    return null;
  }
};

export const fetchUserPhotos = async (): Promise<Photo[]> => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/photos/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro ao buscar fotos:", errorText);
      throw new Error(`Erro ${response.status}`);
    }

    const data = await response.json();

    console.log("📸 Fotos recebidas da API:", data);


    return data.photos.map((photo: Photo) => ({
      ...photo,
      title: photo.palette?.title || "Paleta sem título",
    })) as Photo[];  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
};

export const updatePalette = async (
  photoId: number,
  title: string,
  isPublic: boolean
): Promise<Photo> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) throw new Error("Token não encontrado.");
  
  const response = await fetch(`${API_BASE_URL}/photos/${photoId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, isPublic }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  return (await response.json()) as Photo;
};

export const updateColor = async (colorId: number, hex: string): Promise<Color> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) throw new Error("Token não encontrado.");

  const response = await fetch(`${API_BASE_URL}/colors/${colorId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ hex }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  return (await response.json()) as Color;
};

export const deletePalette = async (photoId: number): Promise<void> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) throw new Error("Token não encontrado.");

  const response = await fetch(`${API_BASE_URL}/photos/${photoId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
};

export const getUserPalettes = async (): Promise<Palette[]> => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/palettes/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro ao buscar paletas:", errorText);
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Paletas recebidas:", data);
    return data.palettes as Palette[];
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
};

export const uploadProfilePhotoToCloudinary = async (imageUri: string): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    } as any);
    formData.append("upload_preset", PROFILE_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_API_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok && data.secure_url) {
      console.log("✅ Profile photo uploaded to Cloudinary:", data.secure_url);
      return data.secure_url;
    } else {
      throw new Error("Error uploading profile photo to Cloudinary");
    }
  } catch (error) {
    console.error("❌ Error in uploadProfilePhotoToCloudinary:", error);
    return null;
  }
};
