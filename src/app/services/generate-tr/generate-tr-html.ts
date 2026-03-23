import type { GenerateTrRequest } from '@/app/models/generate-tr';
import { api } from '@/app/services';

export async function generateTrHtml(payload: GenerateTrRequest) {
  const { data } = await api.post<string>('/generate-tr/html', payload, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/html',
    },
    responseType: 'text',
  });

  return data;
}
