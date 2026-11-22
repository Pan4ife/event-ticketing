# AGENTS.md — rules for every AI agent in this repo

Read by Codex and Cursor directly, and by Claude Code through `CLAUDE.md`. These rules apply in every task.
A stage file (`docs/features/<feature>/NN-*.md`) may narrow them, never loosen them. Product truth: `docs/PRD.md`
(details: `docs/reference/technical-spec.md`). Map of all docs: `docs/README.md`.

## Who writes what

| Area | Who writes it | What agents do there |
|---|---|---|
| `backend/src/main/` (production backend code, config, migrations) | **Slava only** | Explain, give hints step by step, point to docs, review. **Never edit.** A hook blocks it (see "Checks"). |
| `backend/src/test/` | agents (tests first, from the task) | Write and fix tests. Never weaken or delete a test to make it pass. |
| `frontend/` | agents | Write code from the task; Slava reviews. |
| `docs/features/` (hubs, stage files), `docs/roadmap.md`, `docs/retro.md`, `docs/README.md`, `README.md`, reviews | agents | Write from the templates in `docs/features/`, keep status current by the "Work protocol", review code against the stage file and the PRD. |
| `docs/reference/` | nobody | Source material, kept unchanged. |
| `docs/PRD.md`, `AGENTS.md`, `CLAUDE.md`, `.claude/`, `.codex/`, `.cursor/`, `scripts/`, `.github/`, `pom.xml` | Slava | Propose changes in chat; edit only when Slava says yes for that one change. |

If backend code needs a change, write in chat what to change and why (file, method, reason) — Slava types it.

## How the process works

One stage = one session = one branch = one PR.
Roles live in `.claude/agents/` (instructions in `.claude/skills/`). Development runs in Claude Code; Codex and
Cursor were used once to check that these rules and the hook locks work for any agent (`docs/agents-setup.md`).

Backend task (writer: Slava)
1. task-writer: roadmap row -> feature hub + stage files in `docs/features/<feature>/`; Slava approves each stage
   before it starts.
2. tester: tests first in `backend/src/test/` - red.
3. Slava writes `backend/src/main/` until they are green; mentor explains and hints, never writes.
4. `./mvnw verify` is green.
5. reviewer: every criterion with `file:line` evidence.
6. PR from the template, docs updated by the "Work protocol" - Slava merges.

Frontend task (writer: agent)
1. task-writer -> stage file; Slava approves it.
2. frontend-dev writes `frontend/`.
3. `npm run lint && npm run build` are green.
4. reviewer checks; Slava looks at the page.
5. PR from the template, docs updated by the "Work protocol" - Slava merges.

Unclear task, missing rule, red check after a try -> stop and ask Slava (see "Stop and ask").

## Work protocol (feature hub + stage files)

- **Before work:** read the feature hub `docs/features/<feature>/README.md`, then your stage file. The stage file is
  the task. Status `draft` = not approved yet: stop and ask. When Slava approves it, set `status: approved`.
- **Read only what the stage cites:** find the section with Grep and read just that part, not the whole file; do not
  scan the repo beyond the files the stage names.
- **After each step** (tests written, code green, review done): update the stage file's "Status" — done / left /
  risks — and `status:` in its header. Never change the sections above "Status".
- **After the stage, in the same PR:** update the hub's "Stages" table and "Status"; `docs/roadmap.md` if the
  feature's status changed; 3–5 lines in `docs/retro.md` (backend stages always, others when something went wrong).
- **Next feature:** when its turn comes in the roadmap, the task-writer writes its hub and stage files from
  `docs/features/_hub-template.md` and `docs/features/_stage-template.md`.
- On a backend stage agents update only the docs; the code in `backend/src/main/` is Slava's.

## Stack

- Backend: Java 25, Spring Boot 4.2 (Web MVC, Data JPA, Validation, Actuator), PostgreSQL 18, Flyway (SQL migrations
  in `backend/src/main/resources/db/migration`), Maven wrapper. Tests: JUnit 5, Testcontainers (real PostgreSQL,
  needs Docker), ArchUnit. Style: Spotless + Palantir Java Format.
- Frontend: React 19 + TypeScript + Vite, oxlint. Node.js 26 LTS.
- Monorepo: `backend/`, `frontend/`, `docs/`. Base package: `io.github.pan4ife.eventticketing`.

## Backend layers

`controller → service → repository`, data in `domain` (JPA entities) and `dto` (API request/response records).

- `controller` — HTTP only: validate input (`@Valid`), call one service, map to DTO. No business logic,
  no repositories, no entities in signatures.
- `service` — business rules and transactions (`@Transactional`). Never knows about controllers.
- `repository` — Spring Data interfaces. Never calls services or controllers.
- `domain` — entities. Never depends on DTOs, services, controllers, repositories.
- Errors: one `@RestControllerAdvice`, response format from `docs/reference/technical-spec.md` → "6. Backend Requirements"
  → "Error Handling".
- Packages may be grouped by feature (`booking/controller`, `booking/service`, ...) — the rules still apply.

## Code rules

- Constructor injection only (no `@Autowired` on fields). No `System.out` — use a logger.
- Never expose password hashes or entities in API responses — DTOs only.
- Schema changes only through a new Flyway migration (`V<n>__description.sql`); never edit an applied one.
  Hibernate runs with `ddl-auto=validate`.
- Money and capacity rules from the PRD are tested, especially "no overselling" (concurrency test).
- Simple first. If unsure between two designs, pick the simpler one and say so.
- Frontend: TypeScript strict, no `any` without a comment why; API calls in one place (`src/api/`).

## Facts and verification

- Before you talk about code, open the real file and cite `path:line`. Never describe a file from memory.
- Versions only from `backend/pom.xml` and `frontend/package.json`.
- Facts about libraries and tools come from official documentation, with a link. Blogs and AI answers only help
  to find where to look.
- Not sure — say so. "I don't know, I'll check" is better than a guess. Never invent an API, a property or an
  annotation.
- "It works" is a claim: prove it with a test run or a build (`./mvnw verify`, `npm run build`), or say it is
  not verified yet.

## Stop and ask (do not guess)

Stop and ask Slava when: the task is unclear or contradicts the PRD; a change is needed in `backend/src/main/` or in
a Slava-owned file; a new dependency, a new tool or a version change is needed; a test seems wrong; a check stays red
after you tried. Write what you tried and the exact question — a guess instead of a question is a mistake.

## Checks

| Rule | Checked by |
|---|---|
| Backend builds, all tests pass (incl. Testcontainers) | `cd backend && ./mvnw verify` |
| Layer rules, constructor injection, no `System.out` | ArchUnit `ArchitectureTest` (inside `verify`) |
| Java formatting | Spotless (inside `verify`; fix with `./mvnw spotless:apply`) |
| Frontend lints and builds | `cd frontend && npm ci && npm run lint && npm run build` |
| Agents do not edit `backend/src/main/` | hook `scripts/protect-backend-main.mjs` (Claude Code, Codex, Cursor) |
| Everything above on every push and PR | GitHub Actions `.github/workflows/ci.yml` |
| Task criteria, layers, readability | reviewer (reads the code, cites `file:line`) |

Run the checks for what you changed before you say "done". The hook covers the agents' edit tools; a shell command
can still write files, so the rule above still applies to the shell.

## Git

- `main` is protected by habit: nobody commits to it directly. One stage — one branch
  (`task/<feature>-NN-short-name`, e.g. `task/auth-01-users-table`) — one PR (`.github/pull_request_template.md`).
- Slava reviews and merges every PR. Agents never merge and never push to `main`.
- Commit messages: `type: what changed` (`feat`, `fix`, `test`, `docs`, `chore`), English.
