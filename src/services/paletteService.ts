import api from './apiService';
import { AxiosResponse } from 'axios';

import { Palette } from '../interface/PaletteProps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreatePalettePayload } from '../interface/CreatePaletteProps';

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
    formData.append('file', {
      uri: imageUri,
      name: `photo_${Date.now()}.jpg`,
      type: 'image/jpeg',
    } as any);

    formData.append('title', title);
    formData.append('isPublic', isPublic ? 'true' : 'false');

    console.log("🔍 FormData preparado. Enviando requisição para /palettes/create-with-image");
    
    const response: AxiosResponse<{ message: string; palette: Palette }> = await api.post(
      '/palettes/create-with-image',
      formData
    );

    console.log("✅ Resposta do servidor:", response.data);
    return response.data.palette;
  } catch (error) {
    console.error('❌ Erro ao criar paleta com imagem:', error);
    throw error;
  }
};

export const getUserPalettes = async (): Promise<{ palettes: Palette[] }> => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    const response: AxiosResponse<{ palettes: Palette[] }> = await api.get("/palettes/user", {
      headers: { "x-user-id": userId },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar paletas do usuário:", error);
    throw error;
  }
};

export const getPalette = async (paletteId: string): Promise<Palette> => {
  try {
    const response: AxiosResponse<Palette> = await api.get(`/palettes/${paletteId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar paleta:', error);
    throw error;
  }
};

export const updatePalette = async (paletteId: string, updateData: CreatePalettePayload): Promise<Palette> => {
  try {
    const response: AxiosResponse<Palette> = await api.patch(`/palettes/${paletteId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao atualizar paleta:', error);
    throw error;
  }
};

export const deletePalette = async (paletteId: string): Promise<string> => {
  try {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/palettes/${paletteId}`);
    return response.data.message;
  } catch (error) {
    console.error('❌ Erro ao excluir paleta:', error);
    throw error;
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
    return response.data;
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
