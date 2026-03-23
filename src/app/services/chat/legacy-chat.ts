import type { LegacyChatResponse } from '@/app/models/chat';
import type { GenerateTrRequest } from '@/app/models/generate-tr';
import { api } from '@/app/services';

export async function legacyChat(payload: GenerateTrRequest) {
  const { data } = await api.post<LegacyChatResponse>('/chat', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data;
}
