---
id: feature-NN       # e.g. auth-01
feature: feature     # folder name in docs/features/
title: Short stage name
writer: Slava        # who writes the production code: Slava (backend/src/main) | agent (frontend, docs)
tests: tester        # who writes the tests first: tester (backend/src/test) | none (frontend: lint + build + eye check)
area: backend        # backend | frontend | docs
branch: task/feature-NN-short-name
status: draft        # draft | approved | in progress | done
---
<!--
How to use: copy to docs/features/<feature>/NN-short-name.md and fill every section. Empty section = stage is not ready.
The stage file is the task: the only thing the doer knows about the work, besides AGENTS.md and the feature hub.
Written by the task-writer together with Slava; Slava approves it (status: approved) before work starts.
The doer never changes the sections above "Status" — only the "Status" section, after each step (AGENTS.md → "Work protocol").
-->

Feature hub: [`README.md`](README.md)

## Who writes what
- Production code (`backend/src/main/` or `frontend/`): **Slava** | **frontend-dev agent**
- Tests first (`backend/src/test/`): **tester agent** | none
- Help: **mentor** (explains, never writes) · Review: **reviewer** · Merge: **Slava**

## Goal
One or two sentences: what must be true after this stage.

## Context
- PRD: `docs/PRD.md` → section (product decisions). Details: `docs/reference/technical-spec.md` → section → item
  (every cited heading must exist).
- Earlier stages or code to read first: ...

## Allowed / not allowed (on top of AGENTS.md)
- Allowed to change: `path/...`
- Not allowed: ...
- If `writer: Slava` — agents explain, write tests in `backend/src/test/`, review. They do not edit `backend/src/main/`.

## Acceptance criteria
Each criterion is a checkable statement with a label:
`[auto]` — a command or test proves it (name the test or command);
`[judge]` — only visible by reading the code (the reviewer checks it and cites `file:line`).
1. [auto] `./mvnw verify` is green; test `...Test#...` covers ...
2. [judge] ...

## Check by eye (Slava)
What to open or click to say "I like it" (page, request in Postman/curl, screenshot).
- [ ] ...

## Out of scope
What NOT to do in this stage (and which later stage does it).
- ...

## Status
Updated by whoever works on the stage, after each step (tests written, code green, review done).
- **Done:** —
- **Left:** everything
- **Risks / questions:** —
