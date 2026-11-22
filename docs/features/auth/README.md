# Feature: Sign-up and sign-in (auth)

**Roadmap:** row 1 in [`docs/roadmap.md`](../../roadmap.md) · **Status:** not started

## Goal
A guest can register and log in with email and password, gets a JWT, and the backend lets in only the right role:
public endpoints are open, private ones need a token, admin ones need the `ADMIN` role.

## Scope
- `users` table (Flyway migration), `User` entity and repository.
- One error format for the whole API (`@RestControllerAdvice`).
- `POST /api/auth/register`, `POST /api/auth/login` — BCrypt password hashes, JWT with the role in its claims.
- Spring Security: public / user / admin endpoints, `401` without a valid token, `403` without the role.
- `GET /api/users/me` — the first private endpoint (current user).
- Frontend: login and registration pages, token storage, logout, EN/KO/RU texts.

## Scope out
- Profile update, preferred language, admin user list, block/activate users → feature "Profile and user management".
- How the first admin account appears (seed or config) → decided in "Profile and user management" or "Deploy".
- Password recovery, email confirmation, SNS login → not in the MVP (PRD → "At a glance" → out of scope).

## Acceptance criteria (feature level)
From the spec's testing checklist ("Authentication tests", "Role access tests"):
1. Register with valid data → `201`; with a duplicate email → `409`; with an invalid email or a short password → `400`
   with `validationErrors`.
2. Login with valid credentials → `200` with a JWT; with a wrong password → `401`.
3. A private endpoint without a token (or with a bad one) → `401`; a user on an admin endpoint → `403`.
4. Passwords are stored as BCrypt hashes and never appear in any response.
5. All errors use one JSON format: `timestamp`, `status`, `error`, `message`, `path`, `validationErrors`.
6. A guest can register and log in from the web page in English, Korean or Russian, and log out.

## Stages
One stage = one task = one branch = one PR. Backend stages 01–04 are written by **Slava** (tests first by the
tester agent); stage 05 is written by the **frontend-dev agent**.

| # | Stage | Writes the code | Tests first | Status |
|---|---|---|---|---|
| 01 | [Users table](01-users-table.md) | Slava | tester | draft |
| 02 | [Registration and error format](02-registration.md) | Slava | tester | draft |
| 03 | [Login and JWT](03-login-jwt.md) | Slava | tester | draft |
| 04 | [Protected endpoints and roles](04-protected-endpoints.md) | Slava | tester | draft |
| 05 | [Login and registration pages](05-frontend-pages.md) | frontend-dev agent | — (lint, build, eye check) | draft |

Stages are `draft` until Slava approves each one right before it starts (the task-writer re-checks it against the
code that exists by then).

## Status
- **Done:** hub and stage drafts written (2026-11-23).
- **Left:** all stages.
- **Risks / open questions:**
  - New dependencies need Slava's choice (AGENTS.md → "Stop and ask"): BCrypt in stage 02, the JWT library in stage 03,
    Spring Security in stage 04, a router in stage 05. Each stage file lists its question.
  - Adding Spring Security closes every endpoint by default — stage 04 must keep `/actuator/health`, register and login open.

## Sources
- PRD: [`docs/PRD.md`](../../PRD.md) → "At a glance", "Decisions"
- Spec details: [`docs/reference/technical-spec.md`](../../reference/technical-spec.md) → "4. Functional Requirements"
  → "Authentication and Authorization"; "6. Backend Requirements" → "Authentication and Authorization",
  "Error Handling"; "7. Database Design" → "User"; "8. API Endpoints" (`/api/auth/*`); "11. Validation Rules"
  → "Authentication"; "13. Testing Checklist".

## Decisions
- 2026-11-23, Slava: the first feature is auth only. Tables for categories, events and bookings come with their
  own features.
- 2026-11-23, Slava: five small stages, each clearly marked who writes the code.
