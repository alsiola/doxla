import { mkdir, writeFile } from "node:fs/promises";
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
  console.log();
  console.log("Next steps:");
  console.log(
    `  1. Enable GitHub Pages in your repo settings (Settings → Pages → Source: ${chalk.bold("GitHub Actions")})`
  );
  console.log("  2. Commit and push the workflow file");
  console.log(
    "  3. Your docs will be built and deployed on every push to main"
  );
}
