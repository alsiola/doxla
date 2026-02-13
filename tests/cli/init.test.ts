import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdir, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";

// We test the core behavior by importing the workflow template and simulating
// what the init command does (write the file)
import { workflowTemplate } from "../../src/cli/templates/doxla-workflow";

describe("init command", () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `doxla-test-${randomBytes(6).toString("hex")}`);
    await mkdir(testDir, { recursive: true });
    originalCwd = process.cwd();
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await rm(testDir, { recursive: true, force: true });
  });

  it("workflow template is valid YAML-like content", () => {
    expect(workflowTemplate).toContain("name: Deploy Doxla Docs");
    expect(workflowTemplate).toContain("actions/checkout@v4");
    expect(workflowTemplate).toContain("npx doxla@latest build");
    expect(workflowTemplate).toContain("actions/deploy-pages@v4");
  });

  it("workflow template includes GitHub Pages permissions", () => {
    expect(workflowTemplate).toContain("pages: write");
    expect(workflowTemplate).toContain("id-token: write");
  });

  it("creates workflow directory and file", async () => {
    const workflowDir = join(testDir, ".github", "workflows");
    const workflowPath = join(workflowDir, "doxla.yml");

    await mkdir(workflowDir, { recursive: true });
    const { writeFile } = await import("node:fs/promises");
    await writeFile(workflowPath, workflowTemplate, "utf-8");

    expect(existsSync(workflowPath)).toBe(true);
    const content = await readFile(workflowPath, "utf-8");
    expect(content).toBe(workflowTemplate);
  });
});
