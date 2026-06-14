export type LegacyChatRequest = {
  question: string;
  top_k?: number;
};

export type LegacyChatResponse = {
  answer?: string;
  html?: string;
  [key: string]: unknown;
};

// ==========================================
// API Spec - Models
// ==========================================

export interface ChatRequest {
  question: string;
  conversation_id?: string;
  top_k?: number;
}

export interface TRSection {
  id: string;
  title: string;
  content: string[];
  table_columns: string[];
  table_rows: Record<string, string>[];
}

export interface TRSource {
  source: string;
  chunk: number;
  distance: number;
}

// Respostas de Chat por Tipo
export interface ChatResponseBase {
  type: 'tr' | 'tr_update' | 'tr_explain' | 'conversational' | 'document_query' | 'error';
  conversation_id: string;
  intent?: string;
}

export interface ChatResponseTR extends ChatResponseBase {
  type: 'tr';
  document_title: string;
  html: string;
  sections: TRSection[];
  table_columns: string[];
  footer_text?: string;
  base_source?: string;
  sources?: TRSource[];
  llm_raw?: string;
}

export interface ChatResponseTRUpdate extends ChatResponseBase {
  type: 'tr_update';
  changed_sections: string[];
  message?: string;
  document_title?: string;
  html: string;
  sections: TRSection[];
  table_columns?: string[];
  base_source?: string;
  sources?: TRSource[];
}

export interface ChatResponseTRExplain extends ChatResponseBase {
  type: 'tr_explain';
  message: string;
  section_id: string;
  base_source?: string;
}

export interface ChatResponseConversational extends ChatResponseBase {
  type: 'conversational';
  message: string;
}

export interface ChatResponseDocumentQuery extends ChatResponseBase {
  type: 'document_query';
  message: string;
  sources?: TRSource[];
}

export interface ChatResponseError extends ChatResponseBase {
  type: 'error';
  message: string;
  html?: string;
  sources?: TRSource[];
}

export type ChatResponse = 
  | ChatResponseTR 
  | ChatResponseTRUpdate 
  | ChatResponseTRExplain 
  | ChatResponseConversational 
  | ChatResponseDocumentQuery 
  | ChatResponseError;

// Listagem de chats (GET /chats)
export interface ChatConversationListItem {
  conversation_id: string;
  titulo: string;
  created_at: string;
  updated_at: string;
  has_tr: boolean;
}

export interface ChatListResponse {
  chats: ChatConversationListItem[];
}

// Detalhes do chat (GET /chats/{id})
export interface MessageState {
  role: 'user' | 'assistant' | string;
  content: string;
  at: string;
}

export interface ContextFileState {
  filename: string;
  at: string;
}

export interface DocumentState {
  type: 'tr';
  document_title: string;
  sections: TRSection[];
  base_source?: string;
  table_columns: string[];
  footer_text?: string;
  sources?: TRSource[];
  html: string;
}

export interface ChatConversationDetail {
  conversation_id: string;
  user_id: number;
  titulo: string;
  created_at: string;
  updated_at: string;
  current_document: DocumentState | null;
  messages: MessageState[];
  context_files: ContextFileState[];
}

// Rename Chat Request
export interface RenameChatRequest {
  titulo: string;
}

// File Upload Response
export interface UploadContextResponse {
  ok: boolean;
  conversation_id: string;
  arquivo: string;
  caracteres_extraidos: number;
}
