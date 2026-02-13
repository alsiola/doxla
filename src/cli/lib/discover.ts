import fg from "fast-glob";

const IGNORE_PATTERNS = [
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/build/**",
  "**/doxla-dist/**",
  "**/.next/**",
  "**/coverage/**",
];

export async function discoverMarkdownFiles(rootDir: string): Promise<string[]> {
  const files = await fg("**/*.{md,mdx}", {
    cwd: rootDir,
    ignore: IGNORE_PATTERNS,
    onlyFiles: true,
  });

  // Sort: README.md/README.mdx first, then alphabetical
  return files.sort((a, b) => {
    const aIsReadme = /^readme\.mdx?$/i.test(a);
    const bIsReadme = /^readme\.mdx?$/i.test(b);
    if (aIsReadme && !bIsReadme) return -1;
    if (!aIsReadme && bIsReadme) return 1;
    return a.localeCompare(b);
  });
}
