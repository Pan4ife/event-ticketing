# AGENTS.md — rules for every AI agent in this repo

Read by Codex and Cursor directly, and by Claude Code through `CLAUDE.md`. These rules apply in every task.
A task file (`docs/tasks/NNN-*.md`) may narrow them, never loosen them. Product truth: `docs/PRD.md`.

## Who writes what

| Area | Who writes it | What agents do there |
|---|---|---|
| `backend/src/main/` (production backend code, config, migrations) | **Slava only** | Explain, give hints step by step, point to docs, review. **Never edit.** A hook blocks it (see "Checks"). |
| `backend/src/test/` | agents (tests first, from the task) | Write and fix tests. Never weaken or delete a test to make it pass. |
| `frontend/` | agents | Write code from the task; Slava reviews. |
| `docs/tasks/`, reviews | agents | Write tasks from the template, review code against the task and the PRD. |
| `docs/PRD.md`, `AGENTS.md`, `CLAUDE.md`, `.claude/`, `.codex/`, `.cursor/`, `scripts/`, `.github/`, `pom.xml` | Slava | Propose changes in chat; edit only when Slava says yes for that one change. |

If backend code needs a change, write in chat what to change and why (file, method, reason) — Slava types it.

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
- Errors: one `@RestControllerAdvice`, response format from PRD §6 "Error Handling".
- Packages may be grouped by feature (`booking/controller`, `booking/service`, ...) — the rules still apply.

## Code rules

- Constructor injection only (no `@Autowired` on fields). No `System.out` — use a logger.
- Never expose password hashes or entities in API responses — DTOs only.
- Schema changes only through a new Flyway migration (`V<n>__description.sql`); never edit an applied one.
  Hibernate runs with `ddl-auto=validate`.
- Money and capacity rules from the PRD are tested, especially "no overselling" (concurrency test).
- Simple first. If unsure between two designs, pick the simpler one and say so.
- Frontend: TypeScript strict, no `any` without a comment why; API calls in one place (`src/api/`).

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

- `main` is protected by habit: nobody commits to it directly. One task — one branch (`task/NNN-short-name`) — one PR.
- Slava reviews and merges every PR. Agents never merge and never push to `main`.
- Commit messages: `type: what changed` (`feat`, `fix`, `test`, `docs`, `chore`), English.
