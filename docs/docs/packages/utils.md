---
id: utils
title: "@node-yalc/utils"
sidebar_position: 5
---

# `@node-yalc/utils`

Pure utility functions for object mapping, async concurrency control (`p-map`), and serialization.

## API Reference & Code Examples

```typescript
import { runConcurrently, sanitizeObject } from '@node-yalc/utils';

const userIds = ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7'];

// Execute async tasks with max 3 concurrent operations
const results = await runConcurrently(userIds, async (id) => {
  return await fetchUserData(id);
}, { concurrency: 3 });
```
