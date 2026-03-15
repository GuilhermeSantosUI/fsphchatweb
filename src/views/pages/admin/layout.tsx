import { AppSidebar } from '@/views/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/views/components/ui/sidebar';
import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden">
        <main className="flex h-full min-h-0 flex-1 flex-col bg-muted/20">
          <section className="min-h-0 flex-1 overflow-y-auto">
            <Outlet />
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
