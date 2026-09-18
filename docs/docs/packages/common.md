---
id: common
title: "@node-yalc/common"
sidebar_position: 8
---

# `@node-yalc/common`

Shared DTO schemas, standard HTTP status enumerations, and system-wide constants.

## API Reference & Code Examples

```typescript
import { HttpStatusCodes, BasePaginationDTO } from '@node-yalc/common';

export class UserQueryFilterDTO extends BasePaginationDTO {
  searchQuery?: string;
}

console.log(HttpStatusCodes.OK); // 200
```
