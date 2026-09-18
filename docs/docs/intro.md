---
id: intro
title: Overview & Architecture
sidebar_position: 1
---

# `@node-yalc` Overview & Architecture

`@node-yalc` is a pure TypeScript, zero-overhead shared core utilities suite designed to decouple domain models, error hierarchies, logging, and cloud helpers from web framework lifecycles (such as NestJS, Express, or Fastify).

## Architectural Principles

1. **100% Framework Independence**: Contains zero bindings to web frameworks.
2. **Deterministic Submodule Binding**: Embedded as a Git Submodule or published via Yalc.
3. **Layered Isolation**: Strict separation between type primitives, core utilities, infrastructure services, and cloud adapters.
