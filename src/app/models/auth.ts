export type LoginRequest = {
  email: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type?: string;
  role: string;
  user_id: number;
  user_name: string;
};

export type AuthMeResponse = {
  user_id?: number;
  role?: string;
  user_name?: string;
  userName?: string;
  [key: string]: unknown;
};

export type AuthSession = {
  accessToken: string;
  tokenType: string;
  role: string;
  userId: number;
  userName: string;
};
