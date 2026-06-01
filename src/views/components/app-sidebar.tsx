'use client';

import * as React from 'react';

import { useAuth } from '@/app/context/auth';
import { NavMain } from '@/views/components/nav-main';
import { NavUser } from '@/views/components/nav-user';
import { TeamSwitcher } from '@/views/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/views/components/ui/sidebar';
import {
  Building2Icon,
  FileCheckIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const data = {
  fallbackUser: {
    name: 'Equipe FSPH',
    email: 'gestao.tr@fsph.gov.br',
    avatar: '',
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
        {
          title: 'Personalidades',
          url: '/admin/personalidades',
          icon: <FileCheckIcon />,
          exact: true,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const user = session
    ? {
        name: session.userName,
        email: session.role === 'admin' ? 'Perfil admin' : 'Perfil autenticado',
        avatar: '',
      }
    : data.fallbackUser;

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain sections={data.navSections} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={user}
          onLogout={() => {
            logout();
            navigate('/login', { replace: true });
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
