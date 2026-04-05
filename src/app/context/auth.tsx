import type { AuthSession, LoginRequest } from '@/app/models/auth';
import { getCurrentUser, login as loginRequest } from '@/app/services/auth';
import {
  clearAuthSession,
  readAuthSession,
  toAuthSession,
  writeAuthSession,
} from '@/app/utils/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  session: AuthSession | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<AuthSession>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mergeSession(
  session: AuthSession,
  response: Record<string, unknown>,
): AuthSession {
  const userId =
    typeof response.user_id === 'number' ? response.user_id : session.userId;
  const role = typeof response.role === 'string' ? response.role : session.role;
  const userName =
    typeof response.user_name === 'string'
      ? response.user_name
      : typeof response.userName === 'string'
        ? response.userName
        : session.userName;

  return {
    ...session,
    userId,
    role,
    userName,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let active = true;

    async function hydrateSession() {
      const storedSession = readAuthSession();

      if (!storedSession) {
        if (active) {
          setSession(null);
          setStatus('unauthenticated');
        }

        return;
      }

      try {
        const currentUser = await getCurrentUser();
        const nextSession = mergeSession(storedSession, currentUser);

        writeAuthSession(nextSession);

        if (active) {
          setSession(nextSession);
          setStatus('authenticated');
        }
      } catch {
        clearAuthSession();

        if (active) {
          setSession(null);
          setStatus('unauthenticated');
        }
      }
    }

    void hydrateSession();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      status,
      isAuthenticated: Boolean(session),
      login: async (payload: LoginRequest) => {
        const response = await loginRequest(payload);
        const nextSession = toAuthSession(response);

        writeAuthSession(nextSession);
        setSession(nextSession);
        setStatus('authenticated');

        return nextSession;
      },
      logout: () => {
        clearAuthSession();
        setSession(null);
        setStatus('unauthenticated');
      },
    }),
    [session, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
