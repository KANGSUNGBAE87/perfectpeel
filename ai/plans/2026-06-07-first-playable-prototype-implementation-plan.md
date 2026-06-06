# First Playable Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the V0 feel-proof prototype for `스티커떼기`: one sticker, one surface, drag-to-peel, tension feedback, tear/residue scoring, i18n, and platform-ready no-op adapters.

**Architecture:** Pure TypeScript owns peel physics, game state, scoring, i18n, and platform adapters. Canvas rendering consumes state but does not calculate scores. Platform SDKs are not imported by product/game logic.

**Tech Stack:** Vite, TypeScript, Vitest, Canvas 2D.

---

## Tasks

### Task 1: Project And Test Harness

- [x] Add `package.json`, TypeScript, Vite, and Vitest configuration.
- [x] Add failing unit tests for peel physics, scoring, i18n, and platform adapter readiness.
- [x] Run tests and confirm expected missing-module failures.

### Task 2: Core Logic

- [x] Implement pure `peelPhysics` angle/speed/tension logic.
- [x] Implement `gameState` scoring and rating.
- [x] Implement `i18n` dictionaries.
- [x] Implement platform adapter interfaces and no-op adapters.
- [x] Run unit tests and confirm pass.

### Task 3: Canvas Prototype

- [x] Implement app shell, Canvas renderer, pointer input, result overlay, retry, language switch, audio/haptic adapter calls.
- [x] Keep UI object-first and avoid SDK imports.
- [x] Run build.

### Task 4: QA

- [x] Run unit tests.
- [x] Run production build.
- [x] Start local dev server.
- [x] Use browser QA for desktop and 390px mobile viewports.
- [x] Log implementation session notes.
