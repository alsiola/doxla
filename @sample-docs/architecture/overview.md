# Architecture Overview

## System Design

The Acme Widget Platform is built on a microservices architecture with the following key components:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Edge CDN   │────▶│  API Gateway │────▶│ Widget Engine │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                     │
                     ┌──────┴──────┐        ┌─────┴─────┐
                     │  Auth Svc   │        │  Runtime   │
                     └─────────────┘        │  Sandbox   │
                                            └───────────┘
                                                  │
                     ┌────────────────────────────┼────────┐
                     │              │              │        │
               ┌─────┴─────┐ ┌─────┴─────┐ ┌─────┴─────┐  │
               │ PostgreSQL │ │   Redis   │ │    S3     │  │
               └───────────┘ └───────────┘ └───────────┘  │
                                                    ┌──────┴──┐
                                                    │ Metrics  │
                                                    └─────────┘
```

## Components

### Edge CDN

Global content delivery network that provides:

- SSL termination
- DDoS protection
- Static asset caching
- Geographic routing

### API Gateway

Central entry point for all API traffic:

- Request routing and load balancing
- Rate limiting
- Request/response transformation
- API versioning

### Widget Engine

The core compute layer that executes widget code:

- Provisions isolated runtime sandboxes per widget
- Manages widget lifecycle (start, stop, scale)
- Handles auto-scaling based on traffic patterns
- Provides resource limits (CPU, memory, network)

### Runtime Sandbox

Each widget runs in an isolated V8 isolate with:

- 256 MB default memory limit
- 30 second execution timeout
- Network access controls
- Filesystem isolation

## Data Flow

1. Request arrives at Edge CDN
2. CDN routes to nearest API Gateway
3. Gateway authenticates and rate-limits
4. Request forwarded to Widget Engine
5. Engine locates or provisions sandbox
6. Widget code executes in sandbox
7. Response flows back through the chain

## Scaling

The platform auto-scales based on:

- **Request rate** - More instances spin up as traffic increases
- **Latency** - Additional capacity when p99 exceeds thresholds
- **Scheduled** - Pre-warm capacity for known traffic patterns

Scale-to-zero is supported: widgets with no traffic consume no resources.
