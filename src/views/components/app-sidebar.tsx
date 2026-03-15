'use client';

import * as React from 'react';

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
  AudioLinesIcon,
  BookOpenIcon,
  Building2Icon,
  DatabaseIcon,
  GalleryVerticalEndIcon,
  MessageSquareIcon,
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
      logo: <GalleryVerticalEndIcon />,
      plan: 'Ambiente Institucional',
    },
    {
      name: 'Compras e Contratos',
      logo: <AudioLinesIcon />,
      plan: 'Setor Operacional',
    },
  ],
  navMain: [
    {
      title: 'Operação',
      url: '/admin/chat',
      icon: <MessageSquareIcon />,
      isActive: true,
      items: [
        {
          title: 'Visão Geral',
          url: '/admin',
        },
        {
          title: 'Assistente de TR',
          url: '/admin/chat',
        },
      ],
    },
    {
      title: 'Conhecimento',
      url: '#',
      icon: <DatabaseIcon />,
      items: [
        {
          title: 'Base Vetorial',
          url: '#',
        },
        {
          title: 'Ground Truth',
          url: '#',
        },
        {
          title: 'Histórico de TRs',
          url: '#',
        },
      ],
    },
    {
      title: 'Governança',
      url: '#',
      icon: <BookOpenIcon />,
      items: [
        {
          title: 'Diretrizes de Contratação',
          url: '#',
        },
        {
          title: 'Conformidade e Auditoria',
          url: '#',
        },
      ],
    },
    {
      title: 'Institucional',
      url: '#',
      icon: <Building2Icon />,
      items: [
        {
          title: 'Sobre a Solução',
          url: '#',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
