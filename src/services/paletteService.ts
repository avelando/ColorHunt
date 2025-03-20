import api from './apiService';
import { AxiosResponse } from 'axios';

import { Palette } from '../interfaces/PaletteProps';
import { CreatePalettePayload } from '../interfaces/CreatePaletteProps';

export const createPalette = async (paletteData: CreatePalettePayload): Promise<Palette> => {
  try {
    const response: AxiosResponse<{ message: string; palette: Palette }> = await api.post('/palettes', paletteData);

    return response.data.palette;
  } catch (error) {
    console.error('❌ Erro ao criar paleta:', error);
    throw error;
  }
};

export const createPaletteWithImage = async (
  imageUri: string, 
  title: string, 
  isPublic: boolean
): Promise<Palette> => {
  try {
    const formData = new FormData();

    console.log("🔍 Criando FormData com imageUri:", imageUri);

    const uriParts = imageUri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    formData.append("file", {
      uri: imageUri.startsWith("file://") ? imageUri : `file://${imageUri}`,
      name: `photo_${Date.now()}.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    formData.append("title", title);
    formData.append("isPublic", JSON.stringify(isPublic));

    console.log("🔍 FormData preparado. Enviando requisição para /palettes/create-with-image");

    const response: AxiosResponse<{ message: string; palette: Palette }> = await api.post(
      "/palettes/create-with-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Resposta do servidor:", response.data);
    return response.data.palette;
  } catch (error) {
    console.error("❌ Erro ao criar paleta com imagem:", error);
    throw error;
  }
};

export const getUserPalettes = async (): Promise<Palette[]> => {
  try {
    const response: AxiosResponse<Palette[]> = await api.get("/palettes/user");

    console.log("✅ Resposta da API em getUserPalettes:", response.data);

    if (!Array.isArray(response.data)) {
      throw new Error("Formato inesperado de resposta da API");
    }

    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar paletas do usuário:", error);
    throw error;
  }
};

export const getPalette = async (paletteId: string): Promise<Palette> => {
  try {
    const response: AxiosResponse<Palette> = await api.get(`/palettes/${paletteId}`);

    console.log("✅ Paleta recebida da API:", response.data);

    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar paleta:', error);
    throw error;
  }
};

export const updatePalette = async (paletteId: string, updateData: Partial<CreatePalettePayload>): Promise<Palette> => {
  try {
    const response: AxiosResponse<{ message: string; palette: Palette }> = await api.patch(`/palettes/${paletteId}`, updateData);
    
    console.log("✅ Paleta atualizada:", response.data.palette);
    
    return response.data.palette;
  } catch (error) {
    console.error('❌ Erro ao atualizar paleta:', error);
    throw error;
  }
};

export const updateColor = async (colorId: string, hex: string): Promise<void> => {
  try {
    const response = await api.patch(`/colors/${colorId}`, { hex });

    console.log(`✅ Cor ${colorId} atualizada para ${hex}`);
  } catch (error) {
    console.error(`❌ Erro ao atualizar a cor ${colorId}:`, error);
    throw error;
  }
};

export const deletePalette = async (paletteId: string): Promise<string> => {
  try {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/palettes/${paletteId}`);
    return response.data.message;
  } catch (error: any) {
    console.error("❌ Error deleting palette:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Erro ao excluir paleta.');
  }
};

export const getPublicPalettes = async (): Promise<Palette[]> => {
  try {
    const response: AxiosResponse<Palette[]> = await api.get('/palettes/public/all');
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar paletas públicas:', error);
    throw error;
  }
};

export const getUserPublicPalettes = async (): Promise<Palette[]> => {
  try {
    const response: AxiosResponse<Palette[]> = await api.get('/palettes/public/user');
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar paletas públicas do usuário:', error);
    throw error;
  }
};

export const getExplorePalettes = async (page = 1, limit = 10): Promise<Palette[]> => {
  try {
    const response: AxiosResponse<Palette[]> = await api.get(`/palettes/explore/all?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao explorar paletas:', error);
    throw error;
  }
};

export const getPaletteDetails = async (paletteId: string): Promise<Palette> => {
  try {
    const response: AxiosResponse<Palette> = await api.get(`/palettes/details/${paletteId}`);
    return response.data.palette;
  } catch (error) {
    console.error('❌ Erro ao buscar detalhes da paleta:', error);
    throw error;
  }
};

export const duplicatePalette = async (paletteId: string): Promise<Palette> => {
  try {
    const response: AxiosResponse<Palette> = await api.post(`/palettes/${paletteId}/duplicate`);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao duplicar paleta:', error);
    throw error;
  }
};
