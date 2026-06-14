import type { 
  ChatRequest, 
  ChatResponse, 
  ChatListResponse, 
  ChatConversationDetail, 
  RenameChatRequest, 
  UploadContextResponse 
} from '@/app/models/chat';
import { api } from '@/app/services';

export async function sendMessage(payload: ChatRequest): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>('/chat?format=json', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data;
}

export async function getChats(): Promise<ChatListResponse> {
  const { data } = await api.get<ChatListResponse>('/chats');
  return data;
}

export async function getChatById(conversationId: string): Promise<ChatConversationDetail> {
  const { data } = await api.get<ChatConversationDetail>(`/chats/${conversationId}`);
  return data;
}

export async function renameChat(conversationId: string, payload: RenameChatRequest): Promise<{ ok: boolean; conversation_id: string; titulo: string }> {
  const { data } = await api.patch<{ ok: boolean; conversation_id: string; titulo: string }>(`/chats/${conversationId}`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return data;
}

export async function deleteChat(conversationId: string): Promise<{ ok: boolean; conversation_id: string }> {
  const { data } = await api.delete<{ ok: boolean; conversation_id: string }>(`/chats/${conversationId}`);
  return data;
}

export async function uploadContext(conversationId: string, file: File): Promise<UploadContextResponse> {
  const formData = new FormData();
  formData.append('arquivo', file);

  const { data } = await api.post<UploadContextResponse>(`/chats/${conversationId}/contexto`, formData, {
    headers: {
      // Axios handles the correct Content-Type for FormData automatically
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
}
