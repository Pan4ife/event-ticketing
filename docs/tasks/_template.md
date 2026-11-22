---
id: 000
title: Short task name
writer: Slava        # who writes the production code: Slava (backend/src/main) | agent (frontend, tests, docs)
area: backend        # backend | frontend | docs
branch: task/000-short-name
---
<!--
How to use: copy to docs/tasks/NNN-short-name.md and fill every section. Empty section = task is not ready.
The task is the only thing the doer knows about the work. Written by an agent together with Slava.
The doer does not change this file while working on it.
-->

## Goal
One or two sentences: what must be true after this task.

## Context
- PRD: `docs/PRD.md` → section name → item (the section must exist).
- Earlier tasks or code to read first: ...

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
What NOT to do in this task (and which later task will do it).
- ...
