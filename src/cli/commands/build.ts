import { resolve } from "node:path";
import chalk from "chalk";
import ora from "ora";
import { discoverMarkdownFiles } from "../lib/discover.js";
import { generateManifest } from "../lib/manifest.js";
import { buildApp } from "../lib/build-app.js";

interface BuildOptions {
  output: string;
  root: string;
  basePath: string;
}

export async function buildCommand(options: BuildOptions) {
  const rootDir = resolve(options.root);
  const outputDir = resolve(options.output);
  const basePath = options.basePath;

  console.log(chalk.bold("doxla build"));
  console.log();

  // Step 1: Discover markdown files
  const discoverSpinner = ora("Discovering markdown files...").start();
  const files = await discoverMarkdownFiles(rootDir);

  if (files.length === 0) {
    discoverSpinner.fail("No markdown files found");
    process.exit(1);
  }

  discoverSpinner.succeed(`Found ${files.length} markdown file${files.length === 1 ? "" : "s"}`);

  // Step 2: Generate manifest
  const manifestSpinner = ora("Generating manifest...").start();
  const { manifest, images } = await generateManifest(rootDir, files);
  manifestSpinner.succeed("Manifest generated");

  // Step 3: Build docs viewer
  const buildSpinner = ora("Building docs viewer...").start();
  try {
    await buildApp(manifest, { output: outputDir, basePath, rootDir, images });
    buildSpinner.succeed("Docs viewer built");
  } catch (error) {
    buildSpinner.fail("Build failed");
    console.error(chalk.red((error as Error).message));
    process.exit(1);
  }

  console.log();
  console.log(chalk.green(`✓ Output written to ${options.output}/`));
}
