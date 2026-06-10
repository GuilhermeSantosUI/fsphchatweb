import DOMPurify from 'dompurify';
import { memo, useMemo } from 'react';
import { MarkdownContent } from './markdown-content';

interface HtmlOrMarkdownProps {
  content: string;
  className?: string;
}

function isHtml(content: string): boolean {
  const htmlTagRegex = /<[a-z][\s\S]*>/i;
  return htmlTagRegex.test(content);
}

export const HtmlOrMarkdown = memo(
  ({ content, className }: HtmlOrMarkdownProps) => {
    const sanitizedContent = useMemo(() => {
      // ... (Mantenha o seu código DOMPurify exatamente como está)
      if (!content) return '';

      if (isHtml(content)) {
        return DOMPurify.sanitize(content, {
          ALLOWED_TAGS: [
            'p',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'br',
            'hr',
            'strong',
            'em',
            'b',
            'i',
            'u',
            'ul',
            'ol',
            'li',
            'div',
            'span',
            'table',
            'thead',
            'tbody',
            'tr',
            'td',
            'th',
            'a',
            'img',
            'blockquote',
            'pre',
            'code',
            'section',
            'article',
          ],
          ALLOWED_ATTR: [
            'href',
            'src',
            'alt',
            'title',
            'class',
            'id',
            'style',
            'target',
            'rel',
          ],
          KEEP_CONTENT: true,
        });
      }

      return content;
    }, [content]);

    if (isHtml(content)) {
      return (
        /* AQUI ESTÁ O SEGREDO DO VISUAL FORMAL:
          Um container branco, com borda sutil, sombra suave e padding generoso
          para simular uma página de documento.
        */
        <div
          className={`bg-white border border-gray-200 shadow-sm rounded-lg p-8 sm:p-12 max-w-4xl mx-auto ${className || ''}`}
        >
          <style>{`
            .document-content {
              font-family: 'Georgia', 'Cambria', 'Times New Roman', serif; /* Fonte formal */
              color: #1f2937;
              font-size: 1.05rem;
              line-height: 1.8;
              text-align: justify; /* Textos justificados dão ar de ofício/relatório */
            }
            .document-content h1, 
            .document-content h2, 
            .document-content h3, 
            .document-content h4 {
              font-family: 'Inter', 'Helvetica Neue', sans-serif; /* Títulos limpos e modernos */
              color: #111827;
              margin-top: 2em;
              margin-bottom: 0.75em;
              font-weight: 700;
              line-height: 1.3;
              text-align: left;
            }
            .document-content h1 { font-size: 2.25em; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.3em; }
            .document-content h2 { font-size: 1.75em; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.3em; }
            .document-content h3 { font-size: 1.35em; }
            .document-content p { margin: 1.2em 0; }
            .document-content ul, .document-content ol { margin: 1.5em 0; padding-left: 2.5em; text-align: left; }
            .document-content li { margin: 0.5em 0; }
            .document-content table { border-collapse: collapse; width: 100%; margin: 2em 0; font-family: 'Inter', sans-serif; font-size: 0.95rem; }
            .document-content th, .document-content td { border: 1px solid #d1d5db; padding: 1em; text-align: left; }
            .document-content th { background-color: #f9fafb; font-weight: 600; color: #374151; }
            .document-content blockquote { 
              margin: 2em 0; 
              padding: 1em 1.5em; 
              border-left: 4px solid #9ca3af; 
              background-color: #f9fafb;
              font-style: italic;
            }
            .document-content a { color: #2563eb; text-decoration: none; }
            .document-content a:hover { text-decoration: underline; }
            .document-content hr { margin: 3em 0; border: none; border-top: 1px solid #e5e7eb; }
          `}</style>
          <div
            className="document-content"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          ></div>
        </div>
      );
    }

    return <MarkdownContent content={sanitizedContent} className={className} />;
  },
);

HtmlOrMarkdown.displayName = 'HtmlOrMarkdown';
