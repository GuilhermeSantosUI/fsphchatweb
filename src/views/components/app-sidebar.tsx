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
  GalleryVerticalEndIcon,
  MessageSquareIcon,
  PaperclipIcon,
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
  ],
  navMain: [
    {
      title: 'Anexos de TR',
      url: '/admin',
      icon: <PaperclipIcon />,
    },
    {
      title: 'Chat Interno',
      url: '/admin/chat',
      icon: <MessageSquareIcon />,
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
