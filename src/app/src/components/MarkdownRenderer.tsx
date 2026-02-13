import { useMemo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";
import type { Theme } from "../App";

interface MarkdownRendererProps {
  content: string;
  theme: Theme;
  docPath?: string;
}

function resolveDocLink(href: string, docPath: string): string | null {
  if (!href.match(/\.md(#.*)?$/i)) return null;
  if (/^https?:\/\//.test(href)) return null;

  const [filePart, anchor] = href.split("#");
  const docDir = docPath.includes("/") ? docPath.replace(/\/[^/]+$/, "") : "";
  const parts = (docDir ? `${docDir}/${filePart}` : filePart).split("/");

  const resolved: string[] = [];
  for (const part of parts) {
    if (part === "..") resolved.pop();
    else if (part !== ".") resolved.push(part);
  }

  const slug = resolved
    .join("/")
    .replace(/\.md$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9/.-]/g, "-");

  return `#/doc/${slug}${anchor ? `#${anchor}` : ""}`;
}

export function MarkdownRenderer({ content, theme, docPath }: MarkdownRendererProps) {
  const syntaxStyle = theme === "dark" ? oneDark : oneLight;

  const components: Components = useMemo(
    () => ({
      code(props) {
        const { children, className, ...rest } = props;
        const match = /language-(\w+)/.exec(className || "");
        const isInline = !match;

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
            language={match[1]}
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
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </Markdown>
    </div>
  );
}
