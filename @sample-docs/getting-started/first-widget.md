# Your First Widget

This guide walks you through building a simple "Hello World" widget.

## Create the Widget

Open `src/index.ts` and replace the contents:

```typescript
import { Widget, Request, Response } from "@acme/widget-sdk";

const widget = new Widget({
  name: "hello-world",
  version: "1.0.0",
});

widget.handle("greet", async (req: Request): Promise<Response> => {
  const name = req.params.name || "World";
  return {
    status: 200,
    body: { message: `Hello, ${name}!` },
  };
});

export default widget;
```

## Test Locally

Start the development server:

```bash
acme dev
```

Send a test request:

```bash
curl http://localhost:8080/greet?name=Developer
# {"message":"Hello, Developer!"}
```

## Deploy

When you're ready, deploy to the platform:

```bash
acme deploy
```

You'll get a live URL:

```
✓ Deployed to https://hello-world.acme.app
```

## What's Next?

- Learn about [event handlers](../guides/event-handlers.md)
- Explore the [REST API](../api/rest-api.md)
- Read about [configuration options](configuration.md)
