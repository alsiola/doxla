import type { DocFile } from "../types/manifest";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/Card";
import { Badge } from "./ui/Badge";
import { FileText } from "lucide-react";

interface IndexPageProps {
  docs: DocFile[];
}

function getPreview(content: string): string {
  // Strip the first heading and get the first non-empty text paragraph
  const lines = content.split("\n");
  let foundHeading = false;
  const previewLines: string[] = [];

  for (const line of lines) {
    if (!foundHeading && line.startsWith("#")) {
      foundHeading = true;
      continue;
    }
    const trimmed = line.trim();
    if (trimmed === "") {
      if (previewLines.length > 0) break;
      continue;
    }
    // Strip HTML tags in a loop to handle nested/malformed markup
    let textOnly = trimmed;
    while (/<[^>]+>/.test(textOnly)) {
      textOnly = textOnly.replace(/<[^>]+>/g, "");
    }
    textOnly = textOnly.replace(/[<>]/g, "").trim();
    if (textOnly === "") continue;
    previewLines.push(textOnly);
  }

  const preview = previewLines.join(" ");
  if (preview.length > 150) {
    return preview.slice(0, 150) + "...";
  }
  return preview || "No preview available";
}

function getDirLabel(path: string): string | null {
  const parts = path.split("/");
  if (parts.length <= 1) return null;
  return parts.slice(0, -1).join("/");
}

export function IndexPage({ docs }: IndexPageProps) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="mt-2 text-muted-foreground">
          {docs.length} document{docs.length === 1 ? "" : "s"} found in this
          repository
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {docs.map((doc) => {
          const dirLabel = getDirLabel(doc.path);
          return (
            <a key={doc.slug} href={`#/doc/${doc.slug}`} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="group-hover:text-primary">
                      {doc.title}
                    </CardTitle>
                  </div>
                  {dirLabel && (
                    <Badge variant="outline" className="w-fit">
                      {dirLabel}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription>{getPreview(doc.content)}</CardDescription>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
