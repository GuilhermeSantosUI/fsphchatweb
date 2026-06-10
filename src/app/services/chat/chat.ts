import type { ChatResponse, ChatRequest, ChatConversationState } from '@/app/models/chat';
import { api } from '@/app/services';

export async function sendMessage(payload: ChatRequest): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>('/chat?format=json', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data;
}

export async function getConversationState(conversationId: string): Promise<ChatConversationState> {
  const { data } = await api.get<ChatConversationState>(`/chat/${conversationId}`);

  return data;
}
