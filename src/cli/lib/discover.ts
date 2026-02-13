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
  const files = await fg("**/*.md", {
    cwd: rootDir,
    ignore: IGNORE_PATTERNS,
    onlyFiles: true,
  });

  // Sort: README.md first, then alphabetical
  return files.sort((a, b) => {
    const aIsReadme = a.toLowerCase() === "readme.md";
    const bIsReadme = b.toLowerCase() === "readme.md";
    if (aIsReadme && !bIsReadme) return -1;
    if (!aIsReadme && bIsReadme) return 1;
    return a.localeCompare(b);
  });
}
