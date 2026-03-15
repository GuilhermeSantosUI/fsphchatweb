import { Badge } from '@/views/components/ui/badge';
import { Button } from '@/views/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/views/components/ui/card';
import {
  ArrowRightIcon,
  BotIcon,
  FileCheck2Icon,
  GavelIcon,
  SendIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { AdminPageShell } from '@/views/components/admin/admin-page-shell';

const todayPipeline = [
  {
    title: 'TR 028/2026 · Aquisicao de medicamentos estrategicos',
    status: 'Em analise tecnica',
    owner: 'Diretoria assistencial',
    sla: 'Triagem ate 14:30',
  },
  {
    title: 'TR 031/2026 · Servicos de manutencao hospitalar',
    status: 'Aguardando parecer juridico',
    owner: 'Juridico',
    sla: 'Parecer ate amanha',
  },
  {
    title: 'TR 034/2026 · Kit de coleta laboratorial',
    status: 'Pronto para encaminhamento',
    owner: 'Compras e financeiro',
    sla: 'Distribuicao em 2h',
  },
];

const sectors = [
  { name: 'Juridico', volume: '5 pareceres', eta: 'SLA medio 11h' },
  { name: 'Compras', volume: '8 validacoes', eta: 'SLA medio 6h' },
  { name: 'Financeiro', volume: '3 confirmacoes', eta: 'SLA medio 4h' },
  { name: 'Controle interno', volume: '2 revisoes', eta: 'SLA medio 8h' },
];

export function AdminOverviewPage() {
  return (
    <AdminPageShell
      breadcrumbs={[
        { label: 'Administrador', href: '/admin/visao-geral' },
        { label: 'Painel executivo' },
      ]}
      title="Painel executivo do TR"
      description="Acompanhe a base RAG, a geracao assistida e a esteira de analise do Termo de Referencia em um unico fluxo operacional para a FSPH."
      badge="Operação ativa"
      actions={
        <>
          <Button variant="outline" asChild>
            <Link to="/admin/anexos">Base documental</Link>
          </Button>
          <Button asChild>
            <Link to="/admin/analises">
              Acompanhar analises
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </>
      }
      stats={[
        {
          label: 'TRs gerados hoje',
          value: '12',
          description: 'Documentos produzidos pela IA com contexto validado.',
          tone: 'primary',
        },
        {
          label: 'Em analise',
          value: '14',
          description: 'Pedidos aguardando triagem tecnica e distribuicao.',
          tone: 'warning',
        },
        {
          label: 'No juridico',
          value: '5',
          description: 'TRs em parecer formal para mitigacao de risco.',
          tone: 'default',
        },
        {
          label: 'Prontos para setores',
          value: '8',
          description: 'Pacotes completos para compras, financeiro e controle.',
          tone: 'success',
        },
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo operacional do dia</CardTitle>
            <CardDescription>
              Itens gerados pela IA que ja entraram na esteira de analise e
              exigem movimentacao entre setores.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayPipeline.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/30 p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{item.status}</Badge>
                    <span>{item.owner}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{item.sla}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Esteira automatizada</CardTitle>
            <CardDescription>
              Sequencia padrao apos a conclusao do TR pela inteligencia
              artificial.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border p-4">
              <BotIcon className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Geracao assistida</p>
                <p className="text-sm text-muted-foreground">
                  A IA estrutura o TR com base na base vetorial e nos anexos
                  institucionais.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border p-4">
              <FileCheck2Icon className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Triagem e analise</p>
                <p className="text-sm text-muted-foreground">
                  O pedido entra na fila para validacao tecnica, aderencia e
                  completude do escopo.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border p-4">
              <GavelIcon className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Parecer juridico</p>
                <p className="text-sm text-muted-foreground">
                  Duvidas legais, riscos contratuais e observacoes normativas
                  ficam centralizados.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border p-4">
              <SendIcon className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Distribuicao setorial</p>
                <p className="text-sm text-muted-foreground">
                  Compras, financeiro e controle recebem o TR com status e
                  responsaveis definidos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Capacidade por setor</CardTitle>
          <CardDescription>
            Fila atual dos setores responsaveis que recebem TRs apos a analise
            juridica.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className="rounded-xl border border-border/70 bg-muted/20 p-4"
            >
              <p className="text-sm text-muted-foreground">{sector.name}</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {sector.volume}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{sector.eta}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
