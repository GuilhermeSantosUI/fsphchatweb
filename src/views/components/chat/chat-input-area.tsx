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
import {
  CircleWavyCheckIcon,
  PlusIcon,
  SlidersHorizontalIcon,
} from '@phosphor-icons/react';
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
}: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (suggestionText) {
      // Auto-clear after animation completes (stagger + item duration)
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
    <div className="shrink-0 px-3 pb-3 pt-1">
      <ChatInput
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        isStreaming={isLoading}
        onStop={onStop}
        className="rounded-xl border border-border bg-muted/40 shadow-none"
      >
        <ChatInputGroupAddon align="block-start" className="pb-0">
          <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
            <span className="w-3 h-3 flex items-center justify-center">
              <CircleWavyCheckIcon />
            </span>
            Gestão Pública
          </span>
        </ChatInputGroupAddon>

        <div
          className="relative w-full"
          onKeyDown={clearAnimation}
          onPointerDown={clearAnimation}
        >
          <ChatInputEditor
            placeholder="Pergunte à Ayla sobre gestão pública..."
            className={cn(
              'text-foreground/80 text-sm min-h-[2rem]',
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
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Adicionar contexto</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <SlidersHorizontalIcon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Configurações</TooltipContent>
          </Tooltip>

          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="ml-auto w-auto border-none shadow-none bg-transparent text-xs text-muted-foreground hover:text-foreground px-1.5 py-1 h-auto gap-1 focus:ring-0 hover:bg-muted rounded-md">
              <SelectValue placeholder="Automático" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="auto">Ayla</SelectItem>
              <SelectItem value="ayla-pro">Ayla Pro</SelectItem>
            </SelectContent>
          </Select>

          <ChatInputSubmitButton className="rounded-full bg-foreground text-background hover:bg-foreground/90 h-7 w-7" />
        </ChatInputGroupAddon>
      </ChatInput>
    </div>
  );
}
