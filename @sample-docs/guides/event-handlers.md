# Event Handlers

Widgets respond to events through handler functions. This guide covers the different event types and how to handle them.

## Request Events

The most common event type. Triggered by HTTP requests to your widget's URL.

```typescript
import { Widget } from "@acme/widget-sdk";

const widget = new Widget({ name: "my-widget" });

widget.handle("users/list", async (req) => {
  const users = await db.query("SELECT * FROM users LIMIT $1", [
    req.query.limit || 10,
  ]);

  return { status: 200, body: { users } };
});

widget.handle("users/create", async (req) => {
  if (req.method !== "POST") {
    return { status: 405, body: { error: "Method not allowed" } };
  }

  const { name, email } = req.body;
  const user = await db.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );

  return { status: 201, body: { user } };
});
```

## Scheduled Events

Run code on a cron schedule:

```typescript
widget.schedule("cleanup", "0 2 * * *", async () => {
  // Runs daily at 2 AM
  await db.query("DELETE FROM sessions WHERE expires_at < NOW()");
  console.log("Expired sessions cleaned up");
});
```

## Webhook Events

Handle incoming webhooks from third-party services:

```typescript
widget.webhook("stripe", async (event) => {
  switch (event.type) {
    case "payment_intent.succeeded":
      await processPayment(event.data);
      break;
    case "customer.subscription.deleted":
      await cancelSubscription(event.data);
      break;
  }
});
```

## Error Handling

Wrap handlers with error boundaries:

```typescript
widget.handle("risky-operation", async (req) => {
  try {
    const result = await riskyOperation(req.body);
    return { status: 200, body: result };
  } catch (error) {
    console.error("Operation failed:", error);
    return {
      status: 500,
      body: { error: "Internal server error" },
    };
  }
});
```

## Middleware

Apply middleware to all handlers:

```typescript
widget.use(async (req, next) => {
  const start = Date.now();
  const response = await next(req);
  console.log(`${req.method} ${req.path} - ${Date.now() - start}ms`);
  return response;
});
```
