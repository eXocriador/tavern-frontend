import apiClient from './axiosConfig';

export interface Party {
  _id: string;
  creatorId: {
    _id: string;
    telegramId: number;
    username?: string;
  };
  zoneId: {
    _id: string;
    zoneId: string;
    name: string;
  };
  readyTime: string;
  invitedUserIds: Array<{
    _id: string;
    telegramId: number;
    username?: string;
  }>;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartyData {
  zoneId: string;
  readyTime: string;
  invitedUserIds: string[];
  selectedCharacterIds?: { [userId: string]: string };
  selectedNicknames?: { [userId: string]: string };
}

export const createParty = async (data: CreatePartyData): Promise<Party> => {
  const response = await apiClient.post('/parties', data);
  return response.data;
};

export const getMyParties = async (): Promise<Party[]> => {
  const response = await apiClient.get('/parties/me');
  return response.data;
};
