'use client';

import * as React from 'react';
import { useNavigate } from 'react-router-dom';

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
import { Building2, Folder, MessageCircle, Scan } from 'lucide-react';

// Simulando uma requisição de histórico (loading de 2 segundos)
function useRecentChats() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return { loading };
}

const data = {
  fallbackUser: {
    name: 'Equipe FSPH',
    email: 'gestao.tr@fsph.gov.br',
    avatar: '',
  },

  teams: [
    {
      name: 'FSPH',
      logo: <Building2 size={18} />,
      plan: 'Gestão de TR institucional',
    },
  ],

  staticSections: [
    {
      label: 'Geral',
      items: [
        {
          title: 'Novo chat',
          url: '/admin/chat',
          icon: <MessageCircle size={18} />,
          exact: true,
        },
        {
          title: 'Base Documental',
          url: '/admin/anexos',
          icon: <Folder size={18} />,
          exact: true,
        },
      ],
    },
    {
      label: 'Esteira de Análise',
      items: [
        {
          title: "Revisão de TR's",
          url: '/admin/review',
          icon: <Scan size={18} />,
          exact: true,
        },
      ],
    },
  ],

  recentChats: [
    {
      title: 'Parecer Jurídico 154',
      url: '/admin/chat/6',
    },
    {
      title: 'TR Transporte Escolar',
      url: '/admin/chat/7',
    },
    {
      title: 'TR Medicamentos Componente Especializado',
      url: '/admin/chat/8',
    },
    {
      title: 'Reforma UBS Centro Hidrográfico',
      url: '/admin/chat/9',
    },
    {
      title: 'Insumos Laboratoriais Huse',
      url: '/admin/chat/10',
    },
    {
      title: 'Locação de Ambulâncias Tipo D',
      url: '/admin/chat/11',
    },
    {
      title: 'Aquisição de Computadores Core i7',
      url: '/admin/chat/12',
    },
    {
      title: 'Serviço de Nuvem Privada Gov',
      url: '/admin/chat/13',
    },
    {
      title: 'Recarga de Oxigênio Hospitalar',
      url: '/admin/chat/14',
    },
    {
      title: 'Licenciamento de Software Antivírus',
      url: '/admin/chat/15',
    },
  ],
};

function RecentChatsSkeleton() {
  return (
    <div className="space-y-2 px-3 py-2">
      <div className="h-4 w-24 rounded bg-muted/60 relative overflow-hidden mb-3">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-8 rounded-md bg-muted/40 relative overflow-hidden"
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      ))}
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const { loading: loadingChats } = useRecentChats();

  const user = session
    ? {
        name: session.userName,
        email: session.role === 'admin' ? 'Perfil admin' : 'Perfil autenticado',
        avatar: '',
      }
    : data.fallbackUser;

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>

      <Sidebar variant="inset" collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>

        <SidebarContent className="gap-0">
          <NavMain sections={data.staticSections} />

          {loadingChats ? (
            <RecentChatsSkeleton />
          ) : (
            <NavMain
              sections={[
                {
                  label: 'Últimos Chats',
                  items: data.recentChats,
                },
              ]}
            />
          )}
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
    </>
  );
}
