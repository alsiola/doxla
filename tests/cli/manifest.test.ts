import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";
import { generateManifest } from "../../src/cli/lib/manifest";

describe("generateManifest", () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `doxla-test-${randomBytes(6).toString("hex")}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it("generates a manifest with correct structure", async () => {
    await writeFile(join(testDir, "README.md"), "# My Project\n\nWelcome!");

    const manifest = await generateManifest(testDir, ["README.md"]);

    expect(manifest.totalDocs).toBe(1);
    expect(manifest.docs).toHaveLength(1);
    expect(manifest.generatedAt).toBeTruthy();
    expect(manifest.repoName).toBeTruthy();
  });

  it("extracts title from first heading", async () => {
    await writeFile(
      join(testDir, "guide.md"),
      "# Getting Started\n\nSome content here."
    );

    const manifest = await generateManifest(testDir, ["guide.md"]);

    expect(manifest.docs[0].title).toBe("Getting Started");
  });

  it("falls back to filename when no heading", async () => {
    await writeFile(join(testDir, "my-guide.md"), "Just some content.");

    const manifest = await generateManifest(testDir, ["my-guide.md"]);

    expect(manifest.docs[0].title).toBe("My Guide");
  });

  it("creates correct slugs", async () => {
    await mkdir(join(testDir, "docs"), { recursive: true });
    await writeFile(join(testDir, "docs", "API Guide.md"), "# API");

    const manifest = await generateManifest(testDir, ["docs/API Guide.md"]);

    expect(manifest.docs[0].slug).toBe("docs/api-guide");
  });

  it("includes file content", async () => {
    const content = "# Hello\n\nWorld!";
    await writeFile(join(testDir, "test.md"), content);

    const manifest = await generateManifest(testDir, ["test.md"]);

    expect(manifest.docs[0].content).toBe(content);
  });
});
