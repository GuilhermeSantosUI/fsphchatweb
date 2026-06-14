import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/views/components/ui/sidebar';
import { Link, useLocation } from 'react-router-dom';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/views/components/ui/dropdown-menu';

export interface NavMainItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
  badge?: string;
  exact?: boolean;
  conversation_id?: string;
}

export function NavMain({
  sections,
  onRename,
  onDelete,
}: {
  sections: {
    label: string;
    items: NavMainItem[];
  }[];
  onRename?: (id: string, currentTitle: string) => void;
  onDelete?: (id: string, title: string) => void;
}) {
  const { pathname } = useLocation();

  return (
    <>
      {sections.map((section, sectionIndex) => (
        <div key={section.label}>
          {sectionIndex > 0 ? <SidebarSeparator /> : null}
          <SidebarGroup>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => {
                const isActive = item.exact
                  ? pathname === item.url
                  : pathname === item.url ||
                    pathname.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.url || item.title} className="group relative">
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link to={item.url} className="flex-1 pr-6">
                        {item.icon}
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    
                    {item.conversation_id && onRename && onDelete && (
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-muted text-muted-foreground">
                              <MoreHorizontal className="size-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onRename(item.conversation_id!, item.title)}>
                              <Pencil className="mr-2 size-4" />
                              <span>Renomear</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(item.conversation_id!, item.title)}>
                              <Trash2 className="mr-2 size-4" />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                    
                    {item.badge ? (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </div>
      ))}
    </>
  );
}
