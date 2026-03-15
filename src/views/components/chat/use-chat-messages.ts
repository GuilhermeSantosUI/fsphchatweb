import type { AIUIMessage } from '@/types/ai-messages';
import { useChatInput } from '@/views/components/ui/chat-input';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export function useChatMessages() {
  const [attachments, setAttachments] = useState<File[]>([]);

  const { messages, sendMessage, status, stop, setMessages } =
    useChat<AIUIMessage>({
      id: 'widget-chat',
      transport: new DefaultChatTransport({
        api: '/api/ai/chat',
      }),
    });

  const isLoading = status === 'streaming' || status === 'submitted';

  const { value, onChange, handleSubmit } = useChatInput({
    onSubmit: (parsed) => {
      if (!parsed.content.trim() && attachments.length === 0) return;
      sendMessage({
        role: 'user',
        parts: [{ type: 'text', text: parsed.content }],
      });
      setAttachments([]);
    },
  });

  const clearMessages = () => {
    stop();
    setMessages([]);
  };

  const addAttachments = (files: FileList | null) => {
    if (!files) return;
    setAttachments((prev) => [...prev, ...Array.from(files)]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    messages,
    isLoading,
    value,
    onChange,
    handleSubmit,
    stop,
    clearMessages,
    attachments,
    addAttachments,
    removeAttachment,
  };
}
