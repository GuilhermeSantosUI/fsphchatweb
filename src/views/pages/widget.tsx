import { TooltipProvider } from '@/views/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { ChatHeader } from '../components/chat/chat-header copy';
import { ChatHomeScreen } from '../components/chat/chat-home-screen';
import { ChatInputArea } from '../components/chat/chat-input-area';
import { ChatMessages } from '../components/chat/chat-messages';
import { useChatMessages } from '../components/chat/use-chat-messages';

export function Widget() {
  const [viewMode, setViewMode] = useState<'floating' | 'sidebar'>('floating');
  const [selectedChat, setSelectedChat] = useState('new');
  const [selectedModel, setSelectedModel] = useState('auto');
  const [suggestionText, setSuggestionText] = useState<string | null>(null);

  const {
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
  } = useChatMessages();

  const isHomeScreen = messages.length === 0;

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'ag-exited-sidebar') {
        setViewMode('floating');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <TooltipProvider delayDuration={400}>
      <div className="flex flex-col h-full w-full min-h-0 bg-background overflow-hidden">
        <ChatHeader
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onNewChat={clearMessages}
        />

        <div className="flex-1 overflow-hidden min-h-0">
          {isHomeScreen ? (
            <ChatHomeScreen
              onSuggestionClick={(text) => {
                setSuggestionText(text);
                onChange({
                  type: 'doc',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text }],
                    },
                  ],
                });
              }}
            />
          ) : (
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              attachedFiles={attachments}
            />
          )}
        </div>

        <ChatInputArea
          value={value}
          onChange={onChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onStop={stop}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          suggestionText={suggestionText}
          onSuggestionAnimationDone={() => setSuggestionText(null)}
          attachments={attachments}
          onAddAttachments={addAttachments}
          onRemoveAttachment={removeAttachment}
        />
      </div>
    </TooltipProvider>
  );
}
