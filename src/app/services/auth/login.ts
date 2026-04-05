import type { LoginRequest, TokenResponse } from '@/app/models/auth';
import { api } from '@/app/services';

export async function login(payload: LoginRequest) {
  const { data } = await api.post<TokenResponse>('/auth/login', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data;
}
