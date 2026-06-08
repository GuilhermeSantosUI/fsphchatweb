import { api } from '@/app/services';

export async function removeDocument(nomeArquivo: string) {
  const { data } = await api.delete(`/admin/remover-documento/${encodeURIComponent(nomeArquivo)}`);
  return data;
}
