import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

import { readAuthSession } from '@/app/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const session = readAuthSession();
  const headers = AxiosHeaders.from(config.headers);

  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  headers.set('Accept', 'application/json');
  config.headers = headers;

  return config;
});

export { api, API_BASE_URL };
