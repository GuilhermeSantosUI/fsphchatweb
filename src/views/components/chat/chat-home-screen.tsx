import {
  ChatSuggestion,
  ChatSuggestions,
  ChatSuggestionsTitle,
} from '@/views/components/ui/chat-suggestions';

const SUGGESTIONS = [
  {
    label: 'Gerar um TR para aquisição de medicamentos hospitalares',
  },
  {
    label: 'Montar justificativa técnica com base em TRs históricos da FSPH',
  },
  {
    label: 'Listar requisitos obrigatórios e critérios de aceitação para o TR',
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
        <div className="w-full rounded-xl border border-primary/20 bg-primary/5 p-4">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            FSPH · TR Inteligente
          </span>
          <h2 className="mt-2 text-base font-bold text-foreground leading-snug">
            Olá, sou a Ayla da Fundação de Saúde Parreiras Horta.
          </h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Eu automatizo a criação de Termos de Referência com RAG, consultando
            base vetorial e históricos reais para garantir Ground Truth e
            reduzir alucinações.
          </p>
          {(agValue || agc) && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {agValue && (
                <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <div className="inline-flex items-center justify-center px-1">
                    {agValue}
                  </div>
                </span>
              )}
              {agc && (
                <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
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
