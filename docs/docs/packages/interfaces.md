---
id: interfaces
title: "@node-yalc/interfaces"
sidebar_position: 2
---

# `@node-yalc/interfaces`

Abstract domain contracts defining logger behaviors, event dispatching, and application lifecycle providers.

## API Reference & Code Examples

```typescript
import { ILogger, IEventDispatcher } from '@node-yalc/interfaces';

export class DomainService {
  constructor(
    private readonly logger: ILogger,
    private readonly eventBus: IEventDispatcher
  ) {}

  async execute(actionName: string): Promise<void> {
    this.logger.info(`Executing domain action: ${actionName}`);
    await this.eventBus.dispatch({ type: 'ACTION_EXECUTED', payload: { actionName } });
  }
}
```
