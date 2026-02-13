# GraphQL API

> **Alpha:** This API is in alpha and may change without notice.

Endpoint: `https://api.acme.app/graphql`

## Schema

```graphql
type Widget {
  id: ID!
  name: String!
  status: WidgetStatus!
  url: String!
  region: String!
  deployments(last: Int = 10): [Deployment!]!
  metrics(period: MetricPeriod!): Metrics!
  createdAt: DateTime!
}

enum WidgetStatus {
  ACTIVE
  DEPLOYING
  STOPPED
  ERROR
}

type Deployment {
  id: ID!
  version: String!
  status: DeploymentStatus!
  createdAt: DateTime!
}

type Metrics {
  requests: Int!
  errors: Int!
  p50Latency: Float!
  p99Latency: Float!
}

type Query {
  widget(id: ID!): Widget
  widgets(first: Int, after: String): WidgetConnection!
}

type Mutation {
  createWidget(input: CreateWidgetInput!): Widget!
  deleteWidget(id: ID!): Boolean!
  deployWidget(id: ID!, version: String!): Deployment!
}
```

## Example Queries

### Get widget with recent deployments

```graphql
query {
  widget(id: "wgt_abc123") {
    name
    status
    deployments(last: 5) {
      id
      version
      status
      createdAt
    }
  }
}
```

### Get widget metrics

```graphql
query {
  widget(id: "wgt_abc123") {
    metrics(period: LAST_24H) {
      requests
      errors
      p50Latency
      p99Latency
    }
  }
}
```
