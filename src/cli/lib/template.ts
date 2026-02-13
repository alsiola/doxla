import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { existsSync } from "node:fs";

export function getTemplatePath(): string {
  const __filename = fileURLToPath(import.meta.url);
  let dir = dirname(__filename);

  // Walk up from the current file location until we find src/app
  // Works both from source (src/cli/lib/) and built (dist/cli/)
  for (let i = 0; i < 5; i++) {
    const candidate = resolve(dir, "src", "app");
    if (existsSync(resolve(candidate, "package.json"))) {
      return candidate;
    }
    dir = dirname(dir);
  }

  // Fallback: assume built location dist/cli/ -> ../../src/app
  const fallback = resolve(dirname(__filename), "..", "..", "src", "app");
  return fallback;
}
