import { useAuth } from '@/app/context/auth';
import { AnalysisRequestsPage } from '@/views/pages/admin/analysis-requests';
import { AdminChat } from '@/views/pages/admin/chat';
import { Attachments } from '@/views/pages/admin/dashboard';

import { AdminLayout } from '@/views/pages/admin/layout';
import { LegalReviewPage } from '@/views/pages/admin/legal-review';
import { AdminOverviewPage } from '@/views/pages/admin/overview';
import { SectorRoutingPage } from '@/views/pages/admin/sector-routing';
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

  return <Navigate to={session ? '/admin/visao-geral' : '/login'} replace />;
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
    return <Navigate to="/admin/visao-geral" replace />;
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
            <Route index element={<Navigate to="visao-geral" replace />} />
            <Route path="visao-geral" element={<AdminOverviewPage />} />
            <Route path="anexos" element={<Attachments />} />
            <Route path="chat" element={<AdminChat />} />
            <Route path="analises" element={<AnalysisRequestsPage />} />
            <Route path="analises/juridico" element={<LegalReviewPage />} />
            <Route path="analises/setores" element={<SectorRoutingPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
