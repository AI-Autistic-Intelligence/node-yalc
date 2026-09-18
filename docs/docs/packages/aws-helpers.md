---
id: aws-helpers
title: "@node-yalc/aws-helpers"
sidebar_position: 7
---

# `@node-yalc/aws-helpers`

AWS SDK v3 utility wrappers for S3 file uploads, SSM Parameter Store parameter resolution, and AWS Lambda event adapters.

## API Reference & Code Examples

```typescript
import { YalcS3Client, YalcSSMStore } from '@node-yalc/aws-helpers';

// Fetch parameter from AWS SSM Parameter Store
const dbPassword = await YalcSSMStore.getParameter('/prod/database/password', true);

// Upload buffer to S3
const s3 = new YalcS3Client({ region: 'eu-west-1' });
await s3.uploadFile('my-bucket', 'reports/jan.pdf', pdfBuffer, 'application/pdf');
```
