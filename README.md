<p align="center">
  <img src="logo.png" alt="Doxla" width="120" />
</p>

# doxla

Improve documentation discoverability within repos. Doxla discovers all `.md` and `.mdx` files in your repository, builds a beautiful docs viewer, and deploys it to GitHub Pages.

## Why?

Documentation is most valuable when it lives next to the code it describes — but in-repo markdown has a discoverability problem. Files get buried in directory trees, raw markdown is hard to read in editors, and preview plugins vary by IDE.

Meanwhile, AI coding assistants (Claude Code, Copilot, Cursor) work with what's in the repository. Docs in Notion or Google Docs are invisible to them. In-repo markdown is context they can read and act on.

Doxla bridges the gap: keep your docs as `.md` or `.mdx` files in your repo (where both humans and AI agents can find them), and Doxla turns them into a readable, searchable site.

Read the full rationale: [Why Doxla?](RATIONALE.md)

## Quick Start

### Deploy to GitHub Pages

Run this in your repo to set up automatic deployment:

```bash
npx doxla init
```

This creates a GitHub Actions workflow that builds and deploys your docs on every push to `main`.

**Important:** You must enable GitHub Pages in your repo settings before the workflow will deploy:

1. Go to **Settings** > **Pages**
2. Under **Source**, select **GitHub Actions**
3. Commit and push — the workflow handles the rest

### Build locally

```bash
npx doxla build
```

This discovers all markdown and MDX files, builds a static docs site, and outputs it to `doxla-dist/`.

## Features

- Automatic `.md` and `.mdx` file discovery (respects `.gitignore`-style patterns)
- MDX support with built-in components (`<Callout>`) and JSX expressions
- Beautiful React-based docs viewer with sidebar navigation
- Full-text search across all documents
- Syntax highlighting for code blocks
- GitHub Flavored Markdown (tables, task lists, strikethrough)
- Responsive layout
- Zero configuration required

## CLI Options

### `doxla init`

Creates `.github/workflows/doxla.yml` for automatic GitHub Pages deployment.

### `doxla build`

| Option | Default | Description |
|--------|---------|-------------|
| `-o, --output <dir>` | `doxla-dist` | Output directory |
| `-r, --root <dir>` | `.` | Root directory to scan for markdown |
| `--base-path <path>` | `/` | Base path for GitHub Pages (e.g. `/my-repo`) |

## How It Works

1. **Discover** - Scans your repo for `.md` and `.mdx` files (excluding `node_modules`, `.git`, etc.)
2. **Manifest** - Reads each file, extracts titles, and generates a JSON manifest
3. **Build** - Copies the built-in React app template, injects the manifest, and runs `vite build`
4. **Output** - Produces a static site ready for any hosting

## Development

```bash
pnpm install
pnpm build        # Build the CLI
pnpm test         # Run tests
```

## License

MIT
