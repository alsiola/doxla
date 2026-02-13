import { readFile } from "node:fs/promises";
import { join, basename, dirname } from "node:path";
import type { Manifest, DocFile } from "../../app/src/types/manifest.js";

function extractTitle(content: string, filePath: string): string {
  // Try to extract from first # heading
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }

  // Fallback to filename without extension
  const name = basename(filePath, ".md");
  if (name.toLowerCase() === "readme") {
    const dir = dirname(filePath);
    if (dir === ".") return "README";
    return `${dir} - README`;
  }
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function createSlug(filePath: string): string {
  return filePath
    .replace(/\.md$/i, "")
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
      const content = await readFile(fullPath, "utf-8");
      return {
        slug: createSlug(filePath),
        path: filePath,
        title: extractTitle(content, filePath),
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
