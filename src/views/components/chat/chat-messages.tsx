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
import { ThumbsUpIcon } from '@phosphor-icons/react';
import type { Message } from './types';

type Props = {
  messages: Message[];
  isLoading: boolean;
};

export function ChatMessages({ messages, isLoading }: Props) {
  return (
    <ChatMessageArea>
      <ChatMessageAreaContent className="py-4 space-y-1">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          const messageText = message.parts
            .filter((p) => p.type === 'text')
            .map((p) => p.text)
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
                className={`min-w-0 max-w-[78%] gap-0.5 ${isUser ? 'items-end' : 'items-start'}`}
              >
                <ChatMessageHeader
                  className={isUser ? 'flex-row-reverse' : undefined}
                >
                  <ChatMessageAuthor>
                    {isUser ? 'Você' : 'Ayla'}
                  </ChatMessageAuthor>
                  <ChatMessageTimestamp createdAt={message.createdAt} />
                </ChatMessageHeader>
                <ChatMessageContent
                  className={`p-0 rounded-2xl overflow-hidden ${
                    isUser
                      ? 'bg-muted/80 text-foreground rounded-tr-sm'
                      : 'bg-muted/40 text-foreground rounded-tl-sm'
                  }`}
                >
                  <div className="px-3 py-2 text-sm wrap-break-word">
                    {message.parts
                      .filter((part) => part.type === 'text')
                      .map((part, i) => (
                        <ChatMessageMarkdown key={i} content={part.text} />
                      ))}
                  </div>
                </ChatMessageContent>
              </ChatMessageContainer>
            </ChatMessage>
          );
        })}

        {isLoading && (
          <ChatMessage className="flex gap-2.5 py-1 px-0 rounded-none hover:bg-transparent flex-row">
            <ChatMessageAvatar className="shrink-0 mt-1 border-border">
              <ChatMessageAvatarAssistantIcon className="text-foreground" />
            </ChatMessageAvatar>
            <div className="bg-muted/40 rounded-2xl rounded-tl-sm px-4 py-3">
              <span className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </ChatMessage>
        )}
      </ChatMessageAreaContent>
      <ChatMessageAreaScrollButton alignment="center" />
    </ChatMessageArea>
  );
}
