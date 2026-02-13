# REST API Reference

Base URL: `https://api.acme.app/v2`

All requests require an `Authorization: Bearer <token>` header.

## Widgets

### List Widgets

```
GET /widgets
```

**Response:**

```json
{
  "widgets": [
    {
      "id": "wgt_abc123",
      "name": "hello-world",
      "status": "active",
      "url": "https://hello-world.acme.app",
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1
}
```

### Create Widget

```
POST /widgets
```

**Body:**

```json
{
  "name": "my-new-widget",
  "region": "us-east-1",
  "runtime": "node22"
}
```

### Get Widget

```
GET /widgets/:id
```

### Delete Widget

```
DELETE /widgets/:id
```

Returns `204 No Content` on success.

## Deployments

### Deploy

```
POST /widgets/:id/deploy
Content-Type: multipart/form-data
```

Upload a `.tar.gz` bundle of your widget source.

### Rollback

```
POST /widgets/:id/rollback
```

```json
{
  "target_deployment": "dep_xyz789"
}
```

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `GET` requests | 1000/min |
| `POST /deploy` | 10/min |
| `DELETE` | 100/min |

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1706789400
```
