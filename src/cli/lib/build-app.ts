import { cp, writeFile, rm, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import type { Manifest } from "../../app/src/types/manifest.js";
import { getTemplatePath } from "./template.js";

interface BuildOptions {
  output: string;
  basePath: string;
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
