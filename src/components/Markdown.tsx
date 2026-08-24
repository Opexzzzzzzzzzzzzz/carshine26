import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

// Рендер markdown-описания товара. Безопасно (сырой HTML не вставляется).
// remark-breaks: одиночный перенос строки → <br> (чтобы вставленные списки
// с «•» и переносами сохраняли структуру). remark-gfm: списки, жирный и т.д.
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="leading-relaxed text-fg-muted">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 pl-5 marker:text-gold last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-5 marker:text-gold last:mb-0">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer" className="text-gold hover:underline">
              {children}
            </a>
          ),
          h1: ({ children }) => <h3 className="mb-2 mt-4 font-display text-lg font-bold text-fg first:mt-0">{children}</h3>,
          h2: ({ children }) => <h3 className="mb-2 mt-4 font-display text-lg font-bold text-fg first:mt-0">{children}</h3>,
          h3: ({ children }) => <h4 className="mb-2 mt-4 font-semibold text-fg first:mt-0">{children}</h4>,
          h4: ({ children }) => <h4 className="mb-2 mt-4 font-semibold text-fg first:mt-0">{children}</h4>,
          blockquote: ({ children }) => (
            <blockquote className="mb-3 border-l-2 border-gold/50 pl-4 italic text-fg-dim">{children}</blockquote>
          ),
          hr: () => <hr className="my-4 border-border" />,
          code: ({ children }) => (
            <code className="rounded bg-surface-2 px-1.5 py-0.5 text-sm text-fg">{children}</code>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
