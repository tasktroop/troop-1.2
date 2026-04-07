import apiClient from './apiClient';

export const getOrgDetails = async () => {
  const response = await apiClient.get('/orgs/current');
  return response.data;
};

export const updateOrgSettings = async (data: any) => {
  const response = await apiClient.put('/orgs/current', data);
  return response.data;
};
