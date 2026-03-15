import {
  ChatSuggestion,
  ChatSuggestions,
  ChatSuggestionsTitle,
} from '@/views/components/ui/chat-suggestions';

const SUGGESTIONS = [
  {
    label: 'Quantos usuarios ativos?',
  },
  {
    label: 'Analisar legislação e normas vigentes',
  },
  {
    label: 'Apoiar atendimento ao cidadão',
  },
];

type Props = {
  agValue: string | null;
  agc: string | null;
  onSuggestionClick: (text: string) => void;
};

export function ChatHomeScreen({ agValue, agc, onSuggestionClick }: Props) {
  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-2 overflow-auto">
      <div className="flex flex-col items-start gap-4 mb-5">
        <div>
          <h2 className="text-base font-bold text-foreground leading-snug">
            Oi, eu sou a Ayla!
          </h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Sua assistente inteligente para gestão pública. Veja algumas coisas
            que posso fazer por você!
          </p>
          {(agValue || agc) && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {agValue && (
                <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  <div className="inline-flex items-center justify-center px-1">
                    {agValue}
                  </div>
                </span>
              )}
              {agc && (
                <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  <div className="inline-flex items-center justify-center px-1">
                    {agc}
                  </div>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <ChatSuggestions className="px-0">
        <ChatSuggestionsTitle>
          Ou experimente uma destas sugestões:
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
