import { indexDocuments } from './index-documents';
import { uploadDocument } from './upload-document';
import { listDocuments } from './list-documents';
import { removeDocument } from './remove-document';

export const adminRoute = {
  indexDocuments,
  uploadDocument,
  listDocuments,
  removeDocument,
};
