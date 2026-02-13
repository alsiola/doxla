import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";
import {
  discoverComponents,
  generateBarrelContent,
} from "../../src/cli/lib/components";

describe("discoverComponents", () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `doxla-test-${randomBytes(6).toString("hex")}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it("discovers .tsx files in configured directory", async () => {
    const compDir = "docs/components";
    await mkdir(join(testDir, compDir), { recursive: true });
    await writeFile(
      join(testDir, compDir, "MyChart.tsx"),
      "export default function MyChart() { return <div />; }"
    );
    await writeFile(
      join(testDir, compDir, "Alert.tsx"),
      "export default function Alert() { return <div />; }"
    );

    const components = await discoverComponents(testDir, compDir);
    expect(components).toEqual([
      { filePath: "docs/components/Alert.tsx", name: "Alert", fileName: "Alert" },
      { filePath: "docs/components/MyChart.tsx", name: "MyChart", fileName: "MyChart" },
    ]);
  });

  it("skips files that don't start with uppercase", async () => {
    const compDir = "docs/components";
    await mkdir(join(testDir, compDir), { recursive: true });
    await writeFile(
      join(testDir, compDir, "MyChart.tsx"),
      "export default function MyChart() { return <div />; }"
    );
    await writeFile(
      join(testDir, compDir, "helper.tsx"),
      "export function helper() {}"
    );

    const components = await discoverComponents(testDir, compDir);
    expect(components).toHaveLength(1);
    expect(components[0].name).toBe("MyChart");
  });

  it("skips files with non-alphanumeric names", async () => {
    const compDir = "docs/components";
    await mkdir(join(testDir, compDir), { recursive: true });
    await writeFile(
      join(testDir, compDir, "My-Chart.tsx"),
      "export default function MyChart() { return <div />; }"
    );
    await writeFile(
      join(testDir, compDir, "My_Chart.tsx"),
      "export default function MyChart() { return <div />; }"
    );
    await writeFile(
      join(testDir, compDir, "ValidName.tsx"),
      "export default function ValidName() { return <div />; }"
    );

    const components = await discoverComponents(testDir, compDir);
    expect(components).toHaveLength(1);
    expect(components[0].name).toBe("ValidName");
  });

  it("returns empty array when directory doesn't exist", async () => {
    const components = await discoverComponents(testDir, "nonexistent");
    expect(components).toEqual([]);
  });

  it("returns results sorted by name", async () => {
    const compDir = "docs/components";
    await mkdir(join(testDir, compDir), { recursive: true });
    await writeFile(join(testDir, compDir, "Zebra.tsx"), "export default function Zebra() { return <div />; }");
    await writeFile(join(testDir, compDir, "Alpha.tsx"), "export default function Alpha() { return <div />; }");
    await writeFile(join(testDir, compDir, "Middle.tsx"), "export default function Middle() { return <div />; }");

    const components = await discoverComponents(testDir, compDir);
    expect(components.map((c) => c.name)).toEqual(["Alpha", "Middle", "Zebra"]);
  });
});

describe("generateBarrelContent", () => {
  it("produces correct export statements", () => {
    const components = [
      { filePath: "docs/components/Alert.tsx", name: "Alert", fileName: "Alert" },
      { filePath: "docs/components/MyChart.tsx", name: "MyChart", fileName: "MyChart" },
    ];

    const content = generateBarrelContent(components);
    expect(content).toBe(
      'export { default as Alert } from "./Alert";\n' +
      'export { default as MyChart } from "./MyChart";\n'
    );
  });

  it("returns export {} for empty array", () => {
    const content = generateBarrelContent([]);
    expect(content).toBe("export {};\n");
  });
});
