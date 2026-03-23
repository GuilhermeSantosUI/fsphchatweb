import type { HealthResponse } from '@/app/models/health';
import { api } from '@/app/services';

export async function getHealth() {
  const { data } = await api.get<HealthResponse>('/health');
  return data;
}
