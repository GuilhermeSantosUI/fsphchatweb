import { AppSidebar } from '@/views/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/views/components/ui/sidebar';
import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex h-full flex-1 min-h-0 flex-col overflow-hidden bg-muted/20">
          <section className="min-h-0 flex-1 overflow-auto">
            <Outlet />
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
