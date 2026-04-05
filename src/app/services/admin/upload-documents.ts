import { api } from '@/app/services';

type UploadDocumentsPayload = {
  files: File[];
};

export async function uploadDocuments({ files }: UploadDocumentsPayload) {
  const formData = new FormData();

  for (const file of files) {
    formData.append('files', file);
  }

  const { data } = await api.post('/admin/index', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
}
