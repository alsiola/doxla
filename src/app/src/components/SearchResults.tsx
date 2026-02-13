import type { DocFile } from "../types/manifest";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { FileText, SearchX } from "lucide-react";

interface SearchResultsProps {
  docs: DocFile[];
  query: string;
}

interface SearchHit {
  doc: DocFile;
  snippet: string;
}

function search(docs: DocFile[], query: string): SearchHit[] {
  if (!query.trim()) return [];

  const lower = query.toLowerCase();
  const results: SearchHit[] = [];

  for (const doc of docs) {
    const titleMatch = doc.title.toLowerCase().includes(lower);
    const contentLower = doc.content.toLowerCase();
    const contentIdx = contentLower.indexOf(lower);

    if (titleMatch || contentIdx !== -1) {
      let snippet = "";
      if (contentIdx !== -1) {
        const start = Math.max(0, contentIdx - 60);
        const end = Math.min(doc.content.length, contentIdx + query.length + 60);
        snippet =
          (start > 0 ? "..." : "") +
          doc.content.slice(start, end).replace(/\n/g, " ") +
          (end < doc.content.length ? "..." : "");
      } else {
        // Title match only - take first line of content as snippet
        const firstLine = doc.content.split("\n").find((l) => l.trim() && !l.startsWith("#"));
        snippet = firstLine?.trim().slice(0, 120) || "";
      }
      results.push({ doc, snippet });
    }
  }

  return results;
}

export function SearchResults({ docs, query }: SearchResultsProps) {
  const results = search(docs, query);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Search Results</h1>
        <p className="mt-2 text-muted-foreground">
          {results.length} result{results.length === 1 ? "" : "s"} for &quot;{query}&quot;
        </p>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
          <SearchX className="h-12 w-12" />
          <p>No documents matched your search.</p>
          <a href="#/" className="text-primary underline">
            Back to index
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((hit) => (
            <a key={hit.doc.slug} href={`#/doc/${hit.doc.slug}`} className="group block">
              <Card className="transition-shadow group-hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="group-hover:text-primary">
                      {hit.doc.title}
                    </CardTitle>
                    <Badge variant="outline" className="ml-auto">
                      {hit.doc.path}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{hit.snippet}</CardDescription>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
