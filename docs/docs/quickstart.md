---
id: quickstart
title: Quickstart & Integration
sidebar_position: 2
---

# Quickstart & Integration Guide

Learn how to build, publish, and embed `@node-yalc` packages into consumer applications.

## 1. Building Workspace Packages

```bash
npm run build
```

## 2. Local Yalc Publishing

```bash
node -e "['types', 'interfaces', 'types-extends', 'logger', 'utils', 'errors', 'event-manager', 'common', 'aws-helpers'].forEach(p => require('child_process').execSync('npx yalc publish', { cwd: p }))"
```

## 3. Git Submodule Setup

```bash
git submodule add https://github.com/AI-Autistic-Intelligence/node-yalc.git node-yalc
git submodule update --init --recursive
```
