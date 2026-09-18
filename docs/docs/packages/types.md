---
id: types
title: "@node-yalc/types"
sidebar_position: 1
---

# `@node-yalc/types`

Provides core TypeScript primitive aliases, utility generics, and type-level assertions used across domain contracts.

## API Reference & Code Examples

```typescript
import { Nullable, Optional, DeepPartial, UnboxPromise } from '@node-yalc/types';

export interface User {
  id: string;
  name: string;
  avatar: Nullable<string>;
  metadata: Optional<Record<string, any>>;
}

// Generics Usage
type PartialUser = DeepPartial<User>;
type AsyncResult = UnboxPromise<Promise<User>>;
```
