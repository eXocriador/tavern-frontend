import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(config => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user.telegramId) {
        config.headers['x-telegram-id'] = user.telegramId.toString();
      }
    } catch {}
  }
  return config;
});

export default apiClient;
