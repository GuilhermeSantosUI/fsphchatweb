'use client';

import * as React from 'react';

import { NavMain } from '@/views/components/nav-main';
import { NavUser } from '@/views/components/nav-user';
import { TeamSwitcher } from '@/views/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/views/components/ui/sidebar';
import {
  Building2Icon,
  FileCheckIcon,
  FileStackIcon,
  FolderKanbanIcon,
  GavelIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  SendToBackIcon,
} from 'lucide-react';

const data = {
  user: {
    name: 'Equipe FSPH',
    email: 'gestao.tr@fsph.gov.br',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'FSPH',
      logo: <Building2Icon />,
      plan: 'Gestao de TR institucional',
    },
  ],
  navSections: [
    {
      label: 'Operação',
      items: [
        {
          title: 'Painel executivo',
          url: '/admin/visao-geral',
          icon: <LayoutDashboardIcon />,
          exact: true,
        },
        {
          title: 'Base documental',
          url: '/admin/anexos',
          icon: <FolderKanbanIcon />,
          exact: true,
        },
        {
          title: 'Geracao assistida',
          url: '/admin/chat',
          icon: <MessageSquareIcon />,
          exact: true,
        },
      ],
    },
    {
      label: 'Esteira de analise',
      items: [
        {
          title: 'Pedidos de analise',
          url: '/admin/analises',
          icon: <FileStackIcon />,
          badge: '14',
          exact: true,
        },
        {
          title: 'Juridico',
          url: '/admin/analises/juridico',
          icon: <GavelIcon />,
          badge: '5',
          exact: true,
        },
        {
          title: 'Setores responsaveis',
          url: '/admin/analises/setores',
          icon: <SendToBackIcon />,
          badge: '8',
          exact: true,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher  />
      </SidebarHeader>
      <SidebarContent>
        <NavMain sections={data.navSections} />
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Monitoramento</SidebarGroupLabel>
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/50 px-3 py-3 text-sm group-data-[collapsible=icon]:hidden">
            <p className="font-medium text-sidebar-foreground">
              Fila automatizada ativa
            </p>
            <p className="mt-1 text-xs leading-5 text-sidebar-foreground/70">
              27 TRs em acompanhamento entre ingestao, parecer juridico e
              distribuicao para os setores.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-sidebar-foreground/80">
              <FileCheckIcon className="size-4 text-primary" />
              SLA medio de 18h para triagem inicial.
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
