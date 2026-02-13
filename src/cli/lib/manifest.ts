import { readFile } from "node:fs/promises";
import { join, basename, dirname } from "node:path";
import type { Manifest, DocFile } from "../../app/src/types/manifest.js";

function extractTitleAndContent(
  content: string,
  filePath: string
): { title: string; content: string } {
  // Check if the first non-blank line is a # heading
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;

    const match = lines[i].match(/^#\s+(.+)$/);
    if (match) {
      const title = match[1].trim();
      const remaining = lines.slice(i + 1).join("\n").trimStart();
      return { title, content: remaining };
    }
    break;
  }

  // No leading heading — try any heading in the document for the title
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return { title: match[1].trim(), content };
  }

  // Fallback to filename without extension
  const ext = filePath.endsWith(".mdx") ? ".mdx" : ".md";
  const name = basename(filePath, ext);
  if (name.toLowerCase() === "readme") {
    const dir = dirname(filePath);
    if (dir === ".") return { title: "README", content };
    return { title: `${dir} - README`, content };
  }
  return {
    title: name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    content,
  };
}

function createSlug(filePath: string): string {
  return filePath
    .replace(/\.mdx?$/i, "")
    .replace(/\\/g, "/")
    .toLowerCase()
    .replace(/[^a-z0-9/.-]/g, "-");
}

export async function generateManifest(
  rootDir: string,
  files: string[]
): Promise<Manifest> {
  const docs: DocFile[] = await Promise.all(
    files.map(async (filePath) => {
      const fullPath = join(rootDir, filePath);
      const raw = await readFile(fullPath, "utf-8");
      const { title, content } = extractTitleAndContent(raw, filePath);
      return {
        slug: createSlug(filePath),
        path: filePath,
        title,
        content,
      };
    })
  );

  const repoName = basename(rootDir);

  return {
    repoName,
    generatedAt: new Date().toISOString(),
    totalDocs: docs.length,
    docs,
  };
}
