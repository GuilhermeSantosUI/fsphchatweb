import { Badge } from '@/views/components/ui/badge';
import { Button } from '@/views/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/views/components/ui/card';
import { ArrowRightIcon, BuildingIcon, SendToBackIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { AdminPageShell } from '@/views/components/admin/admin-page-shell';

const dispatches = [
  {
    tr: 'TR 034/2026',
    sector: 'Compras',
    owner: 'Patricia Menezes',
    status: 'Recebido',
    dueDate: 'Hoje, 17:30',
  },
  {
    tr: 'TR 029/2026',
    sector: 'Financeiro',
    owner: 'Carlos Nascimento',
    status: 'Em conferencia',
    dueDate: 'Amanha, 09:00',
  },
  {
    tr: 'TR 027/2026',
    sector: 'Controle interno',
    owner: 'Amanda Silva',
    status: 'Aguardando aceite',
    dueDate: 'Amanha, 11:00',
  },
  {
    tr: 'TR 025/2026',
    sector: 'Diretoria demandante',
    owner: 'Equipe solicitante',
    status: 'Complementacao pendente',
    dueDate: 'Amanha, 15:00',
  },
];

export function SectorRoutingPage() {
  return (
    <AdminPageShell
      breadcrumbs={[
        { label: 'Administrador', href: '/admin/visao-geral' },
        { label: 'Esteira de analise', href: '/admin/analises' },
        { label: 'Setores responsaveis' },
      ]}
      title="Encaminhamento aos setores"
      description="Controle a distribuicao dos TRs aprovados para compras, financeiro, controle interno e demais areas que participam da formalizacao."
      badge="Distribuicao em andamento"
      actions={
        <Button variant="outline" asChild>
          <Link to="/admin/analises">
            Voltar a fila
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      }
      stats={[
        {
          label: 'Encaminhados hoje',
          value: '8',
          description:
            'TRs liberados para execucao pelos setores responsaveis.',
          tone: 'primary',
        },
        {
          label: 'Compras',
          value: '3',
          description: 'Demandas em preparacao para aquisicao.',
          tone: 'default',
        },
        {
          label: 'Financeiro',
          value: '2',
          description: 'Itens em validacao orcamentaria e disponibilidade.',
          tone: 'success',
        },
        {
          label: 'Dependem de retorno',
          value: '1',
          description: 'Processos com pendencia de confirmacao setorial.',
          tone: 'warning',
        },
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Distribuicao atual</CardTitle>
            <CardDescription>
              Status de cada TR apos parecer juridico e liberacao para execucao
              institucional.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dispatches.map((item) => (
              <div
                key={`${item.tr}-${item.sector}`}
                className="rounded-xl border border-border/70 p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{item.tr}</Badge>
                      <Badge variant="secondary">{item.status}</Badge>
                    </div>
                    <p className="font-medium text-foreground">{item.sector}</p>
                    <p className="text-sm text-muted-foreground">
                      Responsavel atual: {item.owner}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Prazo: {item.dueDate}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proximo destino</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <BuildingIcon className="mt-0.5 size-4 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Compras recebe itens com mapa comparativo, justificativa e
                  anexos consolidados.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <SendToBackIcon className="mt-0.5 size-4 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Financeiro e controle interno recebem a mesma trilha, mantendo
                  historico unico do TR.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Governanca da esteira</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="rounded-lg border p-3">
                Encaminhamentos so sao liberados quando o parecer juridico
                estiver concluido ou dispensado.
              </p>
              <p className="rounded-lg border p-3">
                Cada setor registra aceite e devolutiva no mesmo protocolo do TR
                para rastreabilidade completa.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPageShell>
  );
}
