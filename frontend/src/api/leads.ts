import apiClient from './apiClient';

export const getLeads = async () => {
  const response = await apiClient.get('/leads');
  return response.data;
};

export const createLead = async (data: any) => {
  const response = await apiClient.post('/leads', data);
  return response.data;
};

export const updateLead = async (id: string, data: any) => {
  const response = await apiClient.put(`/leads/${id}`, data);
  return response.data;
};

export const deleteLead = async (id: string) => {
  const response = await apiClient.delete(`/leads/${id}`);
  return response.data;
};
