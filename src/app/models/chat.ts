export type LegacyChatRequest = {
  question: string;
  top_k?: number;
};

export type LegacyChatResponse = {
  answer?: string;
  html?: string;
  [key: string]: unknown;
};

export type ChatRequest = {
  // Add other required fields if any. The spec says "Aceita qualquer mensagem"
  question?: string;
  // Let the user pass any other data
  [key: string]: unknown;
};

export type ChatResponse = {
  type: 'conversational' | 'document_query' | 'tr' | 'tr_update' | 'tr_explain' | 'error';
  conversation_id?: string;
  html?: string;
  text?: string;
  // Outras chaves dependendo do type
  [key: string]: unknown;
};

export type ChatConversationState = {
  conversation_id: string;
  messages: Array<any>;
  tr_state?: any;
  [key: string]: unknown;
};
