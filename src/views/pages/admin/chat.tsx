import { INITIAL_MESSAGES } from '@/app/utils/messages';
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
import { Copy, ThumbsUp } from 'lucide-react';
import { useEffect } from 'react';
import { useStickToBottomContext } from 'use-stick-to-bottom';

import type { AIUIMessage } from '@/types/ai-messages';

const DEFAULT_CHAT_SUGGESTIONS = [
  'Hello! Can you help me with a coding question?',
  'Tell me about your capabilities and what you can do',
  'I need help organizing my project management workflow',
  'Can you explain a complex topic in simple terms?',
];

function NoChatMessages({
  onSuggestionClick,
}: {
  onSuggestionClick: (suggestion: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 p-2 justify-end items-center h-full">
      <ChatSuggestions>
        <ChatSuggestionsHeader>
          <ChatSuggestionsTitle>Try these prompts:</ChatSuggestionsTitle>
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
    <div className="flex-1 min-h-0 h-full flex flex-col overflow-hidden">
      <header className="sticky top-0 z-20 border-b bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-sm font-medium">Admin Chat</h1>
        </div>
      </header>

      <ChatMessageArea className="min-h-0">
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
                                      title="Arguments"
                                    />
                                  )}
                                  {toolPart.errorText && (
                                    <ToolInvocationRawData
                                      data={{
                                        error: toolPart.errorText,
                                      }}
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
