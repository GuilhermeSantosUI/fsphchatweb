'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/views/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/views/components/ui/sidebar';

import logoImg from '@/assets/fsph-logo.png';

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-10 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground">
                <img
                  src={logoImg}
                  alt="FSPH Logo"
                  className="w-6 h-6 relative -left-0.5"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">FSPH</span>
                <span className="truncate text-xs">
                  Gestao de TR institucional
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
