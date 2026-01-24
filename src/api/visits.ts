import apiClient from './axiosConfig';

export interface Visit {
  _id: string;
  userId: string;
  zoneId: {
    _id: string;
    zoneId: string;
    name: string;
    bossName?: string;
    level?: number;
  };
  visitedAt: string;
  periodId: string;
}

export const getMyVisits = async (): Promise<Visit[]> => {
  const response = await apiClient.get('/visits/me');
  return response.data;
};

export const getUserVisits = async (telegramId: number): Promise<Visit[]> => {
  const response = await apiClient.get(`/visits/user/${telegramId}`);
  return response.data;
};

export const markVisit = async (zoneId: string): Promise<Visit> => {
  const response = await apiClient.post(`/visits/${zoneId}`);
  return response.data;
};

export const removeVisit = async (zoneId: string): Promise<void> => {
  await apiClient.delete(`/visits/${zoneId}`);
};

