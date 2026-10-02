---
id: ci-cd
title: Deployment & CI/CD
sidebar_position: 1
---

# Deployment & CI/CD

Node-YALC projects typically run in containerized environments (Docker, Kubernetes). This section outlines the best practices for building and deploying Node-YALC applications.

## Docker Build

Use multi-stage builds to keep the final image minimal.

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
```

## Continuous Integration

Node-YALC provides automated linting and unit testing configurations out of the box. Ensure your CI pipelines execute `npm run lint` and `npm run test` before merging.
