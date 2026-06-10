import { chatRoute } from '@/app/services/chat';
import { cn } from '@/app/utils';
import AnimatedShinyText from '@/views/components/ui/animated-shiny-text';
import { Button } from '@/views/components/ui/button';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/views/components/ui/dropdown-menu';
import { MarkdownContent } from '@/views/components/ui/markdown-content';
import { TextAnimate } from '@/views/components/ui/text-animate';
import html2pdf from 'html2pdf.js';
import {
  ChevronDown,
  Copy,
  Download,
  FileArchive,
  FileCode,
  FileText,
  FileType2,
  ThumbsUp,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useStickToBottomContext } from 'use-stick-to-bottom';
import { useParams, useNavigate } from 'react-router-dom';

const DEFAULT_CHAT_SUGGESTIONS = [
  'Preciso gerar um Termo de Referência para contratação de serviço de TI.',
  'Quero um TR para aquisição de bens com critérios de aceitação claros.',
  'Monte um TR para evento institucional de curta duração.',
  'Me ajude a melhorar a justificativa técnica e os critérios de pagamento.',
];

const DEFAULT_TOP_K = 6;

const ASSISTANT_LOADING_MESSAGES = [
  'Analisando o contexto documental da FSPH...',
  'Estruturando o Termo de Referência com base nas fontes recuperadas...',
  'Consolidando objeto, justificativa e critérios de aceitação...',
  'Refinando a minuta para revisão técnica e jurídica...',
];

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
  const { conversation_id } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<AdminChatMessage[]>([
    WELCOME_MESSAGE,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionText, setSuggestionText] = useState<string | null>(null);
  const [assistantLoadingMessage, setAssistantLoadingMessage] = useState(
    ASSISTANT_LOADING_MESSAGES[0],
  );

  // Load conversation state on mount
  useEffect(() => {
    async function loadConversation() {
      if (!conversation_id) return;
      
      try {
        setIsLoading(true);
        const state = await chatRoute.getConversationState(conversation_id);
        
        // Map backend messages to AdminChatMessage
        // Note: adjust this logic based on your actual backend message structure
        if (state.messages && Array.isArray(state.messages)) {
          const loadedMessages: AdminChatMessage[] = state.messages.map((m: any) => ({
            id: m.id || crypto.randomUUID(),
            role: m.role || 'user',
            parts: [{ 
              type: 'text', 
              text: (m.type === 'error' && m.message) 
                ? (m.message === 'error' ? `DEBUG HISTORY: \n\`\`\`json\n${JSON.stringify(m, null, 2)}\n\`\`\`` : m.message) 
                : (m.html && m.html !== 'error' ? m.html : (m.text && m.text !== 'error' ? m.text : m.content || m.message || `DEBUG HISTORY UNKNOWN: \n\`\`\`json\n${JSON.stringify(m, null, 2)}\n\`\`\``)) 
            }],
            createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
          }));
          
          if (loadedMessages.length > 0) {
            setMessages(loadedMessages);
          }
        }
      } catch (err) {
        console.error('Failed to load conversation state', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadConversation();
  }, [conversation_id]);

  const getRandomLoadingMessage = (current?: string) => {
    const options = ASSISTANT_LOADING_MESSAGES.filter(
      (message) => message !== current,
    );

    if (options.length === 0) {
      return ASSISTANT_LOADING_MESSAGES[0];
    }

    return options[Math.floor(Math.random() * options.length)];
  };

  function handleEditorChange(event: Parameters<typeof onChange>[0]) {
    clearSuggestionAnimation();
    onChange(event);
  }

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    setAssistantLoadingMessage((current) => getRandomLoadingMessage(current));

    const intervalId = window.setInterval(() => {
      setAssistantLoadingMessage((current) => getRandomLoadingMessage(current));
    }, 1800);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isLoading]);

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

      setSuggestionText(null);

      setMessages((previous) => [...previous, createMessage('user', question)]);
      setIsLoading(true);

      try {
        const response = await chatRoute.sendMessage({
          question: question,
          conversation_id: conversation_id,
        });

        // Use returned conversation_id to update URL if needed
        if (response.conversation_id && response.conversation_id !== conversation_id) {
          navigate(`/admin/chat/${response.conversation_id}`, { replace: true });
        }

        let assistantText = '';
        
        if (response.type === 'error' && response.message) {
          assistantText = response.message === 'error' ? `DEBUG API RESPONSE: \n\`\`\`json\n${JSON.stringify(response, null, 2)}\n\`\`\`` : String(response.message);
        } else if (typeof response.html === 'string' && response.html.trim().length > 0 && response.html.trim() !== 'error') {
          assistantText = response.html;
        } else if (typeof response.text === 'string' && response.text.trim().length > 0 && response.text.trim() !== 'error') {
          assistantText = response.text;
        } else if (response.message) {
          assistantText = response.message === 'error' ? `DEBUG API RESPONSE: \n\`\`\`json\n${JSON.stringify(response, null, 2)}\n\`\`\`` : String(response.message);
        } else {
          assistantText = `DEBUG UNKNOWN PAYLOAD: \n\`\`\`json\n${JSON.stringify(response, null, 2)}\n\`\`\``;
        }
              
        setMessages((previous) => [
          ...previous,
          createMessage('assistant', assistantText),
        ]);
      } catch (err: any) {
        setMessages((previous) => [
          ...previous,
          createMessage(
            'assistant',
            `Ocorreu um erro ao consultar a API. Detalhes: ${err?.message}\n\nDEBUG API ERROR: \n\`\`\`json\n${JSON.stringify(err?.response?.data || err, null, 2)}\n\`\`\``,
          ),
        ]);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const textToEditorValue = (text: string) => {
    if (!text) {
      return { type: 'doc', content: [] };
    }

    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text }],
        },
      ],
    };
  };

  const clearSuggestionAnimation = () => {
    setSuggestionText(null);
  };

  const animateSuggestionInInput = (suggestion: string) => {
    clearSuggestionAnimation();
    onChange(textToEditorValue(suggestion));
    setSuggestionText(suggestion);
  };

  const handleExport = async (
    content: string,
    format: 'html' | 'txt' | 'pdf' | 'docx',
  ) => {
    // Nome base para o arquivo
    const filename = `documento_gerado_${new Date().getTime()}`;

    // Função auxiliar para forçar o download no navegador
    const downloadFile = (blob: Blob, extension: string) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    switch (format) {
      case 'html': {
        // Exportação HTML: Simplesmente pega o conteúdo e cria um Blob
        const htmlBlob = new Blob([content], {
          type: 'text/html;charset=utf-8',
        });
        downloadFile(htmlBlob, 'html');
        break;
      }

      case 'txt': {
        // Exportação TXT: Precisamos remover as tags HTML para não poluir o texto
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const textContent = tempDiv.innerText || tempDiv.textContent || '';
        const txtBlob = new Blob([textContent], {
          type: 'text/plain;charset=utf-8',
        });
        downloadFile(txtBlob, 'txt');
        break;
      }

      case 'docx': {
        // Exportação DOCX (Truque sem dependências):
        // Adicionamos cabeçalhos XML específicos que o Word reconhece.
        const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Documento</title></head><body>`;
        const footer = '</body></html>';

        const sourceHTML = header + content + footer;
        // O '\ufeff' é o BOM (Byte Order Mark) para garantir que o Word leia os acentos corretamente
        const docxBlob = new Blob(['\ufeff', sourceHTML], {
          type: 'application/msword',
        });
        downloadFile(docxBlob, 'doc');
        break;
      }

      case 'pdf': {
        // Exportação PDF: Usamos o html2pdf.js
        // Criamos um elemento temporário com a mesma estilização do seu componente
        // para que o PDF saia com a mesma cara da tela.
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = content;
        tempContainer.style.fontFamily = "'Georgia', 'Times New Roman', serif";
        tempContainer.style.fontSize = '12pt';
        tempContainer.style.lineHeight = '1.5';
        tempContainer.style.padding = '20px';
        tempContainer.style.color = '#000';

        const opt = {
          margin: 15,
          filename: `${filename}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        // O html2pdf cuida do download automaticamente
        await html2pdf().set(opt).from(tempContainer).save();
        break;
      }
    }
  };

  const isHtml = (content: string): boolean => {
    const htmlTagRegex = /<[a-z][\s\S]*>/i;
    return htmlTagRegex.test(content);
  };

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
                  <ChatMessageAction label="Copiar">
                    <Copy className="size-4" />
                  </ChatMessageAction>
                  <ChatMessageAction label="Gostei">
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
                          <div
                            key={`${message.id}-text-${index}`}
                            className="w-full space-y-3"
                          >
                            {isHtml(part.text) &&
                            message.role === 'assistant' ? (
                              <div className="flex gap-2 justify-end mb-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="font-medium"
                                    >
                                      <Download className="size-4 mr-2" />
                                      Exportar Documento
                                      <ChevronDown className="size-4 ml-2 opacity-50" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                  >
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleExport(part.text, 'html')
                                      }
                                    >
                                      <FileCode className="size-4 mr-2 text-blue-500" />
                                      Como HTML
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleExport(part.text, 'txt')
                                      }
                                    >
                                      <FileText className="size-4 mr-2 text-gray-500" />
                                      Como Texto (.txt)
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleExport(part.text, 'pdf')
                                      }
                                    >
                                      <FileType2 className="size-4 mr-2 text-red-500" />
                                      Como PDF (.pdf)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleExport(part.text, 'docx')
                                      }
                                    >
                                      <FileArchive className="size-4 mr-2 text-blue-600" />
                                      Como Word (.docx)
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            ) : null}
                            <MarkdownContent content={part.text} />
                          </div>
                        );
                      }

                      return null;
                    })}
                  </ChatMessageContent>
                </ChatMessageContainer>
              </ChatMessage>
            );
          })}

          {isLoading ? (
            <ChatMessage key="assistant-loading">
              <ChatMessageActions>
                <ChatMessageAction label="Copiar">
                  <Copy className="size-4" />
                </ChatMessageAction>
                <ChatMessageAction label="Gostei">
                  <ThumbsUp className="size-4" />
                </ChatMessageAction>
              </ChatMessageActions>
              <ChatMessageAvatar className="flex items-center justify-center bg-primary">
                <ChatMessageAvatarAssistantIcon />
              </ChatMessageAvatar>

              <ChatMessageContainer>
                <ChatMessageHeader>
                  <ChatMessageAuthor>Horta</ChatMessageAuthor>
                  <ChatMessageTimestamp createdAt={new Date()} />
                </ChatMessageHeader>

                <ChatMessageContent>
                  <AnimatedShinyText>
                    {assistantLoadingMessage}
                  </AnimatedShinyText>
                </ChatMessageContent>
              </ChatMessageContainer>
            </ChatMessage>
          ) : null}

          {hasOnlyWelcomeMessage ? (
            <NoChatMessages
              onSuggestionClick={(suggestion) => {
                animateSuggestionInInput(suggestion);
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
          <div
            className="relative w-full"
            onKeyDown={clearSuggestionAnimation}
            onPointerDown={clearSuggestionAnimation}
          >
            <ChatInputEditor
              value={value}
              onChange={handleEditorChange}
              placeholder="Pergunte algo ou envie uma mensagem..."
              className={cn('text-foreground', suggestionText && 'opacity-0')}
            />
            {suggestionText ? (
              <div className="absolute inset-0 px-4 pt-4 pb-2 pointer-events-none overflow-hidden text-foreground">
                <TextAnimate
                  animation="blurInUp"
                  by="character"
                  once
                  startOnView={false}
                  className="leading-normal m-0"
                >
                  {suggestionText}
                </TextAnimate>
              </div>
            ) : null}
          </div>
          <ChatInputGroupAddon align="block-end">
            <ChatInputSubmitButton className="ml-auto" />
          </ChatInputGroupAddon>
        </ChatInput>
        <p className="mt-2 text-center text-xs text-muted-foreground/70">
          A inteligência artificial pode cometer erros ou "alucinar"
          informações. Verifique e analise os dados cuidadosamente antes de
          utilizá-los.
        </p>
      </div>
    </div>
  );
}
