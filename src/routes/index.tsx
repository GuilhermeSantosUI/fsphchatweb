import { AnalysisRequestsPage } from '@/views/pages/admin/analysis-requests';
import { AdminChat } from '@/views/pages/admin/chat';
import { Attachments } from '@/views/pages/admin/dashboard';

import { AdminLayout } from '@/views/pages/admin/layout';
import { LegalReviewPage } from '@/views/pages/admin/legal-review';
import { AdminOverviewPage } from '@/views/pages/admin/overview';
import { SectorRoutingPage } from '@/views/pages/admin/sector-routing';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/admin/visao-geral" replace />}
        />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="visao-geral" replace />} />
          <Route path="visao-geral" element={<AdminOverviewPage />} />
          <Route path="anexos" element={<Attachments />} />
          <Route path="chat" element={<AdminChat />} />
          <Route path="analises" element={<AnalysisRequestsPage />} />
          <Route path="analises/juridico" element={<LegalReviewPage />} />
          <Route path="analises/setores" element={<SectorRoutingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
