import type { AIUIMessage } from '@/types/ai-messages';
import {
  ChatMessage,
  ChatMessageAction,
  ChatMessageActionCopy,
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
import { Reasoning } from '@/views/components/ui/reasoning';
import {
  ToolInvocation,
  ToolInvocationContentCollapsible,
  ToolInvocationHeader,
  ToolInvocationName,
  ToolInvocationRawData,
} from '@/views/components/ui/tool-invocation';
import { FileIcon, ThumbsUpIcon } from '@phosphor-icons/react';

type Props = {
  messages: AIUIMessage[];
  isLoading: boolean;
  attachedFiles?: File[];
};

export function ChatMessages({ messages, isLoading, attachedFiles }: Props) {
  return (
    <ChatMessageArea className="h-full">
      <ChatMessageAreaContent className="py-4 space-y-1">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          const messageText = message.parts
            .filter((p) => p.type === 'text')
            .map((p) => (p as { type: 'text'; text: string }).text)
            .join('\n');

          return (
            <ChatMessage
              key={message.id}
              className={`py-1 px-0 rounded-none hover:bg-transparent ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <ChatMessageActions className={isUser ? 'right-2' : undefined}>
                <ChatMessageActionCopy
                  onClick={() => navigator.clipboard.writeText(messageText)}
                />
                {!isUser && (
                  <ChatMessageAction label="Curtir">
                    <ThumbsUpIcon className="size-4" />
                  </ChatMessageAction>
                )}
              </ChatMessageActions>

              {!isUser && (
                <ChatMessageAvatar className="shrink-0 mt-1 border-border">
                  <ChatMessageAvatarAssistantIcon className="text-foreground" />
                </ChatMessageAvatar>
              )}
              {isUser && (
                <ChatMessageAvatar className="shrink-0 mt-1 border-border">
                  <ChatMessageAvatarUserIcon className="text-foreground" />
                </ChatMessageAvatar>
              )}

              <ChatMessageContainer
                className={`min-w-0 max-w-[82%] gap-0.5 ${isUser ? 'items-end' : 'items-start'}`}
              >
                <ChatMessageHeader
                  className={isUser ? 'flex-row-reverse' : undefined}
                >
                  <ChatMessageAuthor>
                    {isUser ? 'Você' : 'Horta'}
                  </ChatMessageAuthor>
                  <ChatMessageTimestamp createdAt={new Date()} />
                </ChatMessageHeader>

                <ChatMessageContent
                  className={`p-0 rounded-2xl overflow-hidden w-full ${
                    isUser
                      ? 'bg-muted/80 text-foreground rounded-tr-sm'
                      : 'bg-transparent text-foreground rounded-tl-sm'
                  }`}
                >
                  {isUser ? (
                    <div className="px-3 py-2 text-sm wrap-break-word">
                      {message.parts
                        .filter((p) => p.type === 'text')
                        .map((p, i) => (
                          <ChatMessageMarkdown
                            key={i}
                            content={(p as { type: 'text'; text: string }).text}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5 w-full">
                      {message.parts.map((part, index) => {
                        if (part.type === 'text') {
                          return (
                            <div
                              key={`${message.id}-text-${index}`}
                              className="bg-muted/40 rounded-2xl rounded-tl-sm px-3 py-2 text-sm wrap-break-word"
                            >
                              <ChatMessageMarkdown content={part.text} />
                            </div>
                          );
                        }

                        if (part.type === 'reasoning') {
                          return (
                            <Reasoning
                              key={`${message.id}-reasoning-${index}`}
                              content={part.text}
                              isLastPart={index === message.parts.length - 1}
                            />
                          );
                        }

                        if (part.type.startsWith('tool-')) {
                          if (!('toolCallId' in part) || !('state' in part)) {
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

                          const hasInput = toolPart.input != null;
                          const hasOutput = toolPart.output != null;
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
                                  isError={toolPart.state === 'output-error'}
                                />
                              </ToolInvocationHeader>
                              {(hasInput ||
                                hasOutput ||
                                toolPart.errorText) && (
                                <ToolInvocationContentCollapsible>
                                  {hasInput && (
                                    <ToolInvocationRawData
                                      data={toolPart.input}
                                      title="Argumentos"
                                    />
                                  )}
                                  {toolPart.errorText && (
                                    <ToolInvocationRawData
                                      data={{ error: toolPart.errorText }}
                                      title="Erro"
                                    />
                                  )}
                                  {hasOutput && (
                                    <ToolInvocationRawData
                                      data={toolPart.output}
                                      title="Resultado"
                                    />
                                  )}
                                </ToolInvocationContentCollapsible>
                              )}
                            </ToolInvocation>
                          );
                        }

                        return null;
                      })}
                    </div>
                  )}
                </ChatMessageContent>
              </ChatMessageContainer>
            </ChatMessage>
          );
        })}

        {/* Pré-visualização de arquivos pendentes (antes de enviar) */}
        {attachedFiles && attachedFiles.length > 0 && (
          <ChatMessage className="flex-row-reverse py-1 px-0 rounded-none hover:bg-transparent">
            <ChatMessageAvatar className="shrink-0 mt-1 border-border">
              <ChatMessageAvatarUserIcon className="text-foreground" />
            </ChatMessageAvatar>
            <ChatMessageContainer className="min-w-0 max-w-[82%] items-end gap-0.5">
              <div className="flex flex-wrap gap-1.5 justify-end">
                {attachedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs border border-border rounded-lg bg-muted/60 px-2 py-1.5"
                  >
                    <FileIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="max-w-35 truncate text-foreground/80">
                      {file.name}
                    </span>
                  </div>
                ))}
              </div>
            </ChatMessageContainer>
          </ChatMessage>
        )}

        {isLoading && (
          <ChatMessage className="flex gap-2.5 py-1 px-0 rounded-none hover:bg-transparent flex-row">
            <ChatMessageAvatar className="shrink-0 mt-1 border-border">
              <ChatMessageAvatarAssistantIcon className="text-foreground" />
            </ChatMessageAvatar>
            <div className="bg-muted/40 rounded-2xl rounded-tl-sm px-4 py-3">
              <span className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </ChatMessage>
        )}
      </ChatMessageAreaContent>
      <ChatMessageAreaScrollButton alignment="center" />
    </ChatMessageArea>
  );
}
