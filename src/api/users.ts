import apiClient from './axiosConfig';

export interface UserWithCharacters {
  _id: string;
  telegramId: number;
  username?: string;
  characters: Array<{
    _id: string;
    nickname: string;
    profession: string;
    level: number;
  }>;
}

export const getUsers = async (): Promise<UserWithCharacters[]> => {
  const response = await apiClient.get('/users');
  return response.data;
};
