import { trApiService } from '@/app/services';
import {
  ChatInput,
  ChatInputEditor,
  ChatInputGroupAddon,
  ChatInputSubmitButton,
  useChatInput,
} from '@/views/components/ui/chat-input';
import {
  ChatMessage,
  ChatMessageAction,
  ChatMessageActions,
  ChatMessageAuthor,
  ChatMessageAvatar,
  ChatMessageAvatarAssistantIcon,
  ChatMessageAvatarUserIcon,
  ChatMessageContainer,
  ChatMessageContent,
  ChatMessageHeader,
  ChatMessageMarkdown,
  ChatMessageTimestamp,
} from '@/views/components/ui/chat-message';
import {
  ChatMessageArea,
  ChatMessageAreaContent,
  ChatMessageAreaScrollButton,
} from '@/views/components/ui/chat-message-area';
import {
  ChatSuggestion,
  ChatSuggestions,
  ChatSuggestionsContent,
  ChatSuggestionsHeader,
  ChatSuggestionsTitle,
} from '@/views/components/ui/chat-suggestions';
import { Copy, ThumbsUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useStickToBottomContext } from 'use-stick-to-bottom';

const DEFAULT_CHAT_SUGGESTIONS = [
  'Preciso gerar um Termo de Referência para contratação de serviço de TI.',
  'Quero um TR para aquisição de bens com critérios de aceitação claros.',
  'Monte um TR para evento institucional de curta duração.',
  'Me ajude a melhorar a justificativa técnica e os critérios de pagamento.',
];

const DEFAULT_TOP_K = 6;

type AdminChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  parts: Array<{ type: 'text'; text: string }>;
  createdAt: Date;
};

const WELCOME_MESSAGE: AdminChatMessage = {
  id: 'welcome-message',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: 'Olá! Sou o assistente de TR da FSPH. Descreva sua necessidade de contratação e eu gero uma minuta inicial para revisão.',
    },
  ],
  createdAt: new Date(),
};

function NoChatMessages({
  onSuggestionClick,
}: {
  onSuggestionClick: (suggestion: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 p-2 justify-end items-center h-full">
      <ChatSuggestions>
        <ChatSuggestionsHeader>
          <ChatSuggestionsTitle>Sugestões para começar:</ChatSuggestionsTitle>
        </ChatSuggestionsHeader>
        <ChatSuggestionsContent>
          {DEFAULT_CHAT_SUGGESTIONS.map((suggestion) => (
            <ChatSuggestion
              key={suggestion}
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </ChatSuggestion>
          ))}
        </ChatSuggestionsContent>
      </ChatSuggestions>
    </div>
  );
}

function ChatAutoScroll({
  messages,
  isLoading,
  inputValue,
}: {
  messages: AdminChatMessage[];
  isLoading: boolean;
  inputValue: unknown;
}) {
  const { scrollToBottom } = useStickToBottomContext();

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, inputValue, scrollToBottom]);

  return null;
}

export function AdminChat() {
  const [messages, setMessages] = useState<AdminChatMessage[]>([
    WELCOME_MESSAGE,
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const stop = () => {
    setIsLoading(false);
  };

  const createMessage = (
    role: AdminChatMessage['role'],
    text: string,
  ): AdminChatMessage => ({
    id: crypto.randomUUID(),
    role,
    parts: [{ type: 'text', text }],
    createdAt: new Date(),
  });

  const hasOnlyWelcomeMessage = useMemo(
    () =>
      messages.length === 1 &&
      messages[0]?.id === WELCOME_MESSAGE.id &&
      messages[0]?.role === 'assistant',
    [messages],
  );

  const { value, onChange, handleSubmit } = useChatInput({
    onSubmit: async (parsedValue) => {
      const question = parsedValue.content.trim();

      if (!question || isLoading) {
        return;
      }

      setMessages((previous) => [...previous, createMessage('user', question)]);
      setIsLoading(true);

      try {
        const response = await trApiService.generateTr({
          question,
          top_k: DEFAULT_TOP_K,
        });

        const assistantText =
          typeof response.html === 'string' && response.html.trim().length > 0
            ? response.html
            : 'Não consegui gerar o TR neste momento. Tente novamente com mais detalhes da contratação.';

        setMessages((previous) => [
          ...previous,
          createMessage('assistant', assistantText),
        ]);
      } catch {
        setMessages((previous) => [
          ...previous,
          createMessage(
            'assistant',
            'Ocorreu um erro ao consultar a API de geração de TR. Verifique a configuração de `VITE_API_BASE_URL` e tente novamente.',
          ),
        ]);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col overflow-hidden">
      <header className="sticky top-0 z-20 border-b bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-sm font-medium">Admin Chat</h1>
        </div>
      </header>

      <ChatMessageArea className="min-h-0">
        <ChatAutoScroll
          messages={messages}
          isLoading={isLoading}
          inputValue={value}
        />
        <ChatMessageAreaContent className="pt-6 pb-32">
          {messages.map((message) => {
            const userName = message.role === 'user' ? 'Você' : 'Horta';
            return (
              <ChatMessage key={message.id}>
                <ChatMessageActions>
                  <ChatMessageAction label="Copy">
                    <Copy className="size-4" />
                  </ChatMessageAction>
                  <ChatMessageAction label="Like">
                    <ThumbsUp className="size-4" />
                  </ChatMessageAction>
                </ChatMessageActions>
                <ChatMessageAvatar
                  className={`flex items-center justify-center ${message.role !== 'user' && 'bg-primary'}`}
                >
                  {message.role === 'user' ? (
                    <ChatMessageAvatarUserIcon />
                  ) : (
                    <ChatMessageAvatarAssistantIcon />
                  )}
                </ChatMessageAvatar>

                <ChatMessageContainer>
                  <ChatMessageHeader>
                    <ChatMessageAuthor>{userName}</ChatMessageAuthor>
                    <ChatMessageTimestamp createdAt={message.createdAt} />
                  </ChatMessageHeader>

                  <ChatMessageContent>
                    {message.parts.map((part, index) => {
                      if (part.type === 'text') {
                        return (
                          <ChatMessageMarkdown
                            key={`${message.id}-text-${index}`}
                            content={part.text}
                          />
                        );
                      }

                      return null;
                    })}
                  </ChatMessageContent>
                </ChatMessageContainer>
              </ChatMessage>
            );
          })}

          {hasOnlyWelcomeMessage ? (
            <NoChatMessages
              onSuggestionClick={(suggestion) => {
                onChange({
                  target: {
                    value: suggestion,
                  },
                } as unknown as Parameters<typeof onChange>[0]);
              }}
            />
          ) : null}
        </ChatMessageAreaContent>
        <ChatMessageAreaScrollButton alignment="center" />
      </ChatMessageArea>

      <div className="sticky bottom-0 z-20 px-4 pb-4">
        <ChatInput
          onSubmit={handleSubmit}
          isStreaming={isLoading}
          onStop={stop}
          className="mx-auto w-full bg-transparent max-w-3xl border-primary/40 focus-within:ring-primary/50"
        >
          <ChatInputEditor
            value={value}
            onChange={onChange}
            placeholder="Pergunte algo ou envie uma mensagem..."
            className="text-foreground"
          />
          <ChatInputGroupAddon align="block-end">
            <ChatInputSubmitButton className="ml-auto" />
          </ChatInputGroupAddon>
        </ChatInput>
      </div>
    </div>
  );
}
