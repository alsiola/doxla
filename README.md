# doxla

Improve documentation discoverability within repos. Doxla discovers all `.md` files in your repository, builds a beautiful docs viewer, and deploys it to GitHub Pages.

## Quick Start

### Deploy to GitHub Pages

Run this in your repo to set up automatic deployment:

```bash
npx doxla init
```

This creates a GitHub Actions workflow that builds and deploys your docs on every push to `main`. Just enable GitHub Pages in your repo settings (Settings > Pages > Source: **GitHub Actions**).

### Build locally

```bash
npx doxla build
```

This discovers all markdown files, builds a static docs site, and outputs it to `doxla-dist/`.

## Features

- Automatic markdown file discovery (respects `.gitignore`-style patterns)
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

1. **Discover** - Scans your repo for `.md` files (excluding `node_modules`, `.git`, etc.)
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
