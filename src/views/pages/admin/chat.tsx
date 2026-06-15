import type { DocumentState } from '@/app/models/chat';
import { chatRoute } from '@/app/services/chat';
import { createTR } from '@/app/services/tr';
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
  ChatMessageActionCopy,
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
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  ChevronDown,
  CheckCircle2,
  Download,
  FileArchive,
  FileCode,
  File as FileIcon,
  FileText,
  FileType2,
  Loader2,
  SendToBack,
  ThumbsUp,
  X
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStickToBottomContext } from 'use-stick-to-bottom';

const DEFAULT_CHAT_SUGGESTIONS = [
  'Preciso gerar um Termo de Referência para contratação de serviço de TI.',
  'Quero um TR para aquisição de bens com critérios de aceitação claros.',
  'Monte um TR para evento institucional de curta duração.',
  'Me ajude a melhorar a justificativa técnica e os critérios de pagamento.',
];


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
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DocumentState | null>(null);
  const [isDocumentPanelOpen, setIsDocumentPanelOpen] = useState(false);
  const [isSendingToReview, setIsSendingToReview] = useState(false);
  const [sendToReviewStatus, setSendToReviewStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [sendToReviewError, setSendToReviewError] = useState<string | null>(null);

  const handleSendToReview = useCallback(async () => {
    if (!conversation_id || isSendingToReview) return;
    setIsSendingToReview(true);
    setSendToReviewStatus('idle');
    setSendToReviewError(null);
    try {
      await createTR({ conversation_id });
      setSendToReviewStatus('success');
    } catch (err: any) {
      const detail = err?.response?.data?.detail || err?.message || 'Erro desconhecido.';
      setSendToReviewError(detail);
      setSendToReviewStatus('error');
    } finally {
      setIsSendingToReview(false);
    }
  }, [conversation_id, isSendingToReview]);



  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we are leaving the main container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validExtensions = ['.pdf', '.txt', '.docx'];

    const validFiles = files.filter(file => {
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      return validExtensions.includes(extension);
    });

    if (validFiles.length > 0) {
      setAttachments(prev => [...prev, ...validFiles]);
    } else {
      // Ignore invalid files
    }
  }, []);

  const removeAttachment = (indexToRemove: number) => {
    setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Load conversation state on mount / reset when conversation changes
  useEffect(() => {
    // Always reset UI state when conversation_id changes
    setCurrentDocument(null);
    setIsDocumentPanelOpen(false);
    setSendToReviewStatus('idle');
    setSendToReviewError(null);
    setAttachments([]);
    setIsLoading(false);

    // No conversation selected → blank slate
    if (!conversation_id) {
      setMessages([WELCOME_MESSAGE]);
      return;
    }

    async function loadConversation() {
      try {
        setIsLoading(true);
        const state = await chatRoute.getChatById(conversation_id!);

        // Load current_document if it exists
        if (state.current_document) {
          setCurrentDocument(state.current_document);
          setIsDocumentPanelOpen(true);
        }

        // Map backend messages to AdminChatMessage
        if (state.messages && Array.isArray(state.messages)) {
          const loadedMessages: AdminChatMessage[] = state.messages.map((m: any) => ({
            id: m.id || crypto.randomUUID(),
            role: m.role || 'user',
            parts: [{
              type: 'text',
              text: (m.type === 'error' && m.message)
                ? (m.message === 'error' ? `Ocorreu um erro no histórico.` : m.message)
                : (m.html && m.html !== 'error' ? m.html : (m.text && m.text !== 'error' ? m.text : m.content || m.message || `Ocorreu um erro desconhecido no histórico.`))
            }],
            createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
          }));

          setMessages(loadedMessages.length > 0 ? loadedMessages : [WELCOME_MESSAGE]);
        } else {
          setMessages([WELCOME_MESSAGE]);
        }
      } catch (err) {
        console.error('Failed to load conversation state', err);
        setMessages([WELCOME_MESSAGE]);
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

      if ((!question && attachments.length === 0) || isLoading) {
        return;
      }

      setSuggestionText(null);

      const currentAttachments = [...attachments];
      setAttachments([]);

      setMessages((previous) => [...previous, createMessage('user', question || 'Enviei anexos para o contexto.')]);
      setIsLoading(true);

      try {
        const response = await chatRoute.sendMessage({
          question: question,
          conversation_id: conversation_id,
        });

        const newConversationId = response.conversation_id || conversation_id;

        if (newConversationId && currentAttachments.length > 0) {
          for (const file of currentAttachments) {
            await chatRoute.uploadContext(newConversationId, file);
          }
        }

        if (newConversationId && newConversationId !== conversation_id) {
          navigate(`/admin/chat/${newConversationId}`, { replace: true });
        }

        let assistantText = '';

        switch (response.type) {
          case 'error':
            assistantText = response.message === 'error' ? `Ocorreu um erro ao processar a resposta da API.` : String(response.message);
            break;
          case 'tr':
          case 'tr_update': {
            const docHtml = response.html && response.html.trim() !== 'error' ? response.html : '';
            // Update the document panel with the new TR
            if (docHtml) {
              const newDoc: DocumentState = {
                type: 'tr',
                document_title: ('document_title' in response ? response.document_title : undefined) || 'TERMO DE REFERÊNCIA',
                sections: response.sections || [],
                table_columns: ('table_columns' in response ? response.table_columns : undefined) || [],
                html: docHtml,
              };
              setCurrentDocument(newDoc);
              setIsDocumentPanelOpen(true);
            }
            assistantText = response.type === 'tr'
              ? `O Termo de Referência foi gerado com sucesso. Você pode visualizá-lo e exportá-lo no painel à direita.`
              : `O Termo de Referência foi atualizado com sucesso. As alterações já estão refletidas no painel de visualização.`;
            break;
          }
          case 'tr_explain':
          case 'conversational':
          case 'document_query':
            assistantText = response.message === 'error' ? `Ocorreu um erro ao processar a resposta da API.` : String(response.message);
            break;
          default:
            assistantText = `Ocorreu um erro desconhecido na resposta da API.`;
            break;
        }

        setMessages((previous) => [
          ...previous,
          createMessage('assistant', assistantText),
        ]);

        window.dispatchEvent(new CustomEvent('chat-updated'));
      } catch (err: any) {
        setMessages((previous) => [
          ...previous,
          createMessage(
            'assistant',
            `Ocorreu um erro ao consultar a API. Detalhes: ${err?.message || 'Erro desconhecido'}`,
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
        // Renderiza o HTML num div fora da tela (sem iframe) e captura com html2canvas
        const A4_WIDTH_MM = 210;
        const A4_HEIGHT_MM = 297;
        const PX_PER_MM = 3.7795275591; // 96 dpi
        const pageWidthPx = Math.floor(A4_WIDTH_MM * PX_PER_MM);

        const offscreen = document.createElement('div');
        offscreen.innerHTML = content;
        Object.assign(offscreen.style, {
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: `${pageWidthPx}px`,
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: '12pt',
          lineHeight: '1.6',
          padding: '40px',
          color: '#000',
          background: '#fff',
          boxSizing: 'border-box',
        });
        document.body.appendChild(offscreen);

        try {
          const canvas = await html2canvas(offscreen, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: pageWidthPx,
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

          const pageHeightPx = Math.floor(A4_HEIGHT_MM * PX_PER_MM);
          const totalPages = Math.ceil(canvas.height / (pageHeightPx * 2)); // *2 for scale:2

          for (let page = 0; page < totalPages; page++) {
            if (page > 0) doc.addPage();

            // Clip da fatia desta página do canvas
            const srcY = page * pageHeightPx * 2;
            const srcH = Math.min(pageHeightPx * 2, canvas.height - srcY);
            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = srcH;
            const ctx = sliceCanvas.getContext('2d')!;
            ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

            const sliceImg = sliceCanvas.toDataURL('image/jpeg', 0.95);
            const sliceHeightMm = (srcH / (pageHeightPx * 2)) * A4_HEIGHT_MM;
            doc.addImage(sliceImg, 'JPEG', 0, 0, A4_WIDTH_MM, sliceHeightMm);
          }

          doc.save(`${filename}.pdf`);
        } finally {
          document.body.removeChild(offscreen);
        }
        break;
      }
    }
  };

  const isHtml = (content: string): boolean => {
    const htmlTagRegex = /<[a-z][\s\S]*>/i;
    return htmlTagRegex.test(content);
  };

  return (
    <div
      className="flex-1 min-h-0 h-full flex overflow-hidden relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm border-2 border-dashed border-primary m-4 rounded-xl pointer-events-none">
          <div className="flex flex-col items-center gap-2 text-primary bg-background/90 p-8 rounded-2xl shadow-lg border">
            <FileIcon className="size-16 animate-bounce" />
            <p className="text-xl font-semibold">Solte os arquivos aqui para anexar</p>
            <p className="text-sm opacity-70">Apenas arquivos .pdf, .txt ou .docx</p>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      <div className="flex flex-col min-h-0 h-full overflow-hidden" style={{ flex: isDocumentPanelOpen ? '0 0 42%' : '1 1 auto', minWidth: 0 }}>
      <header className="sticky top-0 z-20 border-b bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-sm font-medium">Admin Chat</h1>
          {currentDocument && (
            <button
              onClick={() => setIsDocumentPanelOpen(v => !v)}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border bg-background hover:bg-accent transition-colors"
            >
              <FileText className="size-3.5" />
              {isDocumentPanelOpen ? 'Ocultar TR' : 'Ver TR'}
            </button>
          )}
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
                  <ChatMessageActionCopy onClick={() => navigator.clipboard.writeText(message.parts.map(p => p.text).join('\n'))} />
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
                <ChatMessageActionCopy onClick={() => navigator.clipboard.writeText(assistantLoadingMessage)} />
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
        {attachments.length > 0 && (
          <div className="mx-auto w-full max-w-3xl flex flex-wrap gap-2 mb-2 p-2 bg-background border rounded-lg shadow-sm">
            {attachments.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground rounded-md text-sm group">
                <FileIcon className="size-4 opacity-70" />
                <span className="truncate max-w-[200px]" title={file.name}>{file.name}</span>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="opacity-50 hover:opacity-100 hover:text-destructive transition-colors ml-1"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
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
      </div>{/* end Chat Panel */}

      {/* Document Preview Panel */}
      {isDocumentPanelOpen && currentDocument && (
        <div
          className="flex flex-col border-l bg-background"
          style={{ flex: '1 1 58%', minWidth: 0 }}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="size-4 text-primary shrink-0" />
              <span className="text-sm font-semibold truncate" title={currentDocument.document_title}>
                {currentDocument.document_title || 'Termo de Referência'}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Send to Review Button */}
              {conversation_id && (
                <div className="flex flex-col items-end gap-0.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`font-medium ${
                      sendToReviewStatus === 'success'
                        ? 'border-green-500/40 text-green-700 dark:text-green-400'
                        : sendToReviewStatus === 'error'
                        ? 'border-red-500/40 text-red-600'
                        : 'border-primary/40 text-primary'
                    }`}
                    onClick={handleSendToReview}
                    disabled={isSendingToReview || sendToReviewStatus === 'success'}
                    title="Enviar este TR para a esteira de revisão"
                  >
                    {isSendingToReview ? (
                      <Loader2 className="size-4 mr-1.5 animate-spin" />
                    ) : sendToReviewStatus === 'success' ? (
                      <CheckCircle2 className="size-4 mr-1.5" />
                    ) : (
                      <SendToBack className="size-4 mr-1.5" />
                    )}
                    {sendToReviewStatus === 'success' ? 'Enviado!' : 'Enviar para Revisão'}
                  </Button>
                  {sendToReviewStatus === 'error' && sendToReviewError && (
                    <p className="text-[11px] text-red-600 max-w-[180px] text-right leading-tight">
                      {sendToReviewError}
                    </p>
                  )}
                </div>
              )}
              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="font-medium">
                    <Download className="size-4 mr-1.5" />
                    Exportar
                    <ChevronDown className="size-3.5 ml-1 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => handleExport(currentDocument.html, 'pdf')}>
                    <FileType2 className="size-4 mr-2 text-red-500" />
                    Baixar PDF (.pdf)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport(currentDocument.html, 'docx')}>
                    <FileArchive className="size-4 mr-2 text-blue-600" />
                    Baixar Word (.docx)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport(currentDocument.html, 'txt')}>
                    <FileText className="size-4 mr-2 text-gray-500" />
                    Baixar Texto (.txt)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport(currentDocument.html, 'html')}>
                    <FileCode className="size-4 mr-2 text-blue-500" />
                    Baixar HTML (.html)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                onClick={() => setIsDocumentPanelOpen(false)}
                className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                title="Fechar painel"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Document iframe */}
          <div className="flex-1 overflow-hidden">
            <iframe
              key={currentDocument.html.length}
              srcDoc={currentDocument.html}
              title={currentDocument.document_title || 'Documento'}
              className="w-full h-full border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}
    </div>
  );
}
