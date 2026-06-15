/* eslint-disable @typescript-eslint/no-explicit-any */
import { approveTR, getTRById, listTRs, rejectTR, sendTRChatMessage } from '@/app/services/tr';
import type { TRDocument, ReviewStatus } from '@/app/models/tr';
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
  AlertCircleIcon,
  BrainCircuitIcon,
  CheckCircle2Icon,
  ClockIcon,
  FileIcon,
  FileTextIcon,
  LayoutIcon,
  Loader2Icon,
  MessageSquareIcon,
  PaperclipIcon,
  RefreshCwIcon,
  SearchIcon,
  SendIcon,
  SparklesIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  XCircleIcon
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

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

// ─── Inline Correction Chat ──────────────────────────────────────────────────

function CorrectionChat({
  doc,
  onDocumentUpdated,
}: {
  doc: TRDocument;
  onDocumentUpdated: (updated: TRDocument) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const greeting = doc.rejectionReason
      ? `Analisei o motivo da reprovação: "${doc.rejectionReason}".\nPode me dizer qual seção deseja corrigir e como? Por exemplo: "No tópico 3, especifique X horas e os perfis técnicos."`
      : 'Como posso ajudar a melhorar este Termo de Referência? Descreva a alteração que deseja fazer.';
    setMessages([{ role: 'assistant', content: greeting }]);
  }, [doc.id, doc.rejectionReason]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendTRChatMessage(doc.id, { message: text });

      if (response.changed_sections.length > 0) {
        // TR was updated and moved back to pending
        onDocumentUpdated(response.tr);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: response.message,
          },
        ]);
      } else {
        // AI could not identify what to change — display message, keep doc as-is
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.message },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Ocorreu um erro ao processar a correção: ${err?.response?.data?.detail || err?.message || 'Erro desconhecido.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [doc.id, input, isLoading, onDocumentUpdated]);

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
            {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Compact Kanban Card ──────────────────────────────────────────────────────

function TRKanbanCard({ doc, onClick }: { doc: TRDocument; onClick: () => void }) {
  const srcCount = doc.sourceDocuments?.length ?? '—';

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
            <span>{typeof srcCount === 'number' ? `${srcCount} docs base` : 'Fontes disponíveis no detalhe'}</span>
          </div>
          <div className="flex -space-x-1">
            {doc.generatedBy === 'ai' && (
              <div title="Gerado por IA" className="size-6 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background">
                <SparklesIcon className="size-3 text-primary" />
              </div>
            )}
          </div>
        </div>

        {doc.status === 'rejected' && doc.rejectionReason && (
          <p className="text-[11px] text-red-600 dark:text-red-400 line-clamp-2 border-t border-red-200 dark:border-red-900/30 pt-2">
            {doc.rejectionReason}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main page (Kanban Esteira) ────────────────────────────────────────────────

export function TRReview() {
  const [documents, setDocuments] = useState<TRDocument[]>([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<TRDocument | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // ── Load all TRs (one call, group by status on front) ──
  const fetchDocuments = useCallback(async () => {
    setIsListLoading(true);
    setListError(null);
    try {
      const response = await listTRs({ page_size: 100 });
      setDocuments(response.trs);
    } catch (err: any) {
      setListError(err?.response?.data?.detail || err?.message || 'Erro ao carregar documentos.');
    } finally {
      setIsListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // ── Open card → load full detail ──
  const handleOpenCard = useCallback(async (doc: TRDocument) => {
    setSelectedDoc(doc);
    setIsRejecting(false);
    setRejectReason('');
    setActionError(null);

    // Fetch detail only if heavy fields are missing
    if (!doc.fullContent) {
      setIsDetailLoading(true);
      try {
        const detail = await getTRById(doc.id);
        setSelectedDoc(detail);
        // Also update the list entry so we don't re-fetch next time
        setDocuments((prev) => prev.map((d) => d.id === detail.id ? detail : d));
      } catch (err: any) {
        console.error('Failed to load TR detail', err);
      } finally {
        setIsDetailLoading(false);
      }
    }
  }, []);

  // ── Approve ──
  const handleApprove = useCallback(async (id: string) => {
    setIsActionLoading(true);
    setActionError(null);
    try {
      const updated = await approveTR(id);
      setDocuments((prev) => prev.map((d) => d.id === id ? updated : d));
      setSelectedDoc(updated);
    } catch (err: any) {
      setActionError(err?.response?.data?.detail || err?.message || 'Erro ao aprovar o TR.');
    } finally {
      setIsActionLoading(false);
    }
  }, []);

  // ── Reject ──
  const handleRejectConfirm = useCallback(async () => {
    if (!selectedDoc || !rejectReason.trim()) return;
    setIsActionLoading(true);
    setActionError(null);
    try {
      const updated = await rejectTR(selectedDoc.id, { reason: rejectReason });
      setDocuments((prev) => prev.map((d) => d.id === selectedDoc.id ? updated : d));
      setSelectedDoc(updated);
      setIsRejecting(false);
      setRejectReason('');
    } catch (err: any) {
      setActionError(err?.response?.data?.detail || err?.message || 'Erro ao reprovar o TR.');
    } finally {
      setIsActionLoading(false);
    }
  }, [selectedDoc, rejectReason]);

  // ── Correction chat updated the doc (new version, back to pending) ──
  const handleDocumentUpdated = useCallback((updated: TRDocument) => {
    setDocuments((prev) => prev.map((d) => d.id === updated.id ? { ...d, ...updated } : d));
    setSelectedDoc((prev) => prev ? { ...prev, ...updated } : null);
  }, []);

  // ── Filter & group ──
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
          { label: 'Administrador', href: '/admin/chat' },
          { label: 'Esteira de Revisão' },
        ]}
        title="Esteira de Revisão de TRs"
        description="Analise os documentos gerados, acompanhe as fontes de informação e aprove o prosseguimento dos Termos de Referência."
        badge="Kanban"
      >
        <div className="mb-6 flex justify-between items-center gap-4">
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
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchDocuments}
              disabled={isListLoading}
              title="Recarregar lista"
            >
              <RefreshCwIcon className={`size-4 ${isListLoading ? 'animate-spin' : ''}`} />
            </Button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border">
              <LayoutIcon className="size-4" />
              <span>Fluxo de aprovação em esteira</span>
            </div>
          </div>
        </div>

        {/* Global error */}
        {listError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircleIcon className="size-4 shrink-0" />
            {listError}
          </div>
        )}

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
            {isListLoading ? (
              <div className="flex justify-center py-8">
                <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {cols.pending.map((doc) => (
                  <TRKanbanCard key={doc.id} doc={doc} onClick={() => handleOpenCard(doc)} />
                ))}
                {cols.pending.length === 0 && (
                  <div className="text-center p-6 text-sm text-muted-foreground border-2 border-dashed rounded-xl">
                    Nenhum documento na fila
                  </div>
                )}
              </>
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
            {isListLoading ? (
              <div className="flex justify-center py-8">
                <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {cols.rejected.map((doc) => (
                  <TRKanbanCard key={doc.id} doc={doc} onClick={() => handleOpenCard(doc)} />
                ))}
                {cols.rejected.length === 0 && (
                  <div className="text-center p-6 text-sm text-muted-foreground border-2 border-dashed rounded-xl border-red-500/20">
                    Nenhum ajuste necessário
                  </div>
                )}
              </>
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
            {isListLoading ? (
              <div className="flex justify-center py-8">
                <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {cols.approved.map((doc) => (
                  <TRKanbanCard key={doc.id} doc={doc} onClick={() => handleOpenCard(doc)} />
                ))}
                {cols.approved.length === 0 && (
                  <div className="text-center p-6 text-sm text-muted-foreground border-2 border-dashed rounded-xl border-green-500/20">
                    Nenhum TR aprovado
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </AdminPageShell>

      {/* Details Panel */}
      <Sheet open={!!selectedDoc} onOpenChange={(open) => {
        if (!open) {
          setSelectedDoc(null);
          setIsRejecting(false);
          setActionError(null);
        }
      }}>
        <SheetContent side="right" className="w-full overflow-y-auto max-w-[600px] p-0">
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

                {/* Action error */}
                {actionError && (
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircleIcon className="size-4 shrink-0" />
                    {actionError}
                  </div>
                )}

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

                {/* Source Context */}
                {isDetailLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    {/* AI Analysis & Sources */}
                    <section>
                      <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                        <BrainCircuitIcon className="size-4" /> Análise e Fontes da IA
                      </h3>
                      <div className="bg-muted/30 border rounded-xl p-4 space-y-4">
                        {selectedDoc.analysisSummary ? (
                          <p className="text-sm leading-relaxed text-foreground/90">
                            <strong>Resumo da Análise:</strong> {selectedDoc.analysisSummary}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">Resumo da análise não disponível nesta versão.</p>
                        )}
                        {selectedDoc.sourceDocuments && selectedDoc.sourceDocuments.length > 0 && (
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground mb-2 block">DOCUMENTOS BASE UTILIZADOS</span>
                            <div className="flex flex-col gap-2">
                              {selectedDoc.sourceDocuments.map((sd) => (
                                <div key={sd.id} className="flex items-center justify-between bg-background border px-3 py-2 rounded-lg text-sm">
                                  <div className="flex items-center gap-2">
                                    <FileIcon className="size-4 text-primary/70" />
                                    <span className="font-medium">{sd.name}</span>
                                  </div>
                                  {sd.size ? (
                                    <span className="text-xs text-muted-foreground">{sd.size}</span>
                                  ) : (
                                    <Badge variant="outline" className="text-[10px] uppercase">{sd.type}</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* TR Full Content */}
                    <section>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold uppercase text-muted-foreground flex items-center gap-2">
                          <FileTextIcon className="size-4" /> Documento Gerado
                        </h3>
                        {selectedDoc.fullContent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-primary"
                            onClick={() => navigator.clipboard.writeText(selectedDoc.fullContent!)}
                          >
                            Copiar Texto
                          </Button>
                        )}
                      </div>
                      <div className="bg-background border rounded-xl p-5 shadow-sm">
                        {selectedDoc.fullContent ? (
                          <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90">
                            {selectedDoc.fullContent}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            {selectedDoc.preview}
                          </p>
                        )}
                      </div>
                    </section>

                    {/* Correction Chat — only for rejected TRs */}
                    {selectedDoc.status === 'rejected' && (
                      <section>
                        <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                          <MessageSquareIcon className="size-4" /> Ajuste com a IA
                        </h3>
                        <CorrectionChat
                          doc={selectedDoc}
                          onDocumentUpdated={handleDocumentUpdated}
                        />
                      </section>
                    )}
                  </>
                )}
              </div>

              {/* Footer Actions — only for pending TRs */}
              {selectedDoc.status === 'pending' && (
                <div className="border-t bg-background p-4 flex gap-3 justify-end sticky bottom-0 z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
                  {isRejecting ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        autoFocus
                        placeholder="Descreva o motivo da reprovação..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRejectConfirm()}
                        className="flex-1 rounded-md border px-3 text-sm"
                      />
                      <Button variant="outline" onClick={() => setIsRejecting(false)} disabled={isActionLoading}>
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleRejectConfirm}
                        disabled={!rejectReason.trim() || isActionLoading}
                      >
                        {isActionLoading ? <Loader2Icon className="size-4 animate-spin mr-2" /> : null}
                        Confirmar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="border-red-500/30 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setIsRejecting(true)}
                        disabled={isActionLoading}
                      >
                        <ThumbsDownIcon className="size-4 mr-2" /> Reprovar
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(selectedDoc.id)}
                        disabled={isActionLoading}
                      >
                        {isActionLoading
                          ? <Loader2Icon className="size-4 animate-spin mr-2" />
                          : <ThumbsUpIcon className="size-4 mr-2" />
                        }
                        Aprovar Documento
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
