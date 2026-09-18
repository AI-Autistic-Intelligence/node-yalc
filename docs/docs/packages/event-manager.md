---
id: event-manager
title: "@node-yalc/event-manager"
sidebar_position: 6
---

# `@node-yalc/event-manager`

In-memory and distributed event bus dispatcher supporting typed payloads and subscriber handlers.

## API Reference & Code Examples

```typescript
import { YalcEventBus } from '@node-yalc/event-manager';

const bus = new YalcEventBus();

// Subscribe to domain event
bus.subscribe<{ orderId: string; amount: number }>('order.created', async (event) => {
  console.log(`Order ${event.orderId} created for $${event.amount}`);
});

// Publish domain event
await bus.publish('order.created', { orderId: 'ord-88', amount: 199.99 });
```
