import fg from "fast-glob";
import { join, basename, normalize, resolve, sep } from "node:path";

export interface DiscoveredComponent {
  filePath: string;
  name: string;
  fileName: string;
}

export async function discoverComponents(
  rootDir: string,
  componentsDir: string
): Promise<DiscoveredComponent[]> {
  const cwd = join(rootDir, componentsDir);
  const expectedBase = resolve(rootDir, componentsDir);
  const files = await fg("*.tsx", {
    cwd,
    onlyFiles: true,
    absolute: false,
  });

  return files
    .map((file) => {
      const fileName = basename(file, ".tsx");
      const normalizedPath = normalize(join(componentsDir, file));
      const resolvedPath = resolve(rootDir, normalizedPath);

      // Guard against path traversal
      if (!resolvedPath.startsWith(expectedBase + sep) && resolvedPath !== expectedBase) {
        return null;
      }

      return {
        filePath: normalizedPath,
        name: fileName,
        fileName,
      };
    })
    .filter((c): c is DiscoveredComponent =>
      c !== null && /^[A-Z][A-Za-z0-9]*$/.test(c.name)
    )
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function generateBarrelContent(
  components: DiscoveredComponent[]
): string {
  if (components.length === 0) return "export {};\n";
  return (
    components
      .map((c) => `export { default as ${c.name} } from "./${c.fileName}";`)
      .join("\n") + "\n"
  );
}
