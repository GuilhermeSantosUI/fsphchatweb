/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminRoute } from '@/app/services/admin';
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
  DatabaseZapIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FolderSyncIcon,
  Layers3Icon,
  PencilLineIcon,
  Trash2Icon,
  UploadCloudIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  file?: File;
  status: 'pending' | 'uploading' | 'uploaded' | 'indexed' | 'error';
  errorMessage?: string;
};

type ActiveTab = 'upload' | 'editor';

const ACCEPTED_TYPES = '.pdf,.docx,.txt';
const ACCEPTED_LABELS = ['PDF', 'DOCX', 'TXT'];

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'txt' || ext === 'md' || ext === 'rtf') {
    return <FileTextIcon className="size-4" />;
  }
  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
    return <FileSpreadsheetIcon className="size-4" />;
  }
  return <FileIcon className="size-4" />;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function Attachments() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('upload');

  // Editor state
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [isSubmittingText, setIsSubmittingText] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [editorSuccess, setEditorSuccess] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const response = await adminRoute.listDocuments();
      let docList: any[] = [];
      if (Array.isArray(response)) {
        docList = response;
      } else if (response && typeof response === 'object') {
        const possibleArray =
          response.documentos ||
          response.files ||
          response.arquivos ||
          response.data;
        if (Array.isArray(possibleArray)) {
          docList = possibleArray;
        } else {
          const arrays = Object.values(response).filter(Array.isArray);
          if (arrays.length > 0) {
            docList = arrays[0] as any[];
          }
        }
      }

      const mapped = docList.map((doc: any, index: number) => {
        const name =
          typeof doc === 'string'
            ? doc
            : doc.nome ||
              doc.nome_arquivo ||
              doc.name ||
              doc.filename ||
              `documento-${index}`;
        const size =
          typeof doc === 'object' && typeof doc.size === 'number'
            ? doc.size
            : 0;
        return {
          id: name,
          name,
          size,
          uploadedAt: new Date(),
          status: 'indexed' as const,
        };
      });
      setFiles(mapped);
    } catch (error) {
      console.error('Erro ao listar documentos:', error);
      setSyncError('Erro ao carregar a lista de documentos.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const getErrorMessage = (error: unknown) => {
    if (
      typeof error === 'object' &&
      error &&
      'response' in error &&
      typeof (error as { response?: unknown }).response === 'object'
    ) {
      const response = (error as { response?: { data?: { message?: string } } })
        .response;
      const message = response?.data?.message;
      if (message) return message;
    }
    if (error instanceof Error && error.message) return error.message;
    return 'Falha ao processar a solicitacao.';
  };

  const uploadBatch = async (newFiles: UploadedFile[]) => {
    if (!newFiles.length) return;
    setIsUploading(true);
    setSyncError(null);

    for (const file of newFiles) {
      setFiles((prev) =>
        prev.map((current) =>
          current.id === file.id
            ? { ...current, status: 'uploading', errorMessage: undefined }
            : current,
        ),
      );

      try {
        if (!file.file) throw new Error('Arquivo não disponível para upload.');
        await adminRoute.uploadDocument(file.file);
        setFiles((prev) =>
          prev.map((current) =>
            current.id === file.id
              ? { ...current, status: 'uploaded', errorMessage: undefined }
              : current,
          ),
        );
      } catch (error) {
        setFiles((prev) =>
          prev.map((current) =>
            current.id === file.id
              ? {
                  ...current,
                  status: 'error',
                  errorMessage: getErrorMessage(error),
                }
              : current,
          ),
        );
      }
    }

    setIsUploading(false);
    await fetchDocuments();
  };

  const addFiles = async (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles: UploadedFile[] = Array.from(incoming).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      file,
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    await uploadBatch(newFiles);
  };

  const removeFile = async (file: UploadedFile) => {
    if (
      window.confirm(`Tem certeza que deseja excluir o documento ${file.name}?`)
    ) {
      if (file.status === 'uploaded' || file.status === 'indexed') {
        try {
          setSyncError(null);
          await adminRoute.removeDocument(file.name);
          await fetchDocuments();
        } catch (error) {
          setSyncError(getErrorMessage(error));
        }
      } else {
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
      }
    }
  };

  /**
   * Converte o conteúdo do editor em um arquivo .txt e envia via uploadDocument,
   * exatamente como se o usuário tivesse arrastado um arquivo.
   */
  const handleSubmitText = async () => {
    setEditorError(null);
    setEditorSuccess(null);

    const titleTrimmed = editorTitle.trim();
    const contentTrimmed = editorContent.trim();

    if (!titleTrimmed) {
      setEditorError('Informe um título para o documento.');
      return;
    }
    if (!contentTrimmed) {
      setEditorError('O conteúdo não pode estar vazio.');
      return;
    }

    // Gera um nome de arquivo seguro a partir do título
    const safeFileName =
      titleTrimmed
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s-_]/g, '')
        .trim()
        .replace(/\s+/g, '_')
        .toLowerCase() || 'documento';

    const fileName = `${safeFileName}.txt`;

    // Cria o blob/File com o conteúdo digitado
    const blob = new Blob([contentTrimmed], { type: 'text/plain' });
    const file = new File([blob], fileName, { type: 'text/plain' });

    const newEntry: UploadedFile = {
      id: crypto.randomUUID(),
      name: fileName,
      size: blob.size,
      uploadedAt: new Date(),
      file,
      status: 'pending',
    };

    setFiles((prev) => [...prev, newEntry]);
    setIsSubmittingText(true);

    try {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === newEntry.id
            ? { ...f, status: 'uploading', errorMessage: undefined }
            : f,
        ),
      );

      await adminRoute.uploadDocument(file);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === newEntry.id
            ? { ...f, status: 'uploaded', errorMessage: undefined }
            : f,
        ),
      );

      setEditorSuccess(
        `"${fileName}" gerado e enviado com sucesso para a base documental.`,
      );
      setEditorTitle('');
      setEditorContent('');
      await fetchDocuments();
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === newEntry.id
            ? { ...f, status: 'error', errorMessage: getErrorMessage(error) }
            : f,
        ),
      );
      setEditorError(getErrorMessage(error));
    } finally {
      setIsSubmittingText(false);
    }
  };

  const totalIndexed = files.filter(
    (file) => file.status === 'indexed' || file.status === 'uploaded',
  ).length;

  const pendingQueueCount = files.filter(
    (file) => file.status === 'pending' || file.status === 'uploading',
  ).length;

  const getStatusLabel = (status: UploadedFile['status']) => {
    if (status === 'pending') return 'Na fila';
    if (status === 'uploading') return 'Enviando';
    if (status === 'uploaded') return 'Enviado';
    if (status === 'indexed') return 'Indexado';
    return 'Falha';
  };

  const getStatusTone = (status: UploadedFile['status']) => {
    if (status === 'indexed') return 'success';
    if (status === 'error') return 'destructive';
    if (status === 'uploading' || status === 'pending') return 'warning';
    return 'default';
  };

  const wordCount = editorContent.trim()
    ? editorContent.trim().split(/\s+/).length
    : 0;

  const charCount = editorContent.length;

  return (
    <AdminPageShell
      breadcrumbs={[
        { label: 'Administrador', href: '/admin/visao-geral' },
        { label: 'Base documental' },
      ]}
      title="Base documental e anexos"
      description="Gerencie os arquivos que alimentam a base vetorial da IA para geracao de TR com contexto institucional confiavel e rastreavel."
      badge="RAG habilitado"
      actions={
        <>
          <Button
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            <UploadCloudIcon className="size-4" />
            {isUploading ? 'Enviando...' : 'Enviar documentos'}
          </Button>
        </>
      }
      stats={[
        {
          label: 'Documentos indexados',
          value: `${totalIndexed}`,
          description: 'Arquivos com embeddings disponiveis para recuperacao.',
          tone: 'primary',
        },
        {
          label: 'Fila de ingestao',
          value: `${pendingQueueCount}`,
          description: 'Arquivos aguardando processamento e validacao.',
          tone: pendingQueueCount ? 'warning' : 'default',
        },
        {
          label: 'Ultima atualizacao',
          value: 'Hoje',
          description: 'Sincronizacao da base vetorial concluida as 09:42.',
          tone: 'success',
        },
        {
          label: 'Cobertura do contexto',
          value: '94%',
          description:
            'Historico de TRs e anexos criticos disponiveis para busca.',
          tone: 'default',
        },
      ]}
    >
      {/* Tab switcher */}
      <div className="mb-6 flex gap-1 rounded-xl border bg-muted/40 p-1 w-fit">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <UploadCloudIcon className="size-4" />
          Enviar arquivo
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'editor'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <PencilLineIcon className="size-4" />
          Escrever texto
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        {/* Left column — Upload tab or Editor tab */}
        {activeTab === 'upload' ? (
          <Card>
            <CardHeader>
              <CardTitle>Enviar anexos para a IA</CardTitle>
              <CardDescription>
                Inclua editais, TRs antigos, pareceres e anexos tecnicos para
                enriquecer a geracao baseada em Ground Truth.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  addFiles(event.dataTransfer.files);
                }}
                onClick={() => inputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 transition-colors ${
                  dragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
                }`}
              >
                <UploadCloudIcon
                  className={`size-10 ${dragging ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Arraste arquivos aqui ou clique para selecionar
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PDF, DOCX e TXT de até 20 MB
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-1">
                  {ACCEPTED_LABELS.map((ext) => (
                    <Badge key={ext} variant="secondary" className="text-xs">
                      {ext}
                    </Badge>
                  ))}
                </div>
              </div>

              <input
                ref={inputRef}
                type="file"
                multiple
                accept={ACCEPTED_TYPES}
                className="hidden"
                onChange={async (event) => {
                  await addFiles(event.target.files);
                  event.currentTarget.value = '';
                }}
              />

              {syncError ? (
                <p className="text-xs text-destructive">{syncError}</p>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Escrever documento de texto</CardTitle>
              <CardDescription>
                Digite o conteúdo abaixo. Ele será convertido em um arquivo
                <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs font-mono">
                  .txt
                </code>
                e enviado automaticamente para a base documental.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="doc-title"
                  className="text-sm font-medium leading-none"
                >
                  Título do documento
                </label>
                <input
                  id="doc-title"
                  type="text"
                  placeholder="Ex: Diretrizes de contratação de TI – 2024"
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:opacity-50"
                  disabled={isSubmittingText}
                />
                <p className="text-xs text-muted-foreground">
                  Usado como nome do arquivo gerado (ex:{' '}
                  <code className="font-mono">
                    {editorTitle.trim()
                      ? editorTitle
                          .trim()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-zA-Z0-9\s-_]/g, '')
                          .trim()
                          .replace(/\s+/g, '_')
                          .toLowerCase()
                          .slice(0, 40) + '.txt'
                      : 'nome_do_documento.txt'}
                  </code>
                  ).
                </p>
              </div>

              {/* Content textarea */}
              <div className="space-y-1.5">
                <label
                  htmlFor="doc-content"
                  className="text-sm font-medium leading-none"
                >
                  Conteúdo
                </label>
                <textarea
                  id="doc-content"
                  rows={12}
                  placeholder="Escreva o conteúdo do documento aqui. Você pode colar texto de outras fontes, redigir normas internas, especificações técnicas, diretrizes, etc."
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:opacity-50 font-mono leading-relaxed"
                  disabled={isSubmittingText}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {wordCount} {wordCount === 1 ? 'palavra' : 'palavras'} ·{' '}
                    {charCount} {charCount === 1 ? 'caractere' : 'caracteres'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tamanho estimado:{' '}
                    {formatBytes(new Blob([editorContent]).size)}
                  </p>
                </div>
              </div>

              {/* Feedback messages */}
              {editorError && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  {editorError}
                </p>
              )}
              {editorSuccess && (
                <p className="rounded-lg border border-green-500/30 bg-green-500/5 px-3 py-2 text-xs text-green-700 dark:text-green-400">
                  {editorSuccess}
                </p>
              )}

              {/* Submit */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitText}
                  disabled={
                    isSubmittingText ||
                    !editorTitle.trim() ||
                    !editorContent.trim()
                  }
                >
                  <UploadCloudIcon className="size-4" />
                  {isSubmittingText ? 'Enviando...' : 'Gerar e enviar arquivo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Right column — RAG Pipeline (always visible) */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline RAG</CardTitle>
            <CardDescription>
              Etapas executadas apos o envio de cada anexo institucional.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3 rounded-xl border p-3">
              <Layers3Icon className="mt-0.5 size-4 text-primary" />
              Classificacao automatica por tipo de documento e tema do TR.
            </div>
            <div className="flex items-start gap-3 rounded-xl border p-3">
              <DatabaseZapIcon className="mt-0.5 size-4 text-primary" />
              Geracao de embeddings e indexacao na base vetorial.
            </div>
            <div className="flex items-start gap-3 rounded-xl border p-3">
              <FolderSyncIcon className="mt-0.5 size-4 text-primary" />
              Disponibilizacao do conteudo para chat e fluxo de analise do TR.
            </div>

            {activeTab === 'editor' && (
              <div className="mt-2 rounded-xl border border-dashed p-3 text-xs leading-relaxed">
                <p className="mb-1 font-medium text-foreground">
                  Sobre o editor de texto
                </p>
                O conteúdo digitado é convertido em um arquivo{' '}
                <code className="rounded bg-muted px-1 font-mono">.txt</code> no
                momento do envio — sem etapas intermediárias. O arquivo percorre
                o mesmo pipeline de ingestão de qualquer outro documento.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Documents list */}
      {files.length > 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Documentos enviados</CardTitle>
            <CardDescription>
              {files.length} arquivo{files.length > 1 ? 's' : ''} na fila para
              processamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-xl border px-3 py-3"
              >
                <span className="text-muted-foreground">
                  {getFileIcon(file.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size)}
                  </p>
                </div>
                <Badge
                  variant={
                    getStatusTone(file.status) === 'destructive'
                      ? 'destructive'
                      : 'outline'
                  }
                  className="text-xs"
                >
                  {getStatusLabel(file.status)}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFile(file)}
                  disabled={file.status === 'uploading'}
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
            <FileIcon className="size-10 opacity-30" />
            <p className="text-sm">Nenhum documento enviado ainda.</p>
          </CardContent>
        </Card>
      )}
    </AdminPageShell>
  );
}
