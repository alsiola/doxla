# Why Doxla?

Documentation is most valuable when it lives next to the code it describes. But keeping docs in your repo has always come with a usability problem: markdown files are hard to browse, easy to lose track of, and invisible to people who aren't already looking for them.

Doxla fixes the last mile. It takes the markdown that's already in your repository and turns it into a readable, searchable docs site — with zero configuration.

## The problem with docs outside the repo

Teams scatter documentation across tools: Notion, Google Docs, Confluence, wikis, shared drives. Each one adds a layer of indirection between the documentation and the code it describes.

**Notion and Google Docs** are great writing tools, but they create a split-brain problem. The docs live in one place, the code lives in another, and nobody maintains the link between them. When the code changes, the docs don't. When the docs move, the bookmarks break. New team members don't know which Notion page is current and which is six months stale.

**Scattered in-repo docs** are a different kind of problem. The files exist in the right place — next to the code — but nobody can find them. A `docs/` folder at the root, a `README.md` three directories deep, an `architecture.md` that only one person knows about. The documentation is *there*, but it's invisible.

The common thread: the docs exist, but the discoverability is broken.

## The UX problem with in-repo markdown

Even when you know exactly which `.md` file you want, reading it in a development environment is a poor experience.

**Raw markdown in editors is noisy.** Headings, links, code blocks, and tables are all just syntax characters. You can read it, but it takes effort — especially for longer documents with diagrams or complex formatting.

**IDE preview plugins help, but not enough.** VS Code has a built-in markdown preview. Other editors need plugins. Either way, you're relying on a secondary feature of a tool built for editing code, not reading prose. The preview is a sidebar panel competing for screen space with your actual work.

**Not every editor has a viewer at all.** Terminal-based editors, lightweight editors, and browser-based code views (GitHub's file browser, PR review screens) render markdown as plaintext. Contributors reviewing a PR that updates documentation are reading raw markdown in a diff view.

The result: people avoid writing docs because they know nobody will read them comfortably, and people avoid reading docs because the experience is friction-heavy.

## AI changes the equation

The rise of AI coding assistants makes in-repo documentation dramatically more valuable.

AI agents — Claude Code, Copilot, Cursor, and others — work with what's in the repository. When they need to understand how a system works, they read the files in front of them. If your architecture decisions, API contracts, setup instructions, and design rationale are captured in markdown files alongside the code, the AI has immediate access to that context.

Documentation that lives in Notion or Google Docs is invisible to these tools. An AI agent working in your codebase has no way to access your team's Confluence wiki. But a `CONTRIBUTING.md` in the root, an `architecture.md` in `docs/`, or a `README.md` in each package? That's context the agent can read, reference, and act on.

This creates a positive feedback loop:

1. **Better docs in the repo** means AI agents produce better code
2. **AI agents that understand the codebase** means fewer misguided PRs and less back-and-forth
3. **Less friction from AI-assisted development** means teams have more time to write and maintain docs

The documentation isn't just for humans anymore. It's for every agent that operates in your codebase.

## What Doxla does about it

Doxla doesn't change how you write documentation. You keep your `.md` files wherever they make sense in your repo. Doxla handles everything else:

- **Discovery**: finds every markdown file automatically (respects `.gitignore`)
- **Structure**: builds a navigable sidebar from your file tree
- **Search**: full-text search across all documents
- **Rendering**: clean typography, syntax-highlighted code blocks, GFM support
- **Deployment**: one command to set up GitHub Pages via Actions

The goal is to remove every excuse for not reading the docs. If the docs are in the repo and the site is always up to date, discoverability stops being a problem — for humans and for AI agents alike.

## The short version

Keep your docs next to your code. Doxla makes them readable.
