import type { DocFile } from "../types/manifest";
import type { Theme } from "../App";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { MdxRenderer } from "./MdxRenderer";
import { Badge } from "./ui/Badge";
import { Separator } from "./ui/Separator";

interface DocPageProps {
  doc: DocFile;
  theme: Theme;
}

function isMdx(path: string): boolean {
  return path.endsWith(".mdx");
}

export function DocPage({ doc, theme }: DocPageProps) {
  const pathParts = doc.path.split("/");
  const mdx = isMdx(doc.path);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <a href="#/" className="hover:text-foreground">
          Home
        </a>
        {pathParts.map((part, i) => (
          <span key={i} className="flex items-center gap-2">
            <span>/</span>
            {i === pathParts.length - 1 ? (
              <span className="text-foreground">{part}</span>
            ) : (
              <span>{part}</span>
            )}
          </span>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-3xl font-bold">{doc.title}</h1>
        <Badge variant="secondary">{mdx ? ".mdx" : ".md"}</Badge>
      </div>

      <Separator className="mb-6" />

      {mdx ? (
        <MdxRenderer content={doc.content} theme={theme} docPath={doc.path} />
      ) : (
        <MarkdownRenderer content={doc.content} theme={theme} docPath={doc.path} />
      )}
    </div>
  );
}
