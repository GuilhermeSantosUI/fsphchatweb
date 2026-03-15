import { AdminChat } from '@/views/pages/admin/chat';
import { Dashboard } from '@/views/pages/admin/dashboard';
import { AdminLayout } from '@/views/pages/admin/layout';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<AdminChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
