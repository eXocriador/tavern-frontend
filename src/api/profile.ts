import apiClient from './axiosConfig';

export interface Profile {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  characterName?: string;
  characterLevel?: number;
  timezone?: string;
  language?: string;
  createdAt: string;
}

export const getProfile = async (): Promise<Profile> => {
  const response = await apiClient.get('/profile');
  return response.data;
};

export const updateProfile = async (data: {
  characterName?: string;
  characterLevel?: number;
  timezone?: string;
  language?: string;
}): Promise<Profile> => {
  const response = await apiClient.put('/profile', data);
  return response.data;
};

