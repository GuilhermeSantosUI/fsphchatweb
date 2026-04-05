import type { AuthMeResponse } from '@/app/models/auth';
import { api } from '@/app/services';

export async function getCurrentUser() {
  const { data } = await api.get<AuthMeResponse>('/auth/me');

  return data;
}
