import type { AuthSession, TokenResponse } from '@/app/models/auth';

const AUTH_SESSION_KEY = 'fsphchatweb.auth.session';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function toAuthSession(response: TokenResponse): AuthSession {
  return {
    accessToken: response.access_token,
    tokenType: response.token_type ?? 'bearer',
    role: response.role,
    userId: response.user_id,
    userName: response.user_name,
  };
}

export function readAuthSession(): AuthSession | null {
  if (!isBrowser()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawSession) as Partial<AuthSession>;

    if (
      !parsedSession.accessToken ||
      typeof parsedSession.userId !== 'number' ||
      !parsedSession.userName ||
      !parsedSession.role
    ) {
      return null;
    }

    return {
      accessToken: parsedSession.accessToken,
      tokenType: parsedSession.tokenType ?? 'bearer',
      role: parsedSession.role,
      userId: parsedSession.userId,
      userName: parsedSession.userName,
    };
  } catch {
    return null;
  }
}

export function writeAuthSession(session: AuthSession) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY);
}
