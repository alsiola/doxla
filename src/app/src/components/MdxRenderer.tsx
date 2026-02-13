import { useState, useEffect, useMemo } from "react";
import type { ComponentType, ReactNode } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Theme } from "../App";
import { resolveDocLink } from "../lib/doc-links";
import { DoxlaProvider } from "../context/DoxlaContext";
import { Callout } from "./mdx/Callout";
import { MdxErrorBoundary } from "./mdx/MdxErrorBoundary";
import * as userComponents from "../user-components";

interface MdxRendererProps {
  content: string;
  theme: Theme;
  docPath?: string;
}

const builtinComponents = {
  Callout,
  ...userComponents,
};

// WARNING: evaluate() executes arbitrary JavaScript from MDX content.
// Only use with trusted content from your own repository.
export function MdxRenderer({ content, theme, docPath }: MdxRendererProps) {
  const [MdxContent, setMdxContent] = useState<ComponentType<{ components?: Record<string, unknown> }> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const syntaxStyle = theme === "dark" ? oneDark : oneLight;

  useEffect(() => {
    let cancelled = false;

    async function compileMdx() {
      try {
        const { default: Content } = await evaluate(content, {
          ...jsxRuntime,
          remarkPlugins: [remarkGfm],
        } as Parameters<typeof evaluate>[1]);

        if (!cancelled) {
          setMdxContent(() => Content);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
          setMdxContent(null);
        }
      }
    }

    compileMdx();
    return () => { cancelled = true; };
  }, [content]);

  const mdxComponents = useMemo(() => ({
    ...builtinComponents,
    code(props: Record<string, unknown>) {
      const { children, className, ...rest } = props;
      const match = /language-(\w+)/.exec((className as string) || "");
      const isInline = !match;

      if (isInline) {
        return (
          <code
            className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
            {...rest}
          >
            {children as ReactNode}
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
    a(props: Record<string, unknown>) {
      const { href, children, ...rest } = props;
      if (href && docPath) {
        const resolved = resolveDocLink(href as string, docPath);
        if (resolved) {
          return <a href={resolved} {...rest}>{children as ReactNode}</a>;
        }
      }
      return <a href={href as string} {...rest}>{children as ReactNode}</a>;
    },
  }), [syntaxStyle, docPath]);

  if (error) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
        <p className="font-semibold">MDX Error</p>
        <pre className="mt-2 text-sm whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  if (!MdxContent) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-6 w-1/3 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
    );
  }

  return (
    <DoxlaProvider theme={theme}>
      <div className={`prose prose-neutral max-w-none ${theme === "dark" ? "prose-invert" : ""}`}>
        <MdxErrorBoundary>
          <MdxContent components={mdxComponents} />
        </MdxErrorBoundary>
      </div>
    </DoxlaProvider>
  );
}
