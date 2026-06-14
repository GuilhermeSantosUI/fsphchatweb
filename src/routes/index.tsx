import { useAuth } from '@/app/context/auth';
import { AdminChat } from '@/views/pages/admin/chat';
import { Attachments } from '@/views/pages/admin/dashboard';
import { AdminLayout } from '@/views/pages/admin/layout';

import { TRReview } from '@/views/pages/admin/review';
import { LoginPage } from '@/views/pages/auth/login';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';

function RouteLoadingScreen() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background text-sm text-muted-foreground">
      Carregando autenticacao...
    </div>
  );
}

function RootRedirect() {
  const { session, status } = useAuth();

  if (status === 'loading') {
    return <RouteLoadingScreen />;
  }

  return <Navigate to={session ? '/admin/chat' : '/login'} replace />;
}

function RequireAuth() {
  const { session, status } = useAuth();

  if (status === 'loading') {
    return <RouteLoadingScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function GuestOnly() {
  const { session, status } = useAuth();

  if (status === 'loading') {
    return <RouteLoadingScreen />;
  }

  if (session) {
    return <Navigate to="/admin/chat" replace />;
  }

  return <Outlet />;
}

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="chat" replace />} />
            <Route path="chat/:conversation_id?" element={<AdminChat />} />
            <Route path="anexos" element={<Attachments />} />
            <Route path="review" element={<TRReview />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
