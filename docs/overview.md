---
id: overview
title: Overview
sidebar_position: 1
---

# Node-YALC Overview

**Node-YALC** is the pure Node.js/TypeScript foundation of the YALC ecosystem. Unlike [`nestjs-yalc`](/docs/nestjs-yalc/overview), which is tightly coupled to the NestJS dependency injection and module system, `node-yalc` provides framework-agnostic utilities, types, and base classes that can be used in any Node.js environment.

## Philosophy

The primary goal of `node-yalc` is to centralize core business logic, standard error definitions, and fundamental utilities so they can be shared across microservices, CLI tools, and background workers, regardless of the web framework being used.

It is designed to be:
- **Zero-Dependency (mostly)**: Keeps external dependencies to an absolute minimum to prevent dependency hell.
- **Framework Agnostic**: Usable in Express, Fastify, NestJS, or raw Node scripts.
- **Highly Typed**: Exposes rigorous TypeScript interfaces and types for the rest of the ecosystem.

## Key Modules

- **Errors**: A standardized hierarchy of `HttpError` classes (e.g., `BadRequestError`, `UnauthorizedError`) that carry metadata and can be safely serialized across service boundaries.
- **Logger**: A pure Pino wrapper that handles the formatting and configuration of JSON logs without relying on NestJS context.
- **Event Manager**: Generic EventEmitter wrappers and interfaces used to define strong contracts for event-driven architectures.
- **Types**: Shared TypeScript interfaces used across both [`ferrox-node`](/docs/ferrox-node/overview) and [`nestjs-yalc`](/docs/nestjs-yalc/overview).

## Integration with NestJS-YALC

In a typical enterprise setup, `node-yalc` is included as a Git Submodule within the [`nestjs-yalc`](/docs/nestjs-yalc/overview) repository. [`nestjs-yalc`](/docs/nestjs-yalc/overview) then provides the "glue" (Interceptors, Providers, Dynamic Modules) to inject these pure Node.js constructs into the NestJS lifecycle.

For example, a `BadRequestError` thrown from a pure domain function (using `node-yalc`) is automatically caught by the `YalcExceptionFilter` (in [`nestjs-yalc`](/docs/nestjs-yalc/overview)) and transformed into a standardized HTTP 400 response.
