import apiClient from './apiClient';

export const getApprovals = async () => {
  const response = await apiClient.get('/approvals');
  return response.data;
};

export const createApproval = async (data: any) => {
  const response = await apiClient.post('/approvals', data);
  return response.data;
};

export const updateApproval = async (id: string, data: any) => {
  const response = await apiClient.put(`/approvals/${id}`, data);
  return response.data;
};
