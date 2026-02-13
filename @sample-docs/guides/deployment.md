# Deployment Guide

## Deployment Methods

### CLI Deploy

The simplest way to deploy:

```bash
acme deploy
```

This bundles your source code, uploads it, and performs a rolling deployment.

### CI/CD Deploy

Example GitHub Actions workflow:

```yaml
name: Deploy Widget
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - run: npm ci
      - run: npm test
      - run: npx @acme/widget-cli deploy
        env:
          ACME_TOKEN: ${{ secrets.ACME_TOKEN }}
```

## Deployment Strategies

### Rolling (Default)

New version is gradually rolled out. Traffic is shifted over 5 minutes.

```bash
acme deploy --strategy rolling
```

### Instant

Immediately switches all traffic to the new version.

```bash
acme deploy --strategy instant
```

### Canary

Routes 10% of traffic to the new version for validation.

```bash
acme deploy --strategy canary --canary-percent 10 --canary-duration 30m
```

## Rollbacks

Roll back to the previous deployment:

```bash
acme rollback
```

Or target a specific deployment:

```bash
acme rollback --target dep_xyz789
```

## Multi-Region

Deploy to multiple regions for lower latency:

```json
{
  "region": ["us-east-1", "eu-west-1", "ap-southeast-1"]
}
```

Traffic is automatically routed to the nearest region.
