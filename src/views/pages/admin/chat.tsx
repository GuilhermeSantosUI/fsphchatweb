import { INITIAL_MESSAGES } from '@/app/utils/messages';
import { AdminPageShell } from '@/views/components/admin/admin-page-shell';
import { Button } from '@/views/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/views/components/ui/card';
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
import { Reasoning } from '@/views/components/ui/reasoning';
import {
  ToolInvocation,
  ToolInvocationContentCollapsible,
  ToolInvocationHeader,
  ToolInvocationName,
  ToolInvocationRawData,
} from '@/views/components/ui/tool-invocation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ArrowRightIcon, Copy, ThumbsUp } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStickToBottomContext } from 'use-stick-to-bottom';

import type { AIUIMessage } from '@/types/ai-messages';

const DEFAULT_CHAT_SUGGESTIONS = [
  'Monte um esboco de TR para aquisicao de medicamentos com base no historico da FSPH.',
  'Quais anexos da base vetorial sustentam este objeto de contratacao?',
  'Resuma riscos juridicos e pontos criticos antes de enviar para analise.',
  'Estruture um TR com cronograma, justificativa e criterios de medicao.',
];

function NoChatMessages({
  onSuggestionClick,
}: {
  onSuggestionClick: (suggestion: string) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-end gap-2 p-2">
      <ChatSuggestions>
        <ChatSuggestionsHeader>
          <ChatSuggestionsTitle>Sugestoes para iniciar:</ChatSuggestionsTitle>
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

type ReturnOfUseChat = ReturnType<typeof useChat<AIUIMessage>>;

function ChatAutoScroll({
  messages,
  status,
  inputValue,
}: {
  messages: ReturnOfUseChat['messages'];
  status: ReturnOfUseChat['status'];
  inputValue: unknown;
}) {
  const { scrollToBottom } = useStickToBottomContext();

  useEffect(() => {
    scrollToBottom();
  }, [messages, status, inputValue, scrollToBottom]);

  return null;
}

export function AdminChat() {
  const { messages, sendMessage, status, stop } = useChat<AIUIMessage>({
    id: 'chat-01',
    transport: new DefaultChatTransport({
      api: '/api/ai/chat',
    }),
    messages: INITIAL_MESSAGES,
  });

  const isLoading = status === 'streaming' || status === 'submitted';
  const { value, onChange, handleSubmit } = useChatInput({
    onSubmit: (parsedValue) => {
      sendMessage({
        role: 'user',
        parts: [{ type: 'text', text: parsedValue.content }],
      });
    },
  });

  return (
    <AdminPageShell
      breadcrumbs={[
        { label: 'Administrador', href: '/admin/visao-geral' },
        { label: 'Geracao assistida' },
      ]}
      title="Assistente de criacao do TR"
      description="Use a base vetorial da FSPH para redigir Termos de Referencia com contexto recuperado dos documentos institucionais e preparar o material para analise posterior."
      badge="IA contextualizada"
      actions={
        <>
          <Button variant="outline" asChild>
            <Link to="/admin/anexos">Atualizar base documental</Link>
          </Button>
          <Button asChild>
            <Link to="/admin/analises">
              Ir para esteira de analise
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </>
      }
      stats={[
        {
          label: 'Contextos disponiveis',
          value: '248',
          description: 'Documentos indexados e prontos para recuperacao.',
          tone: 'primary',
        },
        {
          label: 'Templates ativos',
          value: '6',
          description: 'Modelos orientados por tipo de contratacao.',
          tone: 'default',
        },
        {
          label: 'Ultima sync',
          value: '09:42',
          description: 'Base vetorial atualizada com anexos institucionais.',
          tone: 'success',
        },
        {
          label: 'Saida posterior',
          value: 'Analise',
          description: 'Todo TR concluido segue para a fila de validacao.',
          tone: 'warning',
        },
      ]}
    >
      <Card className="gap-0 overflow-hidden border py-0 shadow-none">
        <CardHeader className="border-b bg-muted/20 py-4">
          <CardTitle>Chat operacional da IA</CardTitle>
          <CardDescription>
            Produza rascunhos, confirme fontes recuperadas e antecipe pontos de
            revisao tecnica e juridica.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-[68vh] flex-col p-0">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <ChatMessageArea className="min-h-0 flex-1">
              <ChatAutoScroll
                messages={messages}
                status={status}
                inputValue={value}
              />
              <ChatMessageAreaContent className="pt-6 pb-32">
                {messages.length === 0 ? (
                  <NoChatMessages
                    onSuggestionClick={(suggestion) => {
                      sendMessage({
                        role: 'user',
                        parts: [{ type: 'text', text: suggestion }],
                      });
                    }}
                  />
                ) : (
                  messages.map((message) => {
                    const userName = message.role === 'user' ? 'Voce' : 'Horta';

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
                        <ChatMessageAvatar>
                          {message.role === 'user' ? (
                            <ChatMessageAvatarUserIcon />
                          ) : (
                            <ChatMessageAvatarAssistantIcon />
                          )}
                        </ChatMessageAvatar>

                        <ChatMessageContainer>
                          <ChatMessageHeader>
                            <ChatMessageAuthor>{userName}</ChatMessageAuthor>
                            <ChatMessageTimestamp createdAt={new Date()} />
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

                              if (part.type === 'reasoning') {
                                return (
                                  <Reasoning
                                    key={`reasoning-${message.id}-${index}`}
                                    content={part.text}
                                    isLastPart={
                                      index === message.parts.length - 1
                                    }
                                  />
                                );
                              }

                              if (part.type.startsWith('tool-')) {
                                if (
                                  !('toolCallId' in part) ||
                                  !('state' in part)
                                ) {
                                  return null;
                                }

                                const toolPart = part as {
                                  type: string;
                                  toolCallId: string;
                                  state:
                                    | 'input-streaming'
                                    | 'input-available'
                                    | 'output-available'
                                    | 'output-error';
                                  input?: unknown;
                                  output?: unknown;
                                  errorText?: string;
                                };

                                const hasInput =
                                  toolPart.input != null &&
                                  toolPart.input !== undefined;
                                const hasOutput =
                                  toolPart.output != null &&
                                  toolPart.output !== undefined;

                                const toolName = toolPart.type.slice(5);
                                return (
                                  <ToolInvocation
                                    key={toolPart.toolCallId}
                                    className="w-full"
                                  >
                                    <ToolInvocationHeader>
                                      <ToolInvocationName
                                        name={toolName}
                                        type={toolPart.state}
                                        isError={
                                          toolPart.state === 'output-error'
                                        }
                                      />
                                    </ToolInvocationHeader>
                                    {(hasInput ||
                                      hasOutput ||
                                      toolPart.errorText) && (
                                      <ToolInvocationContentCollapsible>
                                        {hasInput && (
                                          <ToolInvocationRawData
                                            data={toolPart.input}
                                            title="Arguments"
                                          />
                                        )}
                                        {toolPart.errorText && (
                                          <ToolInvocationRawData
                                            data={{ error: toolPart.errorText }}
                                            title="Error"
                                          />
                                        )}
                                        {hasOutput && (
                                          <ToolInvocationRawData
                                            data={toolPart.output}
                                            title="Result"
                                          />
                                        )}
                                      </ToolInvocationContentCollapsible>
                                    )}
                                  </ToolInvocation>
                                );
                              }

                              return null;
                            })}
                          </ChatMessageContent>
                        </ChatMessageContainer>
                      </ChatMessage>
                    );
                  })
                )}
              </ChatMessageAreaContent>
              <ChatMessageAreaScrollButton alignment="center" />
            </ChatMessageArea>

            <div className="border-t bg-background px-4 py-4">
              <ChatInput
                onSubmit={handleSubmit}
                isStreaming={isLoading}
                onStop={stop}
                className="mx-auto w-full max-w-3xl border-primary/40 bg-transparent focus-within:ring-primary/50"
              >
                <ChatInputEditor
                  value={value}
                  onChange={onChange}
                  placeholder="Peca um TR, solicite revisao ou confira as fontes recuperadas..."
                  className="text-foreground"
                />
                <ChatInputGroupAddon align="block-end">
                  <ChatInputSubmitButton className="ml-auto" />
                </ChatInputGroupAddon>
              </ChatInput>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
