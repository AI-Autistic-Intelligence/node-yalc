---
id: http-client
title: HTTP & RPC Transports
sidebar_position: 1
---

# HTTP & RPC Transports

The `@yalc/transports` module provides a high-performance HTTP client optimized for microservice-to-microservice communication, alongside utilities for RPC calls.

## HTTP Client

Our customized HTTP client automatically handles:
- Retries with exponential backoff.
- Circuit breaking integration.
- Distributed tracing header propagation (B3 / W3C).

```typescript
import { HttpClient } from '@yalc/transports/http';

const client = new HttpClient({ baseURL: 'http://api.internal' });

const response = await client.get('/users/1', {
  retries: 3,
  timeout: 5000,
});
```
