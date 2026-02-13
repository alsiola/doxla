import { cp, readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import type { Manifest } from "../../app/src/types/manifest.js";
import { getTemplatePath } from "./template.js";
import type { DiscoveredComponent } from "./components.js";
import { generateBarrelContent } from "./components.js";

interface BuildOptions {
  output: string;
  basePath: string;
  rootDir: string;
  images: string[];
  components: DiscoveredComponent[];
  extraDependencies: Record<string, string>;
}

export async function buildApp(
  manifest: Manifest,
  options: BuildOptions
): Promise<void> {
  const templateDir = getTemplatePath();
  const tempDir = join(
    tmpdir(),
    `doxla-build-${randomBytes(6).toString("hex")}`
  );

  try {
    // Copy template to temp dir
    await cp(templateDir, tempDir, { recursive: true });

    // Write manifest.json into the app's src directory
    await writeFile(
      join(tempDir, "src", "manifest.json"),
      JSON.stringify(manifest, null, 2),
      "utf-8"
    );

    // Copy referenced images to public dir
    if (options.images.length > 0) {
      const publicDir = join(tempDir, "public");
      await mkdir(publicDir, { recursive: true });
      for (const img of options.images) {
        const src = join(options.rootDir, img);
        const dest = join(publicDir, img);
        await mkdir(join(dest, ".."), { recursive: true });
        await cp(src, dest).catch(() => {});
      }
    }

    // Copy custom components into temp app
    const userComponentsDir = join(tempDir, "src", "user-components");
    await mkdir(userComponentsDir, { recursive: true });

    if (options.components.length > 0) {
      for (const component of options.components) {
        const src = join(options.rootDir, component.filePath);
        const dest = join(userComponentsDir, `${component.fileName}.tsx`);
        try {
          await cp(src, dest);
        } catch (err) {
          throw new Error(
            `Failed to copy component ${component.name} from ${component.filePath}: ${(err as Error).message}`
          );
        }
      }
    }

    // Write barrel file (always, overwrites placeholder)
    await writeFile(
      join(userComponentsDir, "index.ts"),
      generateBarrelContent(options.components),
      "utf-8"
    );

    // Merge extra dependencies into temp package.json
    if (Object.keys(options.extraDependencies).length > 0) {
      const pkgPath = join(tempDir, "package.json");
      const pkgRaw = await readFile(pkgPath, "utf-8");
      const pkg = JSON.parse(pkgRaw);
      pkg.dependencies = { ...pkg.dependencies, ...options.extraDependencies };
      await writeFile(pkgPath, JSON.stringify(pkg, null, 2), "utf-8");
    }

    // Install dependencies
    execSync("npm install --no-audit --no-fund", {
      cwd: tempDir,
      stdio: "pipe",
    });

    // Build with Vite, passing base path as env var
    execSync("npx vite build", {
      cwd: tempDir,
      stdio: "pipe",
      env: { ...process.env, VITE_BASE_PATH: options.basePath },
    });

    // Copy output
    await rm(options.output, { recursive: true, force: true });
    await mkdir(options.output, { recursive: true });
    await cp(join(tempDir, "dist"), options.output, { recursive: true });
  } finally {
    // Clean up temp dir
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}
