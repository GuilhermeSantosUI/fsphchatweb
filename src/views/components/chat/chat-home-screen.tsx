import {
  ChatSuggestion,
  ChatSuggestions,
  ChatSuggestionsTitle,
} from '@/views/components/ui/chat-suggestions';

import logoImg from '@/assets/fsph-logo.png';

const SUGGESTIONS = [
  {
    label: 'Gerar um TR para aquisição de medicamentos hospitalares',
  },
  {
    label: 'Montar justificativa técnica com base em TRs históricos da FSPH',
  },
];

type Props = {
  onSuggestionClick: (text: string) => void;
};

export function ChatHomeScreen({ onSuggestionClick }: Props) {
  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-2 overflow-auto">
      <div className="flex flex-col items-start gap-4 mb-5">
        <div className="flex aspect-square size-16 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
          <img
            src={logoImg}
            alt="FSPH Logo"
            className="w-9 h-9 relative -left-0.5"
          />
        </div>
      </div>

      <ChatSuggestions className="px-0">
        <ChatSuggestionsTitle>
          Comece por uma solicitação orientada à criação de TR:
        </ChatSuggestionsTitle>
        {SUGGESTIONS.map((s) => (
          <ChatSuggestion
            key={s.label}
            onClick={() => onSuggestionClick(s.label)}
          >
            {s.label}
          </ChatSuggestion>
        ))}
      </ChatSuggestions>
    </div>
  );
}
