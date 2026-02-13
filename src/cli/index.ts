import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { buildCommand } from "./commands/build.js";

const program = new Command();

program
  .name("doxla")
  .description("Improve documentation discoverability within repos")
  .version("0.1.0");

program
  .command("init")
  .description("Set up GitHub Actions workflow for Doxla docs deployment")
  .action(initCommand);

program
  .command("build")
  .description("Discover markdown files and build the docs viewer")
  .option("-o, --output <dir>", "Output directory", "doxla-dist")
  .option("-r, --root <dir>", "Root directory to scan for markdown files", ".")
  .option("--base-path <path>", "Base path for GitHub Pages deployment", "/")
  .action(buildCommand);

program.parse();
