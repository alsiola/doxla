import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface DoxlaConfig {
  components: { dir: string };
  dependencies: Record<string, string>;
}

const DEFAULT_CONFIG: DoxlaConfig = {
  components: { dir: "docs/components" },
  dependencies: {},
};

export async function readConfig(rootDir: string): Promise<DoxlaConfig> {
  try {
    const raw = await readFile(join(rootDir, "package.json"), "utf-8");
    const pkg = JSON.parse(raw);
    const doxla = pkg.doxla || {};
    return {
      components: {
        dir: doxla.components?.dir ?? DEFAULT_CONFIG.components.dir,
      },
      dependencies: doxla.dependencies ?? DEFAULT_CONFIG.dependencies,
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
