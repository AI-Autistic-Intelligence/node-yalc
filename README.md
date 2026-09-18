# 📦 `@node-yalc` — Shared Node.js Core Utilities

<p align="center">
  <b>Framework-Agnostic, Zero-Overhead Pure TypeScript Shared Library Collection</b><br/>
  <i>Framework-Independent Domain Core for Microservices, Ferrox-Node Applications, and NestJS Services.</i>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/AGPL-3.0"><img src="https://img.shields.io/badge/License-AGPL--3.0-blue.svg" alt="License: AGPL-3.0" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg" alt="TypeScript" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18%2B-green.svg" alt="Node.js" /></a>
  <a href="https://github.com/wix/yalc"><img src="https://img.shields.io/badge/Local%20Publishing-Yalc%20Store-orange.svg" alt="Yalc Store" /></a>
  <a href="https://github.com/pinojs/pino"><img src="https://img.shields.io/badge/Logger-Pino-red.svg" alt="Pino Logger" /></a>
</p>

<p align="center">
  <a href="#-philosophy--architectural-rationale">Philosophy</a> •
  <a href="#-architectural-comparison-node-yalc-vs-traditional-shared-libs">Architectural Comparison</a> •
  <a href="#-the-onion-core-architecture">Core Architecture</a> •
  <a href="#-9-package-workspace-inventory">9-Package Inventory</a> •
  <a href="#-building--publishing-workflow">Building & Yalc</a> •
  <a href="#-git-submodule-integration">Git Submodule Integration</a>
</p>

---

## 🎯 Philosophy & Architectural Rationale

In modern backend architectures, sharing code across microservices or between different web frameworks (e.g. **Ferrox-Node** and **NestJS**) often leads to severe architectural anti-patterns:
1. **Framework Pollution**: Importing framework-specific packages (such as `@nestjs/common`) into base domain models or generic utility libraries, introducing heavy unused transitive dependencies.
2. **Duplicate Code Drift**: Copy-pasting error classes, logger helpers, or AWS SDK wrappers across repositories.
3. **Symlink Fragility**: Using `npm link` or `yarn link` during local development, causing broken module resolution, duplicate `node_modules`, and symbol mismatches.

### **`@node-yalc` solves these problems by acting as a 100% framework-agnostic, pure TypeScript shared core.**

`@node-yalc` contains zero web framework dependencies (no NestJS, Express, or Fastify bindings). It can be embedded cleanly into any Node.js environment as a **Git Submodule** or published locally via **Yalc** for rapid local iteration.

---

## 📊 Architectural Comparison: `@node-yalc` vs Traditional Shared Libs

| Feature / Metric | 📦 `@node-yalc/*` | 🧰 Monorepo Shared Package | 📋 Copy-Paste Helpers |
|---|---|---|---|
| **Framework Dependencies** | **0% (Pure Node.js & TypeScript)** | Frequently Tight to Framework | Variable |
| **Portability across Frameworks** | **Universal (Ferrox-Node & NestJS)** | Hard to decouple | High Maintenance |
| **Local Dev Iteration** | **Yalc Local Store (`npx yalc publish`)** | NPM Workspaces / Symlinks | Manual Copying |
| **Security Redaction** | **Built-in Pino Redaction Rules** | Custom Implementation | None |
| **Standardized Error Hierarchy** | **Native `AppError` & `DomainError`** | Variable | Custom / Swallowed |
| **Version Controlled Binding** | **Git Submodule Commit Hash** | Git Tag / NPM Registry | Manual Drift |

---

## 🧅 The Onion Core Architecture

`@node-yalc` structures fundamental domain primitives into non-overlapping conceptual layers:

```
       +---------------------------------------------------------+
       |           Framework Level (Ferrox-Node / NestJS)        |
       +---------------------------------------------------------+
                                    |
                                    v
       +---------------------------------------------------------+
       |   1. Interfaces & Types Layer                           |
       |      - `@node-yalc/types`, `@node-yalc/interfaces`      |
       |      - Base domain contracts, primitives, type guards   |
       +---------------------------------------------------------+
                                    |
                                    v
       +---------------------------------------------------------+
       |   2. Core Utilities & Errors Layer                      |
       |      - `@node-yalc/errors`, `@node-yalc/utils`          |
       |      - `AppError` hierarchy, async `p-map`, mapping      |
       +---------------------------------------------------------+
                                    |
                                    v
       +---------------------------------------------------------+
       |   3. Infrastructure Services Layer                      |
       |      - `@node-yalc/logger`, `@node-yalc/event-manager`  |
       |      - Pino structured logging & typed event pub/sub    |
       +---------------------------------------------------------+
                                    |
                                    v
       +---------------------------------------------------------+
       |   4. Integration & Cloud Layer                          |
       |      - `@node-yalc/aws-helpers`, `@node-yalc/common`    |
       |      - AWS SDK v3 wrappers (SSM, S3, Lambda)            |
       +---------------------------------------------------------+
```

---

## 📦 9-Package Workspace Inventory

The `@node-yalc` repository is structured as an NPM workspace containing **9 specialized packages**:

| Package Name | Directory | Description |
| :--- | :--- | :--- |
| **`@node-yalc/types`** | `types/` | Core TypeScript type definitions, primitive aliases, and utility generics. |
| **`@node-yalc/interfaces`** | `interfaces/` | Abstract domain contracts, logger interfaces, and event provider specs. |
| **`@node-yalc/types-extends`** | `types-extends/` | Extended type utilities, reflection helpers, and advanced type guards. |
| **`@node-yalc/logger`** | `logger/` | High-performance Pino-based structured logger with sensitive data redaction. |
| **`@node-yalc/utils`** | `utils/` | Pure utility functions for object mapping, async concurrency (`p-map`), and serialization. |
| **`@node-yalc/errors`** | `errors/` | Safe application error hierarchy (`AppError`, `DomainError`, `ValidationError`). |
| **`@node-yalc/event-manager`** | `event-manager/` | In-memory & distributed event bus infrastructure with typed payloads. |
| **`@node-yalc/common`** | `common/` | Shared DTO schemas, constants, and base interfaces. |
| **`@node-yalc/aws-helpers`** | `aws-helpers/` | AWS SDK v3 utility wrappers for S3, SSM parameter store, and Lambda handlers. |

---

## 🚀 Building & Publishing Workflow

### 1. Compile All Workspace Packages
Build output JavaScript and `.d.ts` declaration files for all 9 packages:

```bash
npm run build
```

This runs `tsc` and executes `build.mjs` to distribute generated artifacts into each package's `dist/src/` folder.

### 2. Publish to Local Yalc Store
Publish all workspace packages to your local `~/.yalc` store:

```bash
node -e "['types', 'interfaces', 'types-extends', 'logger', 'utils', 'errors', 'event-manager', 'common', 'aws-helpers'].forEach(p => require('child_process').execSync('npx yalc publish', { cwd: p }))"
```

---

## 🔗 Git Submodule Integration

To include `@node-yalc` as a clean submodule inside any project:

```bash
# Add submodule
git submodule add https://github.com/AI-Autistic-Intelligence/node-yalc.git node-yalc

# Sync and update
git submodule sync
git submodule update --init --recursive
```

---

## 📜 License

AGPL-3.0-or-later © AI Autistic Intelligence Team
