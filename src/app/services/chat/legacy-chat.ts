import type { LegacyChatResponse, LegacyChatRequest } from '@/app/models/chat';
import { api } from '@/app/services';

export async function legacyChat(payload: LegacyChatRequest) {
  const { data } = await api.post<LegacyChatResponse>('/chat?format=html', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data;
}
