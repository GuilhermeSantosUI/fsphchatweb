import type {
  TRDocument,
  TRListResponse,
  TRListParams,
  PostTRRequest,
  RejectTRRequest,
  TRChatRequest,
  TRChatResponse,
} from '@/app/models/tr';
import { api } from '@/app/services';

/** POST /trs — promote a chat TR to the review pipeline */
export async function createTR(payload: PostTRRequest): Promise<TRDocument> {
  const { data } = await api.post<TRDocument>('/trs', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}

/** GET /trs — list TRs (Kanban columns). Heavy fields are omitted. */
export async function listTRs(params?: TRListParams): Promise<TRListResponse> {
  const { data } = await api.get<TRListResponse>('/trs', { params });
  return data;
}

/** GET /trs/{id} — full TR detail including fullContent, analysisSummary, sourceDocuments */
export async function getTRById(id: string): Promise<TRDocument> {
  const { data } = await api.get<TRDocument>(`/trs/${id}`);
  return data;
}

/** PATCH /trs/{id}/approve — approve a pending TR */
export async function approveTR(id: string): Promise<TRDocument> {
  const { data } = await api.patch<TRDocument>(`/trs/${id}/approve`);
  return data;
}

/** PATCH /trs/{id}/reject — reject a TR with a mandatory reason */
export async function rejectTR(id: string, payload: RejectTRRequest): Promise<TRDocument> {
  const { data } = await api.patch<TRDocument>(`/trs/${id}/reject`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}

/** POST /trs/{id}/chat — correction chat; may bump version and move TR back to pending */
export async function sendTRChatMessage(id: string, payload: TRChatRequest): Promise<TRChatResponse> {
  const { data } = await api.post<TRChatResponse>(`/trs/${id}/chat`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}
