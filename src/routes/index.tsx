import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard } from '../views/pages/admin/dashboard';
import { AdminLayout } from '../views/pages/admin/layout';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
