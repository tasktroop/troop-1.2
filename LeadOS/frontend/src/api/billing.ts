import apiClient from './apiClient';

export const getBillingPlans = async () => {
  const response = await apiClient.get('/billing/plans');
  return response.data;
};

export const subscribeToPlan = async (planId: string) => {
  const response = await apiClient.post('/billing/subscribe', { plan_id: planId });
  return response.data;
};

export const startTrial = async (planId: string) => {
  const response = await apiClient.post('/billing/trial', { plan_id: planId });
  return response.data;
};
