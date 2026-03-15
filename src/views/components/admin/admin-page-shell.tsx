import { cn } from '@/app/utils';
import { Badge } from '@/views/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/views/components/ui/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/views/components/ui/card';
import { Link } from 'react-router-dom';

type AdminPageShellProps = {
  breadcrumbs: {
    label: string;
    href?: string;
  }[];
  title: string;
  description: string;
  badge?: string;
  actions?: React.ReactNode;
  stats?: {
    label: string;
    value: string;
    description: string;
    tone?: 'default' | 'primary' | 'success' | 'warning';
  }[];
  children: React.ReactNode;
  className?: string;
};

const toneClasses = {
  default: 'border-border bg-card',
  primary: 'border-primary/20 bg-primary/5',
  success: 'border-emerald-500/20 bg-emerald-500/5',
  warning: 'border-amber-500/20 bg-amber-500/5',
};

export function AdminPageShell({
  breadcrumbs,
  title,
  description,
  badge,
  actions,
  stats,
  children,
  className,
}: AdminPageShellProps) {
  return (
    <div className={cn('min-h-full bg-background', className)}>
      <div className="border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => (
                <div key={`${item.label}-${index}`} className="contents">
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link to={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 ? (
                    <BreadcrumbSeparator />
                  ) : null}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-foreground">
                  {title}
                </h1>
                {badge ? (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                    {badge}
                  </Badge>
                ) : null}
              </div>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground lg:text-base">
                {description}
              </p>
            </div>
            {actions ? (
              <div className="flex flex-wrap items-center gap-2">{actions}</div>
            ) : null}
          </div>

          {stats?.length ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <Card
                  key={stat.label}
                  className={cn(
                    'gap-2 border py-0 shadow-none',
                    toneClasses[stat.tone ?? 'default'],
                  )}
                >
                  <CardHeader className="px-4 pt-4 pb-0">
                    <CardDescription className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      {stat.label}
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold">
                      {stat.value}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 text-sm text-muted-foreground">
                    {stat.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
        {children}
      </div>
    </div>
  );
}
