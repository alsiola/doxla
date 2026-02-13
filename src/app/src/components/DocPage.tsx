import type { DocFile } from "../types/manifest";
import type { Theme } from "../App";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Badge } from "./ui/Badge";
import { Separator } from "./ui/Separator";

interface DocPageProps {
  doc: DocFile;
  theme: Theme;
}

export function DocPage({ doc, theme }: DocPageProps) {
  const pathParts = doc.path.split("/");

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
        <Badge variant="secondary">.md</Badge>
      </div>

      <Separator className="mb-6" />

      <MarkdownRenderer content={doc.content} theme={theme} />
    </div>
  );
}
