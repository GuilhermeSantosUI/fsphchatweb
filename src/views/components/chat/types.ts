export type Message = {
  id: string;
  role: 'user' | 'assistant';
  parts: { type: 'text'; text: string }[];
  createdAt: Date;
};
