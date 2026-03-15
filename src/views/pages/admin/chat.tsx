import { INITIAL_MESSAGES } from '@/app/utils/messages';
import { ChatContent } from '@/views/components/chat/chat-content';
import { ChatHeader } from '@/views/components/chat/chat-header';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

import type { AIUIMessage } from '@/types/ai-messages';

export function AdminChat() {
  const { messages, sendMessage, status, stop, setMessages } =
    useChat<AIUIMessage>({
      id: 'chat-01',
      transport: new DefaultChatTransport({
        api: '/api/ai/chat',
      }),
      messages: INITIAL_MESSAGES,
    });

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader setMessages={setMessages} />
      <ChatContent
        messages={messages}
        sendMessage={sendMessage}
        status={status}
        stop={stop}
      />
    </div>
  );
}
