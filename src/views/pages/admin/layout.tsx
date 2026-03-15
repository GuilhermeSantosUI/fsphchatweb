import { AppSidebar } from '@/views/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/views/components/ui/sidebar';
import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
