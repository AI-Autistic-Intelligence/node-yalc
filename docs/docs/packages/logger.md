---
id: logger
title: "@node-yalc/logger"
sidebar_position: 3
---

# `@node-yalc/logger`

High-performance Pino-based structured logger with built-in sensitive data redaction.

## API Reference & Code Examples

```typescript
import { createYalcLogger } from '@node-yalc/logger';

const logger = createYalcLogger({
  level: 'debug',
  redact: ['password', 'authorization', 'creditCard.number']
});

logger.info('User authentication request received', {
  userId: 'usr-100',
  authorization: 'Bearer secret_token_12345' // Automatically redacted
});
```
