# ==============================================================================
# 📦 @node-yalc Standalone Microservice (Zero NestJS) Dockerfile
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY auth/ ./auth/
COPY database/ ./database/
COPY errors/ ./errors/
COPY cqrs/ ./cqrs/
COPY logger/ ./logger/
COPY tracing/ ./tracing/
COPY resilience/ ./resilience/
COPY storage/ ./storage/
COPY config/ ./config/
COPY common/ ./common/
COPY types/ ./types/
COPY interfaces/ ./interfaces/
COPY types-extends/ ./types-extends/
COPY utils/ ./utils/
COPY examples/standalone-microservice/ ./examples/standalone-microservice/

RUN npm install -g pnpm && pnpm install --frozen-lockfile=false
RUN pnpm --filter @node-yalc/standalone-microservice build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app ./

EXPOSE 4000

CMD ["node", "examples/standalone-microservice/dist/index.js"]
