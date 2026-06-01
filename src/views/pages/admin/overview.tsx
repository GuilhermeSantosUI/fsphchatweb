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
  SparklesIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { AdminPageShell } from '@/views/components/admin/admin-page-shell';

export function AdminOverviewPage() {
  return (
    <AdminPageShell
      breadcrumbs={[
        { label: 'Administrador', href: '/admin/visao-geral' },
        { label: 'Painel executivo' },
      ]}
      title="Painel executivo do TR"
      description="Gerencia base de documentos, geração assistida de Termos de Referência e personalidades para customização de comportamento."
      badge="Operação ativa"
      actions={
        <>
          <Button variant="outline" asChild>
            <Link to="/admin/anexos">Base documental</Link>
          </Button>
          <Button asChild>
            <Link to="/admin/chat">
              Gerar TR
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </>
      }
      stats={[
        {
          label: 'TRs gerados',
          value: '12',
          description: 'Documentos produzidos pela IA com contexto validado.',
          tone: 'primary',
        },
        {
          label: 'Personalidades',
          value: '3',
          description: 'Pre-prompts disponíveis para customizar o assistente.',
          tone: 'success',
        },
        {
          label: 'Documentos na base',
          value: '47',
          description: 'Documentos indexados para contexto de IA.',
          tone: 'default',
        },
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo operacional</CardTitle>
            <CardDescription>
              Pipeline de geração assistida do Termo de Referência.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border p-4">
              <BotIcon className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">1. Geracao assistida</p>
                <p className="text-sm text-muted-foreground">
                  Descreva a necessidade e a IA estrutura o TR com base na base
                  documental e na personalidade selecionada.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border p-4">
              <FileCheck2Icon className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">2. Revisão e customização</p>
                <p className="text-sm text-muted-foreground">
                  Edite o documento gerado, ajuste conforme suas necessidades e
                  exporte em diferentes formatos.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border p-4">
              <SparklesIcon className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">3. Personalização contínua</p>
                <p className="text-sm text-muted-foreground">
                  Crie suas próprias personalidades com pre-prompts específicos
                  para diferentes contextos e departamentos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas ações</CardTitle>
            <CardDescription>
              Explore os principais recursos da plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/chat">
              <div className="rounded-lg border p-3 hover:bg-muted cursor-pointer transition-colors">
                <p className="font-medium text-sm">Gerar novo TR</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Comece uma nova sessão de geração assistida
                </p>
              </div>
            </Link>
            <Link to="/admin/anexos">
              <div className="rounded-lg border p-3 hover:bg-muted cursor-pointer transition-colors">
                <p className="font-medium text-sm">Gerenciar documentos</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Atualize a base de contexto para a IA
                </p>
              </div>
            </Link>
            <Link to="/admin/personalidades">
              <div className="rounded-lg border p-3 hover:bg-muted cursor-pointer transition-colors">
                <p className="font-medium text-sm">Criar personalidade</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Configure um novo pre-prompt customizado
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  );
}
