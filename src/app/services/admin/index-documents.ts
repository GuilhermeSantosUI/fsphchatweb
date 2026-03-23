import { api } from '@/app/services';

export async function indexDocuments(reset = false) {
  const { data } = await api.post('/admin/index', null, {
    params: { reset },
  });

  return data;
}
