import { api } from '@/app/services';

export async function listDocuments() {
  const { data } = await api.get('/admin/listar-documentos');
  return data;
}
