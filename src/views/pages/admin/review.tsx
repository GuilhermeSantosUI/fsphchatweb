/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdminPageShell } from '@/views/components/admin/admin-page-shell';
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
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleDashedIcon,
  ClockIcon,
  FileTextIcon,
  MessageSquareIcon,
  MessageSquarePlusIcon,
  SearchIcon,
  SendIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  XCircleIcon,
  XIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewStatus = 'pending' | 'approved' | 'rejected';

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
      'Contratação de empresa especializada para fornecimento de plataforma SaaS de monitoramento contínuo de ativos de infraestrutura de TI, contemplando servidores, redes, bancos de dados e endpoints...',
    fullContent: `1. OBJETO\nContratação de empresa especializada para fornecimento de plataforma SaaS de monitoramento contínuo de ativos de infraestrutura de TI, contemplando servidores, redes, bancos de dados e endpoints, com emissão de alertas em tempo real e dashboards gerenciais.\n\n2. JUSTIFICATIVA\nA instituição opera com parque tecnológico distribuído em múltiplos data centers sem visibilidade centralizada de disponibilidade e desempenho. Incidentes não detectados tempestivamente geram impacto direto na continuidade dos serviços ao cidadão.\n\n3. ESPECIFICAÇÕES TÉCNICAS\n- Coleta de métricas com granularidade mínima de 60 segundos\n- Retenção histórica de dados por no mínimo 13 meses\n- API REST para integração com sistemas legados\n- Suporte a protocolo SNMP v2c e v3\n- Autenticação via SSO/SAML 2.0\n\n4. PRAZO DE EXECUÇÃO\n12 meses, prorrogáveis por igual período, nos termos da Lei 14.133/2021.\n\n5. ESTIMATIVA DE VALOR\nR$ 480.000,00 (quatrocentos e oitenta mil reais) anuais, com base em pesquisa de mercado realizada em maio/2025.`,
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
      'Aquisição de licenças Microsoft 365 Business Premium para 350 usuários, incluindo aplicativos Office, Exchange Online, Teams, SharePoint e proteção avançada contra ameaças...',
    fullContent: `1. OBJETO\nAquisição de 350 licenças Microsoft 365 Business Premium, incluindo suite de produtividade, colaboração e segurança de endpoints.\n\n2. JUSTIFICATIVA\nContratos vigentes expiram em 31/07/2025. A continuidade das operações depende da renovação tempestiva para evitar interrupção de acesso a e-mails e documentos institucionais.\n\n3. ESPECIFICAÇÕES\n- Microsoft 365 Business Premium – 350 licenças\n- Período: 12 meses\n- Inclui: Exchange Online Plan 2, Teams, SharePoint, OneDrive 1TB/usuário, Defender for Business\n\n4. VALOR ESTIMADO\nR$ 210.000,00 com base em ata de registro de preços vigente – UASG 000123.`,
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
      'Contratação de serviços de consultoria especializada em segurança da informação, gestão de riscos cibernéticos e adequação à Lei Geral de Proteção de Dados Pessoais...',
    fullContent: `1. OBJETO\nContratação de consultoria especializada em segurança da informação, análise de vulnerabilidades e adequação à LGPD.\n\n2. JUSTIFICATIVA\nAuditoria interna de 2024 identificou gaps críticos no programa de segurança da informação e ausência de mapeamento formal de dados pessoais tratados pela instituição.\n\n3. ESCOPO DOS SERVIÇOS\n- Diagnóstico de maturidade em segurança da informação\n- Análise de risco e vulnerabilidades\n- Elaboração de Política de Segurança da Informação\n- Mapeamento de dados pessoais (RoPA)\n- Treinamento das equipes\n\n4. VALOR ESTIMADO\nR$ 320.000,00.`,
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
      'Contratação de acesso à internet por link dedicado com velocidade simétrica de 1 Gbps, SLA de disponibilidade de 99,5% e suporte técnico 24x7 para a sede administrativa...',
    fullContent: `1. OBJETO\nContratação de link de acesso à internet dedicado com capacidade de 1 Gbps simétrico para a sede administrativa da instituição.\n\n2. ESPECIFICAÇÕES TÉCNICAS\n- Velocidade: 1 Gbps upload e download\n- SLA de disponibilidade: mínimo 99,5% ao mês\n- Tempo máximo de reparo: 4 horas\n- Fornecimento de equipamento CPE\n- Endereços IP fixos: /29 (6 utilizáveis)\n- Suporte técnico 24x7 com atendimento telefônico\n\n3. PRAZO\n24 meses.\n\n4. VALOR ESTIMADO\nR$ 96.000,00 (R$ 4.000,00/mês), baseado em pesquisa de preços realizada em junho/2025.`,
  },
  {
    id: 'tr-005',
    title: 'Desenvolvimento de portal de transparência pública',
    category: 'Desenvolvimento de Software',
    createdAt: '2025-06-01T11:00:00',
    generatedBy: 'ai',
    status: 'pending',
    version: 3,
    preview:
      'Desenvolvimento, implantação e manutenção de portal web de transparência ativa, em conformidade com a Lei de Acesso à Informação, integrando dados orçamentários, contratos e licitações...',
    fullContent: `1. OBJETO\nDesenvolvimento, implantação e manutenção evolutiva de portal de transparência ativa em conformidade com a Lei 12.527/2011 (LAI).\n\n2. REQUISITOS FUNCIONAIS\n- Publicação automatizada de dados de execução orçamentária\n- Integração com sistemas SIAFI e SIAPE\n- Busca full-text em documentos de licitação\n- Exportação de dados em CSV, JSON e XML\n- Painel de atendimento a pedidos de acesso à informação (e-SIC)\n- Acessibilidade WCAG 2.1 nível AA\n\n3. STACK TECNOLÓGICA MÍNIMA\n- Frontend: framework moderno (React/Next.js ou Vue/Nuxt)\n- Backend: API REST com autenticação OAuth 2.0\n- Banco de dados relacional com suporte a replicação\n- Hospedagem em nuvem pública com IaC (Terraform)\n\n4. PRAZO\n6 meses para entrega, 12 meses de garantia.\n\n5. VALOR ESTIMADO\nR$ 850.000,00.`,
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
      label: 'Reprovado',
      icon: <XCircleIcon className="size-3.5" />,
      className:
        'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
    };
  return {
    label: 'Pendente',
    icon: <ClockIcon className="size-3.5" />,
    className:
      'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  };
}

function buildSystemPrompt(doc: TRDocument): string {
  return `Você é um especialista em licitações públicas e redação de Termos de Referência (TR) conforme a Lei 14.133/2021.

Seu papel é ajudar a corrigir e aprimorar o TR abaixo, que foi reprovado por um gestor do sistema.

## TR ORIGINAL

Título: ${doc.title}
Categoria: ${doc.category}

Conteúdo:
${doc.fullContent}

## MOTIVO DA REPROVAÇÃO

${doc.rejectionReason}

## SUAS INSTRUÇÕES

- Analise o TR e o motivo da reprovação com atenção.
- Responda de forma direta e objetiva, sempre em português.
- Quando o usuário pedir ajustes, apresente o trecho corrigido de forma clara, formatado como texto de TR (não como código).
- Ao final de uma rodada de correções, ofereça gerar o TR completo revisado se o usuário quiser.
- Nunca invente dados técnicos que não estejam no documento original. Peça ao usuário caso precise de informações adicionais.`;
}

// ─── Inline Chat Panel ────────────────────────────────────────────────────────

function CorrectionChat({
  doc,
  onClose,
}: {
  doc: TRDocument;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Send opening message automatically on mount
  useEffect(() => {
    const openingUserMessage: ChatMessage = {
      role: 'user',
      content: `Analise o TR reprovado e me dê um diagnóstico claro do que precisa ser corrigido para atender ao motivo da reprovação.`,
    };
    callApi([openingUserMessage], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callApi = async (history: ChatMessage[], isOpening = false) => {
    setIsLoading(true);
    if (isOpening) setIsInitializing(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: buildSystemPrompt(doc),
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const assistantText =
        data.content?.find((b: any) => b.type === 'text')?.text ??
        'Não foi possível obter resposta. Tente novamente.';

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantText,
      };

      if (isOpening) {
        setMessages([assistantMessage]);
      } else {
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch {
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content:
          'Erro ao conectar com a IA. Verifique sua conexão e tente novamente.',
      };
      if (isOpening) setMessages([errorMsg]);
      else setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setIsInitializing(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await callApi(updatedMessages);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-grow textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-primary/20 bg-muted/20">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b bg-background/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-primary" />
          <span className="text-sm font-medium">Correção assistida por IA</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            v{doc.version + 1} em edição
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Fechar chat"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex h-80 flex-col gap-3 overflow-y-auto px-4 py-4">
        {isInitializing ? (
          <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
            <SparklesIcon className="size-4 animate-pulse text-primary" />
            Analisando o TR e o motivo da reprovação...
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="mr-2 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <SparklesIcon className="size-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
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
                <div className="mr-2 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <SparklesIcon className="size-3.5 text-primary" />
                </div>
                <div className="rounded-2xl rounded-bl-sm border bg-background px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-background/80 px-3 py-3">
        <div className="flex items-end gap-2 rounded-xl border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Peça uma correção específica, ex: 'Adicione os perfis dos consultores e crie critérios de aceite mensuráveis'..."
            disabled={isLoading || isInitializing}
            className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
            style={{ minHeight: '24px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isInitializing}
            className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
            aria-label="Enviar mensagem"
          >
            <SendIcon className="size-3.5" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          Enter para enviar · Shift+Enter para nova linha
        </p>
      </div>
    </div>
  );
}

// ─── Rejection Modal ───────────────────────────────────────────────────────────

function RejectionModal({
  docTitle,
  onConfirm,
  onCancel,
}: {
  docTitle: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border bg-background p-6 shadow-xl">
        <h2 className="mb-1 text-base font-semibold">Reprovar documento</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Informe o motivo da reprovação de{' '}
          <span className="font-medium text-foreground">"{docTitle}"</span>.
          Esse texto será visível para a equipe responsável pela revisão.
        </p>
        <textarea
          autoFocus
          rows={5}
          placeholder="Ex: Escopo insuficiente. Necessário detalhar os critérios de aceite e especificar perfil técnico dos profissionais envolvidos."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full resize-none rounded-lg border border-input bg-muted/40 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason.trim())}
          >
            <ThumbsDownIcon className="size-4" />
            Confirmar reprovação
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── TR Card ──────────────────────────────────────────────────────────────────

function TRCard({
  doc,
  onApprove,
  onReject,
}: {
  doc: TRDocument;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const cfg = statusConfig(doc.status);

  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.className}`}
              >
                {cfg.icon}
                {cfg.label}
              </span>
              <Badge variant="secondary" className="text-xs">
                {doc.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                v{doc.version}
              </span>
              {doc.generatedBy === 'ai' && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs text-primary">
                  IA
                </span>
              )}
            </div>
            <CardTitle className="mt-1 text-base leading-snug">
              {doc.title}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <ClockIcon className="size-3" />
                Gerado em {formatDate(doc.createdAt)}
              </span>
              {doc.reviewer && (
                <span className="flex items-center gap-1">
                  <MessageSquareIcon className="size-3" />
                  Revisado por {doc.reviewer} em {formatDate(doc.reviewedAt!)}
                </span>
              )}
            </CardDescription>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-wrap gap-2">
            {doc.status === 'rejected' && (
              <Button
                size="sm"
                variant="outline"
                className={`gap-1.5 border-primary/30 text-primary hover:bg-primary/5 ${
                  chatOpen ? 'bg-primary/5' : ''
                }`}
                onClick={() => setChatOpen((v) => !v)}
              >
                <MessageSquarePlusIcon className="size-3.5" />
                {chatOpen ? 'Fechar correção' : 'Corrigir com IA'}
              </Button>
            )}
            {doc.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500/30 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                  onClick={() => onReject(doc.id)}
                >
                  <ThumbsDownIcon className="size-3.5" />
                  Reprovar
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 text-white hover:bg-green-700"
                  onClick={() => onApprove(doc.id)}
                >
                  <ThumbsUpIcon className="size-3.5" />
                  Aprovar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* Rejection reason */}
        {doc.status === 'rejected' && doc.rejectionReason && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5">
            <p className="mb-0.5 text-xs font-medium text-red-700 dark:text-red-400">
              Motivo da reprovação
            </p>
            <p className="text-xs leading-relaxed text-red-600/90 dark:text-red-300/90">
              {doc.rejectionReason}
            </p>
          </div>
        )}

        {/* Preview / full content */}
        <div className="rounded-xl border bg-muted/30 px-4 py-3">
          <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground">
            {expanded ? doc.fullContent : doc.preview}
          </p>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {expanded ? (
            <>
              <ChevronUpIcon className="size-3.5" />
              Recolher conteúdo
            </>
          ) : (
            <>
              <ChevronDownIcon className="size-3.5" />
              Ver conteúdo completo
            </>
          )}
        </button>

        {/* Inline correction chat — only for rejected docs */}
        {doc.status === 'rejected' && chatOpen && (
          <CorrectionChat doc={doc} onClose={() => setChatOpen(false)} />
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type FilterStatus = 'all' | ReviewStatus;

export function TRReview() {
  const [documents, setDocuments] = useState<TRDocument[]>(MOCK_DOCUMENTS);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

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
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectingId) return;
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === rejectingId
          ? {
              ...doc,
              status: 'rejected',
              reviewer: REVIEWER_NAME,
              reviewedAt: new Date().toISOString(),
              rejectionReason: reason,
            }
          : doc,
      ),
    );
    setRejectingId(null);
  };

  const rejectingDoc = documents.find((d) => d.id === rejectingId);

  const filtered = documents.filter((doc) => {
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesSearch =
      search.trim() === '' ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.category.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: documents.length,
    pending: documents.filter((d) => d.status === 'pending').length,
    approved: documents.filter((d) => d.status === 'approved').length,
    rejected: documents.filter((d) => d.status === 'rejected').length,
  };

  const filterTabs: { key: FilterStatus; label: string; count: number }[] = [
    { key: 'all', label: 'Todos', count: counts.all },
    { key: 'pending', label: 'Pendentes', count: counts.pending },
    { key: 'approved', label: 'Aprovados', count: counts.approved },
    { key: 'rejected', label: 'Reprovados', count: counts.rejected },
  ];

  return (
    <>
      {rejectingDoc && (
        <RejectionModal
          docTitle={rejectingDoc.title}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectingId(null)}
        />
      )}

      <AdminPageShell
        breadcrumbs={[
          { label: 'Administrador', href: '/admin/visao-geral' },
          { label: 'Revisão de TRs' },
        ]}
        title="Revisão de Termos de Referência"
        description="Analise, aprove ou reprove os Termos de Referência gerados pela IA antes de sua utilização em processos licitatórios."
        badge="Fila de aprovação"
        stats={[
          {
            label: 'Aguardando revisão',
            value: `${counts.pending}`,
            description: 'TRs gerados pela IA pendentes de análise.',
            tone: counts.pending > 0 ? 'warning' : 'default',
          },
          {
            label: 'Aprovados',
            value: `${counts.approved}`,
            description: 'Documentos validados e prontos para uso.',
            tone: 'success',
          },
          {
            label: 'Reprovados',
            value: `${counts.rejected}`,
            description: 'Documentos com pendências registradas.',
            tone: counts.rejected > 0 ? 'primary' : 'default',
          },
          {
            label: 'Total na fila',
            value: `${counts.all}`,
            description: 'TRs gerados no ciclo atual.',
            tone: 'default',
          },
        ]}
      >
        {/* Search + filter bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-xl border bg-muted/40 p-1 w-fit">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  filterStatus === tab.key
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    filterStatus === tab.key
                      ? 'bg-muted text-foreground'
                      : 'bg-transparent text-muted-foreground'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por título ou categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Document list */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
              <CircleDashedIcon className="size-10 opacity-30" />
              <p className="text-sm">
                {search
                  ? 'Nenhum documento encontrado para essa busca.'
                  : 'Nenhum documento nesta categoria ainda.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((doc) => (
              <TRCard
                key={doc.id}
                doc={doc}
                onApprove={handleApprove}
                onReject={(id) => setRejectingId(id)}
              />
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-xl border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
          <SlidersHorizontalIcon className="size-4 shrink-0" />
          <span className="flex items-center gap-1.5">
            <FileTextIcon className="size-3.5" />
            Todos os TRs listados foram gerados pela IA com base nos documentos
            da base documental.
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2Icon className="size-3.5 text-green-600" />
            TRs aprovados ficam disponíveis para uso em processos licitatórios.
          </span>
          <span className="flex items-center gap-1.5">
            <SparklesIcon className="size-3.5 text-primary" />
            TRs reprovados podem ser corrigidos diretamente com auxílio da IA.
          </span>
        </div>
      </AdminPageShell>
    </>
  );
}
