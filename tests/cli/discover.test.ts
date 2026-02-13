import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";
import { discoverMarkdownFiles } from "../../src/cli/lib/discover";

describe("discoverMarkdownFiles", () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `doxla-test-${randomBytes(6).toString("hex")}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it("finds markdown files in root directory", async () => {
    await writeFile(join(testDir, "README.md"), "# Hello");
    await writeFile(join(testDir, "guide.md"), "# Guide");

    const files = await discoverMarkdownFiles(testDir);
    expect(files).toEqual(["README.md", "guide.md"]);
  });

  it("finds markdown files in subdirectories", async () => {
    await mkdir(join(testDir, "docs"), { recursive: true });
    await writeFile(join(testDir, "README.md"), "# Root");
    await writeFile(join(testDir, "docs", "api.md"), "# API");

    const files = await discoverMarkdownFiles(testDir);
    expect(files).toEqual(["README.md", "docs/api.md"]);
  });

  it("sorts README.md first", async () => {
    await writeFile(join(testDir, "api.md"), "# API");
    await writeFile(join(testDir, "README.md"), "# Root");
    await writeFile(join(testDir, "zebra.md"), "# Zebra");

    const files = await discoverMarkdownFiles(testDir);
    expect(files[0]).toBe("README.md");
  });

  it("excludes node_modules", async () => {
    await mkdir(join(testDir, "node_modules", "pkg"), { recursive: true });
    await writeFile(join(testDir, "README.md"), "# Hello");
    await writeFile(
      join(testDir, "node_modules", "pkg", "README.md"),
      "# Pkg"
    );

    const files = await discoverMarkdownFiles(testDir);
    expect(files).toEqual(["README.md"]);
  });

  it("returns empty array when no markdown files", async () => {
    await writeFile(join(testDir, "code.ts"), "export const x = 1");

    const files = await discoverMarkdownFiles(testDir);
    expect(files).toEqual([]);
  });
});
