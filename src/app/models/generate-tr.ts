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
