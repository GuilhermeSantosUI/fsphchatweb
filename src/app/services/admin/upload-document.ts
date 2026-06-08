import { api } from '@/app/services';

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append('arquivo', file);

  const { data } = await api.post('/documentos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
}
