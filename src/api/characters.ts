import apiClient from './axiosConfig';

export interface Character {
  _id: string;
  userId: string;
  nickname: string;
  profession: string;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export const getCharacters = async (): Promise<Character[]> => {
  const response = await apiClient.get('/characters');
  return response.data;
};

export const createCharacter = async (
  nickname: string,
  profession: string,
  level: number
): Promise<Character> => {
  const response = await apiClient.post('/characters', { nickname, profession, level });
  return response.data;
};

export const updateCharacter = async (
  id: string,
  nickname?: string,
  profession?: string,
  level?: number
): Promise<Character> => {
  const response = await apiClient.put(`/characters/${id}`, { nickname, profession, level });
  return response.data;
};

export const deleteCharacter = async (id: string): Promise<void> => {
  await apiClient.delete(`/characters/${id}`);
};

