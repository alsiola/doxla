# Installation

## Prerequisites

- Node.js 20 or later
- npm, yarn, or pnpm

## Install the CLI

```bash
npm install -g @acme/widget-cli
```

Verify the installation:

```bash
acme --version
# acme-cli v2.3.0
```

## Authentication

Sign in to your Acme account:

```bash
acme login
```

This opens your browser for OAuth authentication. Once complete, your credentials are stored locally.

## Project Setup

Create a new widget project:

```bash
acme init my-widget
cd my-widget
```

This scaffolds a project with the following structure:

```
my-widget/
├── src/
│   ├── index.ts        # Widget entry point
│   ├── config.ts       # Widget configuration
│   └── handlers/       # Event handlers
├── tests/
├── acme.config.json    # Platform configuration
└── package.json
```

## Next Steps

Head to [Your First Widget](first-widget.md) to build something!
