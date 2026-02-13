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

  it("strips leading heading from content", async () => {
    await writeFile(join(testDir, "test.md"), "# Hello\n\nWorld!");

    const manifest = await generateManifest(testDir, ["test.md"]);

    expect(manifest.docs[0].title).toBe("Hello");
    expect(manifest.docs[0].content).toBe("World!");
  });

  it("preserves content when no heading exists", async () => {
    const content = "Just some content.";
    await writeFile(join(testDir, "test.md"), content);

    const manifest = await generateManifest(testDir, ["test.md"]);

    expect(manifest.docs[0].content).toBe(content);
  });

  it("does not strip mid-document heading", async () => {
    const content = "Intro text.\n\n# Mid Heading\n\nMore content.";
    await writeFile(join(testDir, "test.md"), content);

    const manifest = await generateManifest(testDir, ["test.md"]);

    expect(manifest.docs[0].title).toBe("Mid Heading");
    expect(manifest.docs[0].content).toBe(content);
  });

  it("strips heading preceded by blank lines", async () => {
    await writeFile(join(testDir, "test.md"), "\n\n# Title\n\nBody here.");

    const manifest = await generateManifest(testDir, ["test.md"]);

    expect(manifest.docs[0].title).toBe("Title");
    expect(manifest.docs[0].content).toBe("Body here.");
  });

  it("creates correct slugs for .mdx files", async () => {
    await mkdir(join(testDir, "guides"), { recursive: true });
    await writeFile(join(testDir, "guides", "quick-start.mdx"), "# Quick Start");

    const manifest = await generateManifest(testDir, ["guides/quick-start.mdx"]);

    expect(manifest.docs[0].slug).toBe("guides/quick-start");
  });

  it("extracts title from .mdx files", async () => {
    await writeFile(
      join(testDir, "intro.mdx"),
      "# Welcome to MDX\n\n<Callout>Hello</Callout>"
    );

    const manifest = await generateManifest(testDir, ["intro.mdx"]);

    expect(manifest.docs[0].title).toBe("Welcome to MDX");
  });

  it("falls back to filename for .mdx without heading", async () => {
    await writeFile(join(testDir, "my-guide.mdx"), "Some MDX content.");

    const manifest = await generateManifest(testDir, ["my-guide.mdx"]);

    expect(manifest.docs[0].title).toBe("My Guide");
  });

  it("handles file with only a heading and no content", async () => {
    await writeFile(join(testDir, "test.md"), "# Only Title");

    const manifest = await generateManifest(testDir, ["test.md"]);

    expect(manifest.docs[0].title).toBe("Only Title");
    expect(manifest.docs[0].content).toBe("");
  });

  it("preserves .mdx path in manifest", async () => {
    await writeFile(join(testDir, "example.mdx"), "# Example");

    const manifest = await generateManifest(testDir, ["example.mdx"]);

    expect(manifest.docs[0].path).toBe("example.mdx");
  });
});
