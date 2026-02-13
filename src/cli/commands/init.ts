import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import chalk from "chalk";
import { workflowTemplate } from "../templates/doxla-workflow.js";

export async function initCommand() {
  const workflowDir = join(process.cwd(), ".github", "workflows");
  const workflowPath = join(workflowDir, "doxla.yml");

  if (existsSync(workflowPath)) {
    console.log(
      chalk.yellow("⚠ Workflow file already exists at .github/workflows/doxla.yml")
    );
    console.log(chalk.yellow("  Overwriting with latest template..."));
  }

  await mkdir(workflowDir, { recursive: true });
  await writeFile(workflowPath, workflowTemplate, "utf-8");

  console.log(chalk.green("✓ Created .github/workflows/doxla.yml"));

  // Add doxla config to package.json if it doesn't exist
  const pkgPath = join(process.cwd(), "package.json");
  if (existsSync(pkgPath)) {
    try {
      const raw = await readFile(pkgPath, "utf-8");
      const pkg = JSON.parse(raw);
      if (!pkg.doxla) {
        pkg.doxla = {
          components: { dir: "docs/components" },
          dependencies: {},
        };
        await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
        console.log(chalk.green("✓ Added doxla config to package.json"));
      }
    } catch {
      // Skip if package.json is malformed
    }
  }

  console.log();
  console.log("Next steps:");
  console.log(
    `  1. Enable GitHub Pages in your repo settings (Settings → Pages → Source: ${chalk.bold("GitHub Actions")})`
  );
  console.log("  2. Commit and push the workflow file");
  console.log(
    "  3. Your docs will be built and deployed on every push to main"
  );
  console.log(
    `  4. Add custom MDX components in ${chalk.bold("docs/components/")} (optional)`
  );
}
