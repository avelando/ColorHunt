import api from './apiService';
import { AxiosResponse, AxiosError } from 'axios';

import { Photo } from '../interface/PhotoProps';

export const uploadPhoto = async (imageUri: string): Promise<Photo> => {
  try {
    const formData = new FormData();
    
    formData.append('file', {
      uri: imageUri,
      name: `photo_${Date.now()}.jpg`,
      type: 'image/jpeg',
    } as any);

    console.log("📤 Enviando imagem para API:", formData);

    const response: AxiosResponse<{ photo: Photo }> = await api.post('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("✅ Resposta da API após upload:", response.data);

    if (!response.data.photo || !response.data.photo.id) {
      throw new Error("Erro ao obter `photoId` da API.");
    }

    return response.data.photo;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error('❌ Erro ao enviar foto:', axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
};

export const getUserPhotos = async (): Promise<Photo[]> => {
  try {
    const response: AxiosResponse<{ photos: Photo[] }> = await api.get('/photos');
    return response.data.photos;
  } catch (error) {
    console.error('❌ Erro ao buscar fotos:', error);
    throw error;
  }
};

export const deletePhoto = async (photoId: number): Promise<string> => {
  try {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/photos/${photoId}`);
    return response.data.message;
  } catch (error) {
    console.error('❌ Erro ao excluir foto:', error);
    throw error;
  }
};
