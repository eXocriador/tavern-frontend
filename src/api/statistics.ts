import apiClient from './axiosConfig';

export interface Visit {
  _id: string;
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

export interface ZoneStat {
  _id: string;
  zoneId: {
    _id: string;
    zoneId: string;
    name: string;
    bossName?: string;
  };
  totalVisits: number;
  lastVisited?: string;
}

export interface UserStatistics {
  currentPeriod: {
    visited: number;
    available: number;
    total: number;
    completionRate: number;
    visits: Visit[];
  };
  allTime: {
    totalVisits: number;
    zoneStats: ZoneStat[];
    mostVisited: ZoneStat[];
  };
}

export interface UserInfo {
  telegramId: number;
  username?: string;
  characterName?: string;
}

export interface GlobalStatistics {
  currentPeriod: {
    totalVisits: number;
    activeUsers: number;
    totalUsers: number;
    averageVisitsPerUser: number;
    zonePopularity: Array<{
      zoneId: string;
      name: string;
      visits: number;
    }>;
  };
  allTime: {
    totalVisits: number;
    mostPopularZones: Array<{
      zoneId: string;
      name: string;
      visits: number;
    }>;
  };
}

export const getMyStatistics = async (): Promise<UserStatistics> => {
  const response = await apiClient.get('/statistics/me');
  return response.data;
};

export const getUserStatistics = async (
  telegramId: number
): Promise<UserStatistics & { user: UserInfo }> => {
  const response = await apiClient.get(`/statistics/user/${telegramId}`);
  return response.data;
};

export const getGlobalStatistics = async (): Promise<GlobalStatistics> => {
  const response = await apiClient.get('/statistics/global');
  return response.data;
};

export const getZoneStatistics = async (zoneId: string) => {
  const response = await apiClient.get(`/statistics/zone/${zoneId}`);
  return response.data;
};

