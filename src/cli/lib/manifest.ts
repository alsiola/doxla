import { readFile } from "node:fs/promises";
import { join, basename, dirname, normalize } from "node:path";
import type { Manifest, DocFile } from "../../app/src/types/manifest.js";

function resolveImagePaths(
  content: string,
  docPath: string
): { content: string; images: string[] } {
  const docDir = dirname(docPath);
  const images: string[] = [];

  function resolve(src: string): string | null {
    if (/^(https?:\/\/|data:)/.test(src)) return null;
    const resolved = normalize(join(docDir, src)).replace(/\\/g, "/");
    if (resolved.startsWith("..")) return null;
    images.push(resolved);
    return resolved;
  }

  // Rewrite markdown images: ![alt](path)
  let result = content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, src) => {
      const resolved = resolve(src);
      return resolved ? `![${alt}](${resolved})` : match;
    }
  );

  // Rewrite HTML images: <img ... src="path" ...>
  result = result.replace(
    /(<img\s[^>]*?)src=["']([^"']+)["']/g,
    (match, prefix, src) => {
      const resolved = resolve(src);
      return resolved ? `${prefix}src="${resolved}"` : match;
    }
  );

  return { content: result, images: [...new Set(images)] };
}

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

  // No leading heading — fallback to filename
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
): Promise<{ manifest: Manifest; images: string[] }> {
  const allImages: string[] = [];

  const docs: DocFile[] = await Promise.all(
    files.map(async (filePath) => {
      const fullPath = join(rootDir, filePath);
      const raw = await readFile(fullPath, "utf-8");
      const extracted = extractTitleAndContent(raw, filePath);
      const { content, images } = resolveImagePaths(extracted.content, filePath);
      allImages.push(...images);
      return {
        slug: createSlug(filePath),
        path: filePath,
        title: extracted.title,
        content,
      };
    })
  );

  const repoName = basename(rootDir);

  return {
    manifest: {
      repoName,
      generatedAt: new Date().toISOString(),
      totalDocs: docs.length,
      docs,
    },
    images: [...new Set(allImages)],
  };
}
