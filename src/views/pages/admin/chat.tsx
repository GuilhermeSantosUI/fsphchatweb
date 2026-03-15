import { INITIAL_MESSAGES } from '@/app/utils/messages';
import { ChatContent } from '@/views/components/chat/chat-content';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

import type { AIUIMessage } from '@/types/ai-messages';

export function AdminChat() {
  const { messages, sendMessage, status, stop } = useChat<AIUIMessage>({
    id: 'chat-01',
    transport: new DefaultChatTransport({
      api: '/api/ai/chat',
    }),
    messages: INITIAL_MESSAGES,
  });

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col overflow-hidden">
      <ChatContent
        messages={messages}
        sendMessage={sendMessage}
        status={status}
        stop={stop}
      />
    </div>
  );
}
