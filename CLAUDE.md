# Doxla

Doxla is a CLI tool that discovers `.md` and `.mdx` files in a repository, builds a static React-based documentation viewer, and deploys it to GitHub Pages. Published to npm as `doxla`.

## Commands

```bash
pnpm install          # Install dependencies
pnpm build            # Build the CLI with tsup
pnpm test             # Run all tests (vitest)
pnpm test:watch       # Run tests in watch mode
```

To test the full build pipeline against the sample docs:

```bash
node dist/cli/index.js build --root @sample-docs --output doxla-dist
```

## Architecture

The project has two separate codebases in one repo:

### CLI (`src/cli/`)

Node.js CLI built with Commander, bundled by tsup. Entry: `src/cli/index.ts`.

- `lib/discover.ts` — Finds `.md`/`.mdx` files using fast-glob, ignoring `node_modules`, `.git`, `dist`, etc.
- `lib/manifest.ts` — Reads files, extracts titles from `# headings`, generates slugs, produces a JSON manifest.
- `lib/build-app.ts` — Copies the viewer app template to a temp dir, injects the manifest, runs `vite build`, copies output.
- `lib/template.ts` — Resolves the path to `src/app/` (the viewer template).
- `commands/build.ts` — The `doxla build` command.
- `commands/init.ts` — The `doxla init` command (creates GitHub Actions workflow).

### Viewer App (`src/app/`)

A standalone React + Vite + Tailwind app. Has its own `package.json`. This is the template that gets built with user docs injected as `manifest.json`.

- `App.tsx` — Hash-based routing (index, doc, search).
- `components/MarkdownRenderer.tsx` — Renders `.md` files using `react-markdown` + `remark-gfm`.
- `components/MdxRenderer.tsx` — Renders `.mdx` files using `@mdx-js/mdx` `evaluate()` at runtime. Wrapped in `MdxErrorBoundary`.
- `components/mdx/Callout.tsx` — Built-in `<Callout type="info|warning|danger">` component for MDX.
- `components/DocPage.tsx` — Detects format from file path, routes to correct renderer, shows `.md`/`.mdx` badge.
- `lib/doc-links.ts` — Shared utility for resolving relative `.md`/`.mdx` links to app routes.

### Tests (`tests/`)

Vitest with two environments: `node` for CLI tests, `jsdom` for app component tests (configured via `environmentMatchGlobs` in `vitest.config.ts`).

- `tests/cli/` — Tests for discover, manifest, build, init.
- `tests/app/` — Tests for React components (MarkdownRenderer, MdxRenderer, Callout, FileTree, IndexPage).

### Sample Docs (`@sample-docs/`)

Example documentation files used for manual testing. Not included in the npm package.

## Key Patterns

- **ESM only** — `"type": "module"` throughout. Use `.js` extensions in relative imports within CLI code.
- **Two package.jsons** — Root has CLI deps + devDeps for testing. `src/app/package.json` has viewer app deps (installed at build time in a temp dir).
- **No shared runtime code** — CLI and viewer app don't share code at runtime. The manifest JSON is the interface between them.
- **Slug generation** — File paths become URL slugs: strip `.md`/`.mdx`, lowercase, replace non-alphanumeric with `-`.
- **MDX security** — `evaluate()` executes arbitrary JS. Only trusted content from the user's own repo should be compiled. The `resolveDocLink` function guards against path traversal.

## Conventions

- TypeScript strict mode.
- Commit messages follow conventional commits (`feat:`, `fix:`, `ci:`, etc.) for semantic-release.
- Tests use temp directories with random names for filesystem tests, cleaned up in `afterEach`.
- React components use Tailwind classes via `clsx`/`tailwind-merge` (utility in `src/app/src/lib/utils.ts`).
