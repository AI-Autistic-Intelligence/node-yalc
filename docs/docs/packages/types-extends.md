---
id: types-extends
title: "@node-yalc/types-extends"
sidebar_position: 9
---

# `@node-yalc/types-extends`

Advanced type guards, runtime assertion helpers, and branded type generators.

## API Reference & Code Examples

```typescript
import { isDefined, isObject, isString } from '@node-yalc/types-extends';

const input: unknown = { name: 'Ferrox' };

if (isObject(input) && isString(input.name)) {
  console.log(input.name.toUpperCase());
}
```
