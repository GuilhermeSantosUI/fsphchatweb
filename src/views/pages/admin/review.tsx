/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdminPageShell } from '@/views/components/admin/admin-page-shell';
import { Badge } from '@/views/components/ui/badge';
import { Button } from '@/views/components/ui/button';
import {
  Card,
  CardContent
} from '@/views/components/ui/card';
import {
  Sheet,
  SheetContent
} from '@/views/components/ui/sheet';
import {
  BrainCircuitIcon,
  CheckCircle2Icon,
  ClockIcon,
  FileIcon,
  FileTextIcon,
  LayoutKanbanIcon,
  MessageSquareIcon,
  PaperclipIcon,
  SearchIcon,
  SendIcon,
  SparklesIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  XCircleIcon
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewStatus = 'pending' | 'approved' | 'rejected';

type SourceDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
};

type TRDocument = {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  generatedBy: 'ai' | 'human';
  status: ReviewStatus;
  reviewer?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  preview: string;
  fullContent: string;
  version: number;
  sourceDocuments: SourceDocument[];
  analysisSummary: string;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_DOCUMENTS: TRDocument[] = [
  {
    id: 'tr-001',
    title: 'Contratação de solução de monitoramento de infraestrutura de TI',
    category: 'Tecnologia da Informação',
    createdAt: '2025-06-04T10:22:00',
    generatedBy: 'ai',
    status: 'pending',
    version: 1,
    preview:
      'Contratação de empresa especializada para fornecimento de plataforma SaaS de monitoramento...',
    fullContent: `1. OBJETO\nContratação de empresa especializada para fornecimento de plataforma SaaS de monitoramento contínuo de ativos de infraestrutura de TI, contemplando servidores, redes, bancos de dados e endpoints, com emissão de alertas em tempo real e dashboards gerenciais.\n\n2. JUSTIFICATIVA\nA instituição opera com parque tecnológico distribuído em múltiplos data centers sem visibilidade centralizada de disponibilidade e desempenho. Incidentes não detectados tempestivamente geram impacto direto na continuidade dos serviços ao cidadão.\n\n3. ESPECIFICAÇÕES TÉCNICAS\n- Coleta de métricas com granularidade mínima de 60 segundos\n- Retenção histórica de dados por no mínimo 13 meses\n- API REST para integração com sistemas legados\n- Suporte a protocolo SNMP v2c e v3\n- Autenticação via SSO/SAML 2.0\n\n4. PRAZO DE EXECUÇÃO\n12 meses, prorrogáveis por igual período, nos termos da Lei 14.133/2021.\n\n5. ESTIMATIVA DE VALOR\nR$ 480.000,00 (quatrocentos e oitenta mil reais) anuais, com base em pesquisa de mercado realizada em maio/2025.`,
    sourceDocuments: [
      { id: 'sd-1', name: 'Estudo Técnico Preliminar.pdf', type: 'PDF', size: '2.4 MB' },
      { id: 'sd-2', name: 'Catálogo de Requisitos TI.docx', type: 'DOCX', size: '1.1 MB' },
    ],
    analysisSummary: 'O modelo de SaaS foi priorizado conforme a diretriz de nuvem (Pág 3 do Estudo Técnico). Foram extraídas métricas de retenção histórica e requisitos de integração SNMP diretamente do Catálogo de Requisitos.',
  },
  {
    id: 'tr-002',
    title: 'Aquisição de licenças Microsoft 365 – pacote corporativo',
    category: 'Licenças de Software',
    createdAt: '2025-06-03T14:05:00',
    generatedBy: 'ai',
    status: 'approved',
    reviewer: 'Ana Paula Ferreira',
    reviewedAt: '2025-06-04T09:10:00',
    version: 2,
    preview:
      'Aquisição de licenças Microsoft 365 Business Premium para 350 usuários, incluindo aplicativos...',
    fullContent: `1. OBJETO\nAquisição de 350 licenças Microsoft 365 Business Premium, incluindo suite de produtividade, colaboração e segurança de endpoints.\n\n2. JUSTIFICATIVA\nContratos vigentes expiram em 31/07/2025. A continuidade das operações depende da renovação tempestiva para evitar interrupção de acesso a e-mails e documentos institucionais.\n\n3. ESPECIFICAÇÕES\n- Microsoft 365 Business Premium – 350 licenças\n- Período: 12 meses\n- Inclui: Exchange Online Plan 2, Teams, SharePoint, OneDrive 1TB/usuário, Defender for Business\n\n4. VALOR ESTIMADO\nR$ 210.000,00 com base em ata de registro de preços vigente – UASG 000123.`,
    sourceDocuments: [
      { id: 'sd-3', name: 'Ata de Registro de Preços - UASG 000123.pdf', type: 'PDF', size: '4.5 MB' },
      { id: 'sd-4', name: 'Levantamento de Usuários Ativos.xlsx', type: 'XLSX', size: '850 KB' },
    ],
    analysisSummary: 'Identificada a necessidade de 350 licenças baseada no levantamento da folha. O escopo e os valores foram alinhados estritamente à Ata de Registro de Preços informada.',
  },
  {
    id: 'tr-003',
    title: 'Serviço de consultoria em segurança da informação e LGPD',
    category: 'Segurança e Privacidade',
    createdAt: '2025-06-02T16:40:00',
    generatedBy: 'ai',
    status: 'rejected',
    reviewer: 'Carlos Eduardo Lima',
    reviewedAt: '2025-06-03T11:30:00',
    rejectionReason:
      'Escopo excessivamente genérico. Necessário especificar o número de horas técnicas, perfis dos consultores (sênior/pleno) e produtos entregáveis com critérios de aceite mensuráveis. Reencaminhar para revisão da equipe de TI antes de nova submissão.',
    version: 1,
    preview:
      'Contratação de serviços de consultoria especializada em segurança da informação e gestão de riscos...',
    fullContent: `1. OBJETO\nContratação de consultoria especializada em segurança da informação, análise de vulnerabilidades e adequação à LGPD.\n\n2. JUSTIFICATIVA\nAuditoria interna de 2024 identificou gaps críticos no programa de segurança da informação e ausência de mapeamento formal de dados pessoais tratados pela instituição.\n\n3. ESCOPO DOS SERVIÇOS\n- Diagnóstico de maturidade em segurança da informação\n- Análise de risco e vulnerabilidades\n- Elaboração de Política de Segurança da Informação\n- Mapeamento de dados pessoais (RoPA)\n- Treinamento das equipes\n\n4. VALOR ESTIMADO\nR$ 320.000,00.`,
    sourceDocuments: [
      { id: 'sd-5', name: 'Relatório de Auditoria 2024.pdf', type: 'PDF', size: '12 MB' },
      { id: 'sd-6', name: 'Plano de Ação LGPD.pdf', type: 'PDF', size: '3.2 MB' },
    ],
    analysisSummary: 'O escopo baseou-se nos 5 apontamentos críticos do Relatório de Auditoria 2024. O valor foi estimado pela média das contratações similares recentes.',
  },
  {
    id: 'tr-004',
    title: 'Contratação de link de internet dedicado – 1 Gbps simétrico',
    category: 'Conectividade',
    createdAt: '2025-06-05T08:15:00',
    generatedBy: 'ai',
    status: 'pending',
    version: 1,
    preview:
      'Contratação de acesso à internet por link dedicado com velocidade simétrica de 1 Gbps...',
    fullContent: `1. OBJETO\nContratação de link de acesso à internet dedicado com capacidade de 1 Gbps simétrico para a sede administrativa da instituição.\n\n2. ESPECIFICAÇÕES TÉCNICAS\n- Velocidade: 1 Gbps upload e download\n- SLA de disponibilidade: mínimo 99,5% ao mês\n- Tempo máximo de reparo: 4 horas\n- Fornecimento de equipamento CPE\n- Endereços IP fixos: /29 (6 utilizáveis)\n- Suporte técnico 24x7 com atendimento telefônico\n\n3. PRAZO\n24 meses.\n\n4. VALOR ESTIMADO\nR$ 96.000,00 (R$ 4.000,00/mês), baseado em pesquisa de preços realizada em junho/2025.`,
    sourceDocuments: [
      { id: 'sd-7', name: 'Requisitos de Rede 2025.pdf', type: 'PDF', size: '1.5 MB' },
      { id: 'sd-8', name: 'Pesquisa de Mercado - Links Dedicados.xlsx', type: 'XLSX', size: '500 KB' },
    ],
    analysisSummary: 'Requisitos de SLA de 99,5% e IPs fixos /29 extraídos dos padrões de rede atuais. Valores médios da pesquisa de mercado consolidados em R$ 4.000/mês.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusConfig(status: ReviewStatus) {
  if (status === 'approved')
    return {
      label: 'Aprovado',
      icon: <CheckCircle2Icon className="size-3.5" />,
      className:
        'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400',
    };
  if (status === 'rejected')
    return {
      label: 'Em Ajuste',
      icon: <XCircleIcon className="size-3.5" />,
      className:
        'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
    };
  return {
    label: 'Na Fila',
    icon: <ClockIcon className="size-3.5" />,
    className:
      'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  };
}

function buildSystemPrompt(doc: TRDocument): string {
  return `Você é um especialista em licitações públicas e redação de Termos de Referência (TR).
Seu papel é ajudar a corrigir e aprimorar o TR abaixo, que foi reprovado por um gestor do sistema.

## TR ORIGINAL
Título: ${doc.title}
Categoria: ${doc.category}

Conteúdo:
${doc.fullContent}

## MOTIVO DA REPROVAÇÃO
${doc.rejectionReason}

Responda de forma direta e ofereça trechos corrigidos prontos para substituir no documento.`;
}

// ─── Inline Chat Component ───────────────────────────────────────────────────

function CorrectionChat({ doc }: { doc: TRDocument }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    // Mock the opening message
    setMessages([
      {
        role: 'assistant',
        content: `Analisei o motivo da reprovação: "${doc.rejectionReason}".\nPara corrigir o escopo genérico, posso sugerir uma tabela de entregáveis e critérios de aceite. Deseja que eu gere uma proposta?`,
      },
    ]);
  }, [doc]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Aqui está uma sugestão de adequação:\n\n**3.1 Produtos Entregáveis**\n- Relatório de Diagnóstico (Aceite: Validação pelo CISO)\n- Política de SI (Aceite: Aprovação da Diretoria)\n\nDeseja aplicar esta alteração ao documento?`,
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-[400px] flex-col overflow-hidden rounded-xl border border-primary/20 bg-muted/20">
      <div className="flex items-center gap-2 border-b bg-background/80 px-4 py-3">
        <SparklesIcon className="size-4 text-primary" />
        <span className="text-sm font-medium">Assistente de Correção</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-sm'
                : 'bg-background border rounded-bl-sm text-foreground'
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border bg-background px-3.5 py-2.5">
              <span className="flex gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground delay-100" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground delay-200" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t bg-background p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite como deseja corrigir o documento..."
            className="flex-1 rounded-lg border bg-muted/40 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim() || isLoading}>
            <SendIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Compact Kanban Card ──────────────────────────────────────────────────────

function TRKanbanCard({ doc, onClick }: { doc: TRDocument; onClick: () => void }) {
  const cfg = statusConfig(doc.status);

  return (
    <Card
      className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <Badge variant="outline" className="text-[10px] uppercase font-semibold text-muted-foreground">
            {doc.category}
          </Badge>
          <span className="text-[10px] text-muted-foreground font-medium bg-muted px-1.5 py-0.5 rounded-sm">
            v{doc.version}
          </span>
        </div>
        <h3 className="text-sm font-semibold leading-tight line-clamp-2">
          {doc.title}
        </h3>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <PaperclipIcon className="size-3.5" />
            <span>{doc.sourceDocuments.length} docs base</span>
          </div>
          <div className="flex -space-x-1">
            {doc.generatedBy === 'ai' && (
              <div title="Gerado por IA" className="size-6 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background">
                <SparklesIcon className="size-3 text-primary" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main page (Kanban Esteira) ────────────────────────────────────────────────

export function TRReview() {
  const [documents, setDocuments] = useState<TRDocument[]>(MOCK_DOCUMENTS);
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<TRDocument | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const REVIEWER_NAME = 'Gestor do Sistema';

  const handleApprove = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
            ...doc,
            status: 'approved',
            reviewer: REVIEWER_NAME,
            reviewedAt: new Date().toISOString(),
            rejectionReason: undefined,
          }
          : doc,
      ),
    );
    setSelectedDoc((prev) => prev?.id === id ? { ...prev, status: 'approved' } : prev);
  };

  const handleRejectConfirm = () => {
    if (!selectedDoc || !rejectReason.trim()) return;
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedDoc.id
          ? {
            ...doc,
            status: 'rejected',
            reviewer: REVIEWER_NAME,
            reviewedAt: new Date().toISOString(),
            rejectionReason: rejectReason,
          }
          : doc,
      ),
    );
    setSelectedDoc((prev) => prev ? { ...prev, status: 'rejected', rejectionReason: rejectReason } : null);
    setIsRejecting(false);
    setRejectReason('');
  };

  const filtered = documents.filter((doc) => {
    return (
      search.trim() === '' ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  const cols = {
    pending: filtered.filter((d) => d.status === 'pending'),
    rejected: filtered.filter((d) => d.status === 'rejected'),
    approved: filtered.filter((d) => d.status === 'approved'),
  };

  return (
    <>
      <AdminPageShell
        breadcrumbs={[
          { label: 'Administrador', href: '/admin/visao-geral' },
          { label: 'Esteira de Revisão' },
        ]}
        title="Esteira de Revisão de TRs"
        description="Analise os documentos gerados, acompanhe as fontes de informação e aprove o prosseguimento dos Termos de Referência."
        badge="Kanban"
      >
        <div className="mb-6 flex justify-between items-center">
          <div className="relative w-full sm:w-80">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar TRs por título ou categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border">
            <LayoutKanbanIcon className="size-4" />
            <span>Fluxo de aprovação em esteira</span>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">

          {/* Coluna Pendentes */}
          <div className="flex flex-col gap-4 bg-muted/20 p-4 rounded-xl border border-dashed">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <ClockIcon className="size-4" />
                Na Fila
              </h2>
              <Badge variant="secondary" className="bg-background">{cols.pending.length}</Badge>
            </div>
            {cols.pending.map((doc) => (
              <TRKanbanCard key={doc.id} doc={doc} onClick={() => setSelectedDoc(doc)} />
            ))}
            {cols.pending.length === 0 && (
              <div className="text-center p-6 text-sm text-muted-foreground border-2 border-dashed rounded-xl">
                Nenhum documento na fila
              </div>
            )}
          </div>

          {/* Coluna Reprovados */}
          <div className="flex flex-col gap-4 bg-red-500/5 p-4 rounded-xl border border-dashed border-red-500/20">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold flex items-center gap-2 text-red-700 dark:text-red-400">
                <XCircleIcon className="size-4" />
                Em Ajuste (Reprovados)
              </h2>
              <Badge variant="secondary" className="bg-background">{cols.rejected.length}</Badge>
            </div>
            {cols.rejected.map((doc) => (
              <TRKanbanCard key={doc.id} doc={doc} onClick={() => setSelectedDoc(doc)} />
            ))}
            {cols.rejected.length === 0 && (
              <div className="text-center p-6 text-sm text-muted-foreground border-2 border-dashed rounded-xl border-red-500/20">
                Nenhum ajuste necessário
              </div>
            )}
          </div>

          {/* Coluna Aprovados */}
          <div className="flex flex-col gap-4 bg-green-500/5 p-4 rounded-xl border border-dashed border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2Icon className="size-4" />
                Aprovados
              </h2>
              <Badge variant="secondary" className="bg-background">{cols.approved.length}</Badge>
            </div>
            {cols.approved.map((doc) => (
              <TRKanbanCard key={doc.id} doc={doc} onClick={() => setSelectedDoc(doc)} />
            ))}
            {cols.approved.length === 0 && (
              <div className="text-center p-6 text-sm text-muted-foreground border-2 border-dashed rounded-xl border-green-500/20">
                Nenhum TR aprovado
              </div>
            )}
          </div>
        </div>
      </AdminPageShell>

      {/* Details Panel */}
      <Sheet open={!!selectedDoc} onOpenChange={(open) => {
        if (!open) {
          setSelectedDoc(null);
          setIsRejecting(false);
        }
      }}>
        <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto p-0 sm:max-w-2xl">
          {selectedDoc && (
            <div className="flex flex-col h-full bg-background">

              {/* Header */}
              <div className="px-6 py-4 border-b bg-muted/10 sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{selectedDoc.category}</Badge>
                  {statusConfig(selectedDoc.status).icon}
                  <span className={`text-xs font-medium ${statusConfig(selectedDoc.status).className} px-2 py-0.5 rounded-full border`}>
                    {statusConfig(selectedDoc.status).label}
                  </span>
                </div>
                <h2 className="text-xl font-bold leading-tight">{selectedDoc.title}</h2>
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <ClockIcon className="size-3.5" /> Gerado em {formatDate(selectedDoc.createdAt)}
                  <span className="mx-2 opacity-50">|</span>
                  <span>Versão {selectedDoc.version}</span>
                </p>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 space-y-8">

                {/* Rejection Alert */}
                {selectedDoc.status === 'rejected' && selectedDoc.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/50 p-4 rounded-xl">
                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 flex items-center gap-2 mb-1">
                      <XCircleIcon className="size-4" /> Motivo da Reprovação
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {selectedDoc.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Source Context (Novo Recurso de "Esteira de Análise") */}
                <section>
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                    <BrainCircuitIcon className="size-4" /> Análise e Fontes da IA
                  </h3>
                  <div className="bg-muted/30 border rounded-xl p-4 space-y-4">
                    <p className="text-sm leading-relaxed text-foreground/90">
                      <strong>Resumo da Análise:</strong> {selectedDoc.analysisSummary}
                    </p>
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground mb-2 block">DOCUMENTOS BASE UTILIZADOS</span>
                      <div className="flex flex-col gap-2">
                        {selectedDoc.sourceDocuments.map((sd) => (
                          <div key={sd.id} className="flex items-center justify-between bg-background border px-3 py-2 rounded-lg text-sm">
                            <div className="flex items-center gap-2">
                              <FileIcon className="size-4 text-primary/70" />
                              <span className="font-medium">{sd.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{sd.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* TR Content */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground flex items-center gap-2">
                      <FileTextIcon className="size-4" /> Documento Gerado
                    </h3>
                    <Button variant="ghost" size="sm" className="h-8 text-primary">Copiar Texto</Button>
                  </div>
                  <div className="bg-background border rounded-xl p-5 shadow-sm">
                    <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90">
                      {selectedDoc.fullContent}
                    </p>
                  </div>
                </section>

                {/* Chat (Apenas se reprovado ou para pedir edições) */}
                {selectedDoc.status === 'rejected' && (
                  <section>
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                      <MessageSquareIcon className="size-4" /> Ajuste com a IA
                    </h3>
                    <CorrectionChat doc={selectedDoc} />
                  </section>
                )}
              </div>

              {/* Footer Actions */}
              {selectedDoc.status === 'pending' && (
                <div className="border-t bg-background p-4 flex gap-3 justify-end sticky bottom-0 z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
                  {isRejecting ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        autoFocus
                        placeholder="Descreva o motivo da reprovação..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="flex-1 rounded-md border px-3 text-sm"
                      />
                      <Button variant="outline" onClick={() => setIsRejecting(false)}>Cancelar</Button>
                      <Button variant="destructive" onClick={handleRejectConfirm} disabled={!rejectReason}>Confirmar</Button>
                    </div>
                  ) : (
                    <>
                      <Button variant="outline" className="border-red-500/30 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setIsRejecting(true)}>
                        <ThumbsDownIcon className="size-4 mr-2" /> Reprovar
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(selectedDoc.id)}>
                        <ThumbsUpIcon className="size-4 mr-2" /> Aprovar Documento
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
