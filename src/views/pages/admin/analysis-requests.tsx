import { Badge } from '@/views/components/ui/badge';
import { Button } from '@/views/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/views/components/ui/card';
import { ArrowRightIcon, Clock3Icon, FilterIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { AdminPageShell } from '@/views/components/admin/admin-page-shell';

const analysisQueue = [
  {
    protocol: 'TR-2026-041',
    title: 'Aquisicao de enxoval hospitalar',
    requester: 'Diretoria administrativa',
    status: 'Aguardando triagem',
    risk: 'Baixo risco',
    deadline: 'Hoje, 16:00',
  },
  {
    protocol: 'TR-2026-039',
    title: 'Locacao de equipamentos de imagem',
    requester: 'Coordenacao diagnostica',
    status: 'Em analise tecnica',
    risk: 'Escopo sensivel',
    deadline: 'Hoje, 18:30',
  },
  {
    protocol: 'TR-2026-037',
    title: 'Servicos de higienizacao hospitalar',
    requester: 'Nucleo operacional',
    status: 'Pendente de complementacao',
    risk: 'Exige revisao do anexo',
    deadline: 'Amanha, 10:00',
  },
  {
    protocol: 'TR-2026-035',
    title: 'Reposicao de reagentes laboratoriais',
    requester: 'Laboratorio central',
    status: 'Pronto para juridico',
    risk: 'Sem impeditivos',
    deadline: 'Amanha, 14:00',
  },
];

const distribution = [
  { name: 'Triagem documental', value: '4 itens' },
  { name: 'Analise tecnica', value: '6 itens' },
  { name: 'Fila juridica', value: '5 itens' },
  { name: 'Encaminhamento', value: '3 itens' },
];

export function AnalysisRequestsPage() {
  return (
    <AdminPageShell
      breadcrumbs={[
        { label: 'Administrador', href: '/admin/visao-geral' },
        { label: 'Esteira de analise' },
      ]}
      title="Pedidos de analise do TR"
      description="Visualize os pedidos que sairam da geracao assistida e estao em triagem, validacao tecnica ou aguardando encaminhamento ao juridico."
      badge="Fila central"
      actions={
        <>
          <Button variant="outline">
            <FilterIcon className="size-4" />
            Filtrar fila
          </Button>
          <Button asChild>
            <Link to="/admin/analises/juridico">
              Abrir juridico
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </>
      }
      stats={[
        {
          label: 'Pedidos recebidos',
          value: '14',
          description: 'Entradas geradas pela IA aguardando movimentacao.',
          tone: 'primary',
        },
        {
          label: 'Aguardando triagem',
          value: '4',
          description: 'TRs recem-gerados sem validacao inicial.',
          tone: 'warning',
        },
        {
          label: 'Em analise tecnica',
          value: '6',
          description: 'Demandas em revisao funcional e aderencia ao escopo.',
          tone: 'default',
        },
        {
          label: 'Prazo critico',
          value: '2',
          description: 'Itens com SLA abaixo de 6 horas.',
          tone: 'warning',
        },
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.75fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Fila consolidada</CardTitle>
            <CardDescription>
              Cada TR segue com contexto, area solicitante e prioridade antes de
              ir para juridico ou setores.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisQueue.map((item) => (
              <div
                key={item.protocol}
                className="rounded-xl border border-border/70 bg-card p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{item.protocol}</Badge>
                      <Badge variant="secondary">{item.status}</Badge>
                    </div>
                    <p className="text-base font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.requester}
                    </p>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground lg:text-right">
                    <div className="flex items-center gap-2 lg:justify-end">
                      <Clock3Icon className="size-4 text-primary" />
                      <span>{item.deadline}</span>
                    </div>
                    <p>{item.risk}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuicao da fila</CardTitle>
              <CardDescription>
                Volume atual por estagio da esteira de analise.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {distribution.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg border px-3 py-3"
                >
                  <span className="text-sm text-muted-foreground">
                    {item.name}
                  </span>
                  <span className="font-medium text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regras de passagem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="rounded-lg border p-3">
                Todo TR gerado pela IA deve passar por validacao tecnica antes
                de qualquer distribuicao setorial.
              </p>
              <p className="rounded-lg border p-3">
                Se houver clausulas contratuais ou risco de inexigibilidade, o
                item segue para juridico automaticamente.
              </p>
              <p className="rounded-lg border p-3">
                Apos parecer concluido, o encaminhamento para compras,
                financeiro e controle interno ocorre pela fila de setores.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPageShell>
  );
}
