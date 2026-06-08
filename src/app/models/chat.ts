export type LegacyChatRequest = {
  question: string;
  top_k?: number;
};

export type LegacyChatResponse = {
  answer?: string;
  html?: string;
  [key: string]: unknown;
};
