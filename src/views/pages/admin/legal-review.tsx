import { Badge } from '@/views/components/ui/badge';
import { Button } from '@/views/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/views/components/ui/card';
import { ArrowRightIcon, ScaleIcon, TriangleAlertIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { AdminPageShell } from '@/views/components/admin/admin-page-shell';

const legalCases = [
  {
    id: 'JUR-118',
    title: 'TR 031/2026 · Locacao de equipamentos de imagem',
    point: 'Definicao de matriz de risco contratual e garantias',
    status: 'Parecer em elaboracao',
    severity: 'Alta criticidade',
  },
  {
    id: 'JUR-119',
    title: 'TR 034/2026 · Kit de coleta laboratorial',
    point: 'Validacao de clausulas de fornecimento continuado',
    status: 'Aguardando complemento',
    severity: 'Media criticidade',
  },
  {
    id: 'JUR-121',
    title: 'TR 041/2026 · Enxoval hospitalar',
    point: 'Revisao de penalidades e exigencias de habilitacao',
    status: 'Pronto para despacho',
    severity: 'Baixa criticidade',
  },
];

const checklist = [
  'Verificar aderencia a Lei 14.133 e normativos internos.',
  'Revisar clausulas de responsabilidade, sancoes e prazo contratual.',
  'Confirmar se os anexos tecnicos citados pela IA estao consistentes.',
  'Liberar o despacho para setores apenas apos assinatura do parecer.',
];

export function LegalReviewPage() {
  return (
    <AdminPageShell
      breadcrumbs={[
        { label: 'Administrador', href: '/admin/visao-geral' },
        { label: 'Esteira de analise', href: '/admin/analises' },
        { label: 'Juridico' },
      ]}
      title="Analise juridica"
      description="Centralize os TRs com risco regulatorio, duvidas contratuais e pedidos formais de parecer antes do envio aos setores responsaveis."
      badge="Parecer obrigatorio"
      actions={
        <Button asChild>
          <Link to="/admin/analises/setores">
            Ver encaminhamentos
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      }
      stats={[
        {
          label: 'Fila juridica',
          value: '5',
          description: 'TRs aguardando elaboracao ou conclusao de parecer.',
          tone: 'primary',
        },
        {
          label: 'Diligencias',
          value: '2',
          description: 'Itens devolvidos para complemento de documentacao.',
          tone: 'warning',
        },
        {
          label: 'Aprovados hoje',
          value: '3',
          description: 'Processos liberados para distribuicao aos setores.',
          tone: 'success',
        },
        {
          label: 'Risco alto',
          value: '1',
          description: 'Caso com monitoramento prioritario pela equipe.',
          tone: 'warning',
        },
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Casos juridicos em andamento</CardTitle>
            <CardDescription>
              Processos que exigem interpretacao normativa ou validacao
              contratual antes da continuidade da esteira.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {legalCases.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border/70 bg-muted/20 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{item.id}</Badge>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
                <p className="mt-3 font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.point}
                </p>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <TriangleAlertIcon className="size-4 text-primary" />
                  {item.severity}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Checklist de parecer</CardTitle>
              <CardDescription>
                Itens minimos para liberacao juridica dos documentos produzidos
                pela IA.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <ScaleIcon className="mt-0.5 size-4 text-primary" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Encaminhamento automatico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="rounded-lg border p-3">
                Parecer concluido com aprovacao envia o TR para compras e
                financeiro.
              </p>
              <p className="rounded-lg border p-3">
                Parecer com diligencia devolve o processo para analise tecnica
                com apontamentos anexados.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPageShell>
  );
}
