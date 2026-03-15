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
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  Trash2Icon,
  UploadCloudIcon,
} from 'lucide-react';
import { useRef, useState } from 'react';

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
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
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles: UploadedFile[] = Array.from(incoming).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      uploadedAt: new Date(),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Anexos de TR</CardTitle>
          <CardDescription>
            Envie documentos para alimentar a base de conhecimento da IA.
            Formatos aceitos: PDF, DOCX, TXT, XLSX, ODT e outros.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 transition-colors ${
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
                PDF, DOCX, TXT, XLSX, ODT — até 20 MB por arquivo
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
            onChange={(e) => addFiles(e.target.files)}
          />
        </CardContent>
      </Card>

      {files.length > 0 ? (
        <Card>
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
                className="flex items-center gap-3 rounded-md border px-3 py-2"
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
                  variant="outline"
                  className="border-primary/30 bg-primary/5 text-xs text-primary"
                >
                  Aguardando
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFile(file.id)}
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
          <FileIcon className="size-10 opacity-30" />
          <p className="text-sm">Nenhum documento enviado ainda.</p>
        </div>
      )}
    </div>
  );
}
