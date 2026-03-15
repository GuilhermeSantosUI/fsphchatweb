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

export function NavMain({
  sections,
}: {
  sections: {
    label: string;
    items: {
      title: string;
      url: string;
      icon?: React.ReactNode;
      badge?: string;
      exact?: boolean;
    }[];
  }[];
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
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link to={item.url}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
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
