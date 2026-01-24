import apiClient from './axiosConfig';

export interface InstanceZone {
  _id: string;
  zoneId: string;
  name: string;
  bossName?: string;
  level?: number;
  description?: string;
}

export const getInstances = async (): Promise<InstanceZone[]> => {
  const response = await apiClient.get('/instances');
  return response.data;
};

