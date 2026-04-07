import apiClient from './apiClient';

export const login = async (credentials: any) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const signup = async (data: any) => {
  const response = await apiClient.post('/auth/signup', data);
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await apiClient.post('/auth/reset-password', { token, newPassword });
  return response.data;
};
