# Contributing to Doxla

Contributions are welcome! Whether it's bug fixes, new features, documentation improvements, or anything else — we're happy to accept PRs.

## Getting Started

1. Fork the repository and clone your fork.
2. Install dependencies: `pnpm install`
3. Create a branch for your change: `git checkout -b feat/my-feature`
4. Make your changes and ensure tests pass: `pnpm test`
5. Open a pull request against `main`.

## Pull Requests

We use a PR-based workflow. Please:

- Keep PRs focused on a single change.
- Include tests for new functionality.
- Ensure `pnpm test` and `pnpm build` pass before submitting.

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) for semantic-release. Prefix your commit messages accordingly:

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `ci:` — CI/CD changes
- `refactor:` — Code restructuring without behaviour change
- `test:` — Adding or updating tests

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
