import { api } from '@/app/services';

export async function removeDocument(nomeArquivo: string) {
  const { data } = await api.delete(`/documentos/${encodeURIComponent(nomeArquivo)}`);
  return data;
}
