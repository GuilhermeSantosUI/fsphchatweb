import axios from 'axios';

export type GenerateTrRequest = {
  question: string;
  top_k?: number;
};

export type GenerateTrSource = {
  source?: string;
  distance?: number;
  [key: string]: unknown;
};

export type GenerateTrResponse = {
  html: string;
  profile?: 'servico_padrao' | 'bens' | 'evento_curto' | string;
  base_source?: string;
  table_columns?: string[];
  sources?: GenerateTrSource[];
  llm_raw?: unknown;
  [key: string]: unknown;
};

export type LegacyChatResponse = {
  answer: string;
  [key: string]: unknown;
};

export type HealthResponse = {
  status?: string;
  [key: string]: unknown;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

export const trApiService = {
  async health() {
    const { data } = await api.get<HealthResponse>('/health');
    return data;
  },

  async indexDocuments(reset = false) {
    const { data } = await api.post('/admin/index', null, {
      params: { reset },
    });
    return data;
  },

  async generateTr(payload: GenerateTrRequest) {
    const { data } = await api.post<GenerateTrResponse>(
      '/generate-tr',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return data;
  },

  async generateTrHtml(payload: GenerateTrRequest) {
    const { data } = await api.post<string>('/generate-tr/html', payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/html',
      },
      responseType: 'text',
    });

    return data;
  },

  async legacyChat(payload: GenerateTrRequest) {
    const { data } = await api.post<LegacyChatResponse>('/chat', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  },
};

export { api, API_BASE_URL };
