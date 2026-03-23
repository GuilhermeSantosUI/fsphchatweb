import type {
  GenerateTrRequest,
  GenerateTrResponse,
} from '@/app/models/generate-tr';
import { api } from '@/app/services';

export async function generateTr(payload: GenerateTrRequest) {
  const { data } = await api.post<GenerateTrResponse>('/generate-tr', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data;
}
