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
        <div
          className={className}
          style={{
            fontSize: '0.95rem',
            lineHeight: '1.6',
          }}
        >
          <style>{`
            .html-content h1, .html-content h2, .html-content h3, .html-content h4, .html-content h5, .html-content h6 {
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              font-weight: 600;
              line-height: 1.3;
            }
            .html-content h1 { font-size: 2em; }
            .html-content h2 { font-size: 1.5em; }
            .html-content h3 { font-size: 1.25em; }
            .html-content h4, .html-content h5, .html-content h6 { font-size: 1em; }
            .html-content p { margin: 0.5em 0; }
            .html-content ul, .html-content ol { margin: 1em 0; padding-left: 2em; }
            .html-content li { margin: 0.25em 0; }
            .html-content table { border-collapse: collapse; width: 100%; margin: 1em 0; }
            .html-content th, .html-content td { border: 1px solid #ccc; padding: 0.75em; text-align: left; }
            .html-content th { background-color: #f5f5f5; font-weight: 600; }
            .html-content strong { font-weight: 600; }
            .html-content em { font-style: italic; }
            .html-content a { color: #0066cc; text-decoration: underline; }
            .html-content blockquote { margin: 1em 0; padding-left: 1em; border-left: 3px solid #ccc; }
            .html-content pre { background-color: #f5f5f5; padding: 1em; overflow-x: auto; border-radius: 4px; }
            .html-content code { font-family: 'Courier New', monospace; background-color: #f5f5f5; padding: 0.2em 0.4em; border-radius: 2px; }
            .html-content pre code { background-color: transparent; padding: 0; }
            .html-content hr { margin: 1.5em 0; border: none; border-top: 1px solid #ccc; }
          `}</style>
          <div
            className="html-content"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          ></div>
        </div>
      );
    }

    return <MarkdownContent content={sanitizedContent} className={className} />;
  },
);

HtmlOrMarkdown.displayName = 'HtmlOrMarkdown';
