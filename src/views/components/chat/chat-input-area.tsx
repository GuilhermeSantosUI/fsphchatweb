import { cn } from '@/app/utils/index';
import {
  ChatInput,
  ChatInputEditor,
  ChatInputGroupAddon,
  ChatInputSubmitButton,
} from '@/views/components/ui/chat-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/views/components/ui/select';
import { TextAnimate } from '@/views/components/ui/text-animate';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/views/components/ui/tooltip';
import { PaperclipIcon, XIcon } from '@phosphor-icons/react';
import type { JSONContent } from '@tiptap/react';
import { useEffect, useRef } from 'react';

type Props = {
  value: JSONContent;
  onChange: (value: JSONContent) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onStop: () => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  suggestionText?: string | null;
  onSuggestionAnimationDone?: () => void;
  attachments?: File[];
  onAddAttachments?: (files: FileList | null) => void;
  onRemoveAttachment?: (index: number) => void;
};

export function ChatInputArea({
  value,
  onChange,
  onSubmit,
  isLoading,
  onStop,
  selectedModel,
  setSelectedModel,
  suggestionText,
  onSuggestionAnimationDone,
  attachments = [],
  onAddAttachments,
  onRemoveAttachment,
}: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (suggestionText) {
      const duration = Math.max(1000, suggestionText.length * 35 + 600);
      timerRef.current = setTimeout(() => {
        onSuggestionAnimationDone?.();
      }, duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [suggestionText, onSuggestionAnimationDone]);

  const clearAnimation = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onSuggestionAnimationDone?.();
  };

  return (
    <div className="sticky bottom-0 z-10 shrink-0 bg-background px-3 pb-3 pt-1">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2 px-1">
          {attachments.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-xs border border-primary/20 rounded-lg bg-primary/5 px-2 py-1 group"
            >
              <PaperclipIcon className="w-3 h-3 text-primary shrink-0" />
              <span className="max-w-30 truncate text-foreground/80">
                {file.name}
              </span>
              <span className="text-muted-foreground/50 text-[10px]">
                {(file.size / 1024).toFixed(0)}KB
              </span>
              <button
                type="button"
                onClick={() => onRemoveAttachment?.(i)}
                className="ml-0.5 p-0.5 rounded text-muted-foreground hover:text-destructive transition-colors"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.png,.jpg,.jpeg"
        className="sr-only"
        onChange={(e) => {
          onAddAttachments?.(e.target.files);
          // Limpar o input para permitir re-seleção do mesmo arquivo
          e.target.value = '';
        }}
      />

      <ChatInput
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        isStreaming={isLoading}
        onStop={onStop}
        className="rounded-xl border border-border bg-muted/40 shadow-none"
      >
        <div
          className="relative w-full"
          onKeyDown={clearAnimation}
          onPointerDown={clearAnimation}
        >
          <ChatInputEditor
            placeholder="Pergunte ao Horta o que quiser sobre a criação de TRs na FSPH..."
            className={cn(
              'text-foreground/80 text-sm min-h-16',
              suggestionText && 'opacity-0',
            )}
          />
          {suggestionText && (
            <div className="absolute inset-0 px-4 pt-4 pb-2 pointer-events-none overflow-hidden text-foreground/80 text-sm">
              <TextAnimate
                animation="blurInUp"
                by="character"
                once
                startOnView={false}
                className="leading-normal m-0"
              >
                {suggestionText}
              </TextAnimate>
            </div>
          )}
        </div>

        <ChatInputGroupAddon align="block-end" className="pt-0 gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors',
                  attachments.length > 0 && 'text-primary',
                )}
              >
                <PaperclipIcon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Anexar arquivo</TooltipContent>
          </Tooltip>

          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="ml-auto w-auto border-none shadow-none bg-transparent text-xs text-muted-foreground hover:text-foreground px-1.5 py-1 h-auto gap-1 focus:ring-0 hover:bg-muted rounded-md">
              <SelectValue placeholder="Automático" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="auto">Horta</SelectItem>
              <SelectItem value="horta-pro">Horta Pro</SelectItem>
            </SelectContent>
          </Select>

          <ChatInputSubmitButton className="rounded-full bg-primary text-background hover:bg-foreground/90 h-7 w-7" />
        </ChatInputGroupAddon>
      </ChatInput>
    </div>
  );
}
