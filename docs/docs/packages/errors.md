---
id: errors
title: "@node-yalc/errors"
sidebar_position: 4
---

# `@node-yalc/errors`

Standardized application error hierarchy ensuring safe error extraction and stack trace isolation.

## API Reference & Code Examples

```typescript
import { AppError, DomainError, ValidationError, NotFoundError } from '@node-yalc/errors';

export function findUserOrThrow(id: string) {
  if (!id) {
    throw new ValidationError('User ID parameter is required');
  }

  const user = null; // Simulation
  if (!user) {
    throw new NotFoundError(`User with ID ${id} was not found`, { id });
  }

  return user;
}
```
