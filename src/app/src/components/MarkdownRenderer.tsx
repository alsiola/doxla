import { useMemo } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";
import type { Theme } from "../App";
import { resolveDocLink } from "../lib/doc-links";

interface MarkdownRendererProps {
  content: string;
  theme: Theme;
  docPath?: string;
}

export function MarkdownRenderer({ content, theme, docPath }: MarkdownRendererProps) {
  const syntaxStyle = theme === "dark" ? oneDark : oneLight;

  const components: Components = useMemo(
    () => ({
      code(props) {
        const { children, className, ...rest } = props;
        const match = /language-(\w+)/.exec(className || "");
        const isInline = !match && !String(children).endsWith('\n');

        if (isInline) {
          return (
            <code
              className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
              {...rest}
            >
              {children}
            </code>
          );
        }

        return (
          <SyntaxHighlighter
            style={syntaxStyle}
            language={match?.[1] ?? "text"}
            PreTag="div"
            className="rounded-md text-sm"
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        );
      },
      a(props) {
        const { href, children, ...rest } = props;
        if (href && docPath) {
          const resolved = resolveDocLink(href, docPath);
          if (resolved) {
            return <a href={resolved} {...rest}>{children}</a>;
          }
        }
        return <a href={href} {...rest}>{children}</a>;
      },
    }),
    [syntaxStyle, docPath],
  );

  return (
    <div className={`prose prose-neutral max-w-none ${theme === "dark" ? "prose-invert" : ""}`}>
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
        {content}
      </Markdown>
    </div>
  );
}
