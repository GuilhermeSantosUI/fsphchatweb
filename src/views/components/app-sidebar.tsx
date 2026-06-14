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
import { Folder, MessageCircle, Scan } from 'lucide-react';
import { chatRoute } from '@/app/services/chat';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/views/components/ui/alert-dialog';

function useRecentChats() {
  const [chats, setChats] = React.useState<{ title: string; url: string; conversation_id: string }[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchChats = React.useCallback(async () => {
    try {
      const response = await chatRoute.getChats();
      const mapped = response.chats.map((chat) => ({
        title: chat.titulo || 'Chat sem título',
        url: `/admin/chat/${chat.conversation_id}`,
        conversation_id: chat.conversation_id,
      }));
      setChats(mapped);
    } catch (error) {
      console.error('Erro ao carregar chats', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  React.useEffect(() => {
    const handleChatUpdate = () => fetchChats();
    window.addEventListener('chat-updated', handleChatUpdate);
    return () => window.removeEventListener('chat-updated', handleChatUpdate);
  }, [fetchChats]);

  return { chats, loading, fetchChats };
}

const data = {
  fallbackUser: {
    name: 'Equipe FSPH',
    email: 'gestao.tr@fsph.gov.br',
    avatar: '',
  },

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
  const { chats, loading: loadingChats, fetchChats } = useRecentChats();

  const [deleteDialog, setDeleteDialog] = React.useState<{ open: boolean; id: string | null; title: string }>({
    open: false,
    id: null,
    title: '',
  });

  const user = session
    ? {
        name: session.userName,
        email: session.role === 'admin' ? 'Perfil admin' : 'Perfil autenticado',
        avatar: '',
      }
    : data.fallbackUser;

  const handleRename = async (id: string, currentTitle: string) => {
    const newTitle = window.prompt('Digite o novo título para o chat:', currentTitle);
    if (newTitle && newTitle.trim() !== '' && newTitle !== currentTitle) {
      try {
        await chatRoute.renameChat(id, { titulo: newTitle });
        await fetchChats();
      } catch (error) {
        console.error('Falha ao renomear', error);
      }
    }
  };

  const confirmDelete = async () => {
    if (deleteDialog.id) {
      try {
        await chatRoute.deleteChat(deleteDialog.id);
        setDeleteDialog({ open: false, id: null, title: '' });
        await fetchChats();
        // Se excluiu o chat aberto, redireciona para um novo
        if (window.location.pathname.includes(deleteDialog.id)) {
          navigate('/admin/chat', { replace: true });
        }
      } catch (error) {
        console.error('Falha ao excluir', error);
      }
    }
  };

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
                  items: chats,
                },
              ]}
              onRename={handleRename}
              onDelete={(id, title) => setDeleteDialog({ open: true, id, title })}
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

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, id: null, title: '' })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir chat</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o chat "<strong>{deleteDialog.title}</strong>"? 
              Esta ação removerá todo o histórico e contextos anexados a ele, não podendo ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={confirmDelete}>
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
