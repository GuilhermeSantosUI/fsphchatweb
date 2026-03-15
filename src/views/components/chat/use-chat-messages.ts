import { useChatInput } from '@/views/components/ui/chat-input';
import { useRef, useState } from 'react';
import type { Message } from './types';

function mockChatApi(question: string, signal?: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve(`Resposta mockada para: "${question}"`);
    }, 1500);

    signal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new Error('Request aborted'));
    });
  });
}

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = async (question: string) => {
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);

      const response = await mockChatApi(
        question,
        abortControllerRef.current.signal,
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          parts: [{ type: 'text', text: response }],
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      if ((error as Error).message !== 'Request aborted') {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stop = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  };

  const { value, onChange, handleSubmit } = useChatInput({
    onSubmit: (parsed) => {
      if (!parsed.content.trim()) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        parts: [{ type: 'text', text: parsed.content }],
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);

      sendMessage(parsed.content);
    },
  });

  const clearMessages = () => {
    stop();
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    value,
    onChange,
    handleSubmit,
    stop,
    clearMessages,
  };
}
