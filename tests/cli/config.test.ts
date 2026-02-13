import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";
import { readConfig } from "../../src/cli/lib/config";

describe("readConfig", () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `doxla-test-${randomBytes(6).toString("hex")}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it("returns defaults when no package.json exists", async () => {
    const config = await readConfig(testDir);
    expect(config).toEqual({
      components: { dir: "docs/components" },
      dependencies: {},
    });
  });

  it("returns defaults when package.json has no doxla key", async () => {
    await writeFile(
      join(testDir, "package.json"),
      JSON.stringify({ name: "test-project" }),
      "utf-8"
    );

    const config = await readConfig(testDir);
    expect(config).toEqual({
      components: { dir: "docs/components" },
      dependencies: {},
    });
  });

  it("reads components.dir from config", async () => {
    await writeFile(
      join(testDir, "package.json"),
      JSON.stringify({
        name: "test-project",
        doxla: { components: { dir: "src/components" } },
      }),
      "utf-8"
    );

    const config = await readConfig(testDir);
    expect(config.components.dir).toBe("src/components");
  });

  it("reads dependencies from config", async () => {
    await writeFile(
      join(testDir, "package.json"),
      JSON.stringify({
        name: "test-project",
        doxla: { dependencies: { recharts: "^2.0.0" } },
      }),
      "utf-8"
    );

    const config = await readConfig(testDir);
    expect(config.dependencies).toEqual({ recharts: "^2.0.0" });
  });

  it("handles malformed package.json gracefully", async () => {
    await writeFile(join(testDir, "package.json"), "not valid json", "utf-8");

    const config = await readConfig(testDir);
    expect(config).toEqual({
      components: { dir: "docs/components" },
      dependencies: {},
    });
  });

  it("uses default components.dir when only dependencies provided", async () => {
    await writeFile(
      join(testDir, "package.json"),
      JSON.stringify({
        name: "test-project",
        doxla: { dependencies: { d3: "^7.0.0" } },
      }),
      "utf-8"
    );

    const config = await readConfig(testDir);
    expect(config.components.dir).toBe("docs/components");
  });
});
