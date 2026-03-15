import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/views/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/views/components/ui/tooltip';
import {
  CaretDoubleRightIcon,
  MinusIcon,
  PencilLineIcon,
} from '@phosphor-icons/react';

type Props = {
  selectedChat: string;
  setSelectedChat: (value: string) => void;
  viewMode: 'floating' | 'sidebar';
  setViewMode: (value: 'floating' | 'sidebar') => void;
  onNewChat: () => void;
};

export function ChatHeader({
  selectedChat,
  setSelectedChat,
  viewMode,
  setViewMode,
  onNewChat,
}: Props) {
  return (
    <div className="flex items-center px-3 py-2.5 shrink-0 border-b border-primary/15 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <Select value={selectedChat} onValueChange={setSelectedChat}>
        <SelectTrigger className="w-auto border-none shadow-none bg-transparent hover:bg-primary/10 text-sm font-medium text-foreground px-2 py-1 h-auto gap-1.5 focus:ring-0">
          <SelectValue placeholder="Novo TR com Ayla" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">Novo TR com Ayla</SelectItem>
          <SelectItem value="chat-1">TR anterior 1</SelectItem>
          <SelectItem value="chat-2">TR anterior 2</SelectItem>
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onNewChat}
              className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <PencilLineIcon className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Novo chat</TooltipContent>
        </Tooltip>

        <Select
          value={viewMode}
          onValueChange={(v: 'floating' | 'sidebar') => {
            setViewMode(v);
            window.parent.postMessage({ type: 'ag-view-mode', mode: v }, '*');
          }}
        >
          <SelectTrigger className="w-auto border-none shadow-none bg-transparent hover:bg-primary/10 text-xs text-muted-foreground hover:text-primary px-1.5 py-1 h-auto gap-1 focus:ring-0 rounded-md">
            <SelectValue placeholder="Alterar visualização" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="floating">Flutuante</SelectItem>
            <SelectItem value="sidebar">Sidebar</SelectItem>
          </SelectContent>
        </Select>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => {
                window.parent.postMessage({ type: 'ag-minimize' }, '*');
              }}
              className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              {viewMode === 'sidebar' ? (
                <CaretDoubleRightIcon className="w-4 h-4" />
              ) : (
                <MinusIcon className="w-4 h-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {viewMode === 'sidebar' ? 'Recolher sidebar' : 'Minimizar'}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
