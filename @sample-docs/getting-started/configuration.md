# Configuration

Widgets are configured via `acme.config.json` in the project root.

## Full Reference

```json
{
  "name": "my-widget",
  "version": "1.0.0",
  "runtime": "node22",
  "region": "us-east-1",
  "memory": 256,
  "timeout": 30,
  "env": {
    "DATABASE_URL": "@secret/db-url",
    "LOG_LEVEL": "info"
  },
  "routes": [
    { "path": "/api/*", "handler": "handlers/api" },
    { "path": "/webhook", "handler": "handlers/webhook", "method": "POST" }
  ]
}
```

## Options

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | string | *required* | Unique widget identifier |
| `version` | string | `"1.0.0"` | Semantic version |
| `runtime` | string | `"node22"` | Runtime environment |
| `region` | string | `"us-east-1"` | Deployment region |
| `memory` | number | `256` | Memory allocation in MB |
| `timeout` | number | `30` | Max execution time in seconds |
| `env` | object | `{}` | Environment variables |
| `routes` | array | `[]` | URL route mappings |

## Secrets

Reference secrets with the `@secret/` prefix in environment variables. Manage secrets via the CLI:

```bash
acme secrets set db-url "postgres://..."
acme secrets list
```

> **Note:** Secrets are encrypted at rest and only decrypted at runtime within your widget's execution context.
