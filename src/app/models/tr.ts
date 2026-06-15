// ==========================================
// TR Review Pipeline — Models
// ==========================================

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type SourceDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
};

/**
 * TRDocument returned by the API.
 * - Listing (GET /trs): fullContent, analysisSummary and sourceDocuments are absent.
 * - Detail (GET /trs/{id}): all fields present.
 */
export type TRDocument = {
  id: string;
  title: string;
  category: string;
  createdAt: string;          // ISO 8601 (UTC)
  generatedBy: 'ai' | 'human';
  status: ReviewStatus;
  version: number;
  preview: string;

  // Only present in GET /trs/{id}
  fullContent?: string;
  analysisSummary?: string;
  sourceDocuments?: SourceDocument[];

  // Filled after review
  reviewer: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
};

export type TRListResponse = {
  trs: TRDocument[];
  total: number;
  page: number;
  page_size: number;
};

export type TRListParams = {
  status?: ReviewStatus;
  q?: string;
  page?: number;
  page_size?: number;
};

export type PostTRRequest = {
  conversation_id: string;
  category?: string;
};

export type RejectTRRequest = {
  reason: string;
};

export type TRChatRequest = {
  message: string;
};

export type TRChatResponse = {
  message: string;
  changed_sections: string[];
  tr: TRDocument;
};
