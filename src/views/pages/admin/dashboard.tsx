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
  Trash2Icon,
  UploadCloudIcon,
} from 'lucide-react';
import { useRef, useState } from 'react';

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  file: File;
  status: 'pending' | 'uploading' | 'uploaded' | 'indexed' | 'error';
  errorMessage?: string;
};

const ACCEPTED_TYPES = '.pdf,.docx,.doc,.txt,.xlsx,.xls,.odt,.csv,.rtf,.md';

const ACCEPTED_LABELS = ['PDF', 'DOCX', 'TXT', 'XLSX', 'ODT', 'CSV', 'RTF'];

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
  const [isIndexing, setIsIndexing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Falha ao processar a solicitacao.';
  };

  const triggerIndexing = async () => {
    setIsIndexing(true);
    setSyncError(null);

    try {
      await adminRoute.indexDocuments(false);
      setFiles((prev) =>
        prev.map((file) =>
          file.status === 'uploaded' ? { ...file, status: 'indexed' } : file,
        ),
      );
    } catch (error) {
      setSyncError(getErrorMessage(error));
    } finally {
      setIsIndexing(false);
    }
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
        await adminRoute.uploadDocuments({ files: [file.file] });

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
    await triggerIndexing();
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

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

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
            variant="outline"
            onClick={triggerIndexing}
            disabled={isUploading || isIndexing || files.length === 0}
          >
            <FolderSyncIcon className="size-4" />
            {isIndexing ? 'Sincronizando...' : 'Sincronizar base'}
          </Button>
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
          value: '248',
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
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
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
                  PDF, DOCX, TXT, XLSX, ODT e arquivos complementares de ate 20
                  MB
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
          </CardContent>
        </Card>
      </div>

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
                  onClick={() => removeFile(file.id)}
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
