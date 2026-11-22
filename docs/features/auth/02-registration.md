---
id: auth-02
feature: auth
title: Registration and error format
writer: Slava
tests: tester
area: backend
branch: task/auth-02-registration
status: draft
---

Feature hub: [`README.md`](README.md)

## Who writes what
- Production code (`backend/src/main/`): **Slava** — DTOs, controller, service, global error handler.
- Tests first (`backend/src/test/`): **tester agent**.
- Help: **mentor** · Review: **reviewer** · Merge: **Slava**

## Goal
A guest can register with `POST /api/auth/register`; the password is stored as a BCrypt hash; every API error
comes back in one JSON format.

## Context
- PRD: `docs/PRD.md` → "Scope".
- Details: `docs/reference/technical-spec.md` → "4. Functional Requirements" → "Authentication and Authorization"
  (BCrypt); "6. Backend Requirements" → "DTOs and Request Models" (`RegisterRequest`, `UserResponse`),
  "Validation", "Error Handling"; "8. API Endpoints" → `POST /api/auth/register`; "11. Validation Rules"
  → "Authentication"; "12. Error Handling" (400, 409).
- Earlier stage: [01 Users table](01-users-table.md).
- Contract the tests rely on:
  - Request: `{"email", "password", "firstName", "lastName"}`. Email required and valid; password required, at
    least 8 characters; first and last name required.
  - `201` → `{"user": {"id", "email", "firstName", "lastName", "role": "USER"}}`. No password or hash anywhere.
    (Stage 03 adds a `token` field next to `user`.)
  - Duplicate email → `409`. Invalid body → `400`.
  - Error body: `{"timestamp", "status", "error", "message", "path", "validationErrors"}`;
    `validationErrors` only on `400`.
- **Slava decides before approval** (proposed answer first):
  1. BCrypt dependency: `spring-security-crypto` only (hashing without web security; full Spring Security comes in
     stage 04) / the full Spring Security starter now.
  2. Shape of `validationErrors`: list of `{"field", "message"}` / object `{"field": "message"}`.
  3. Email case: store lowercased, so `A@x.com` and `a@x.com` are the same user / store as typed.

## Allowed / not allowed (on top of AGENTS.md)
- Allowed to change: `backend/src/main/java/**`, `backend/pom.xml` (only the dependency from decision 1),
  `backend/src/test/**`.
- Not allowed: JWT, login, Spring Security filters (stages 03–04); new migrations unless the schema really lacks something.
- Agents explain, write tests in `backend/src/test/`, review. They do not edit `backend/src/main/`.

## Acceptance criteria
1. [auto] `./mvnw verify` is green (including ArchUnit and Spotless).
2. [auto] Test `RegistrationTest` (written first): valid body → `201` with the `user` fields above and no
   `password`/`passwordHash`; same email again → `409` in the error format; invalid email → `400` with a
   `validationErrors` entry for `email`; 7-character password → `400` with an entry for `password`.
3. [auto] The same test reads the row with `JdbcTemplate`: `password_hash` is not the raw password and is a BCrypt hash.
4. [judge] Layers: the controller only validates (`@Valid`), calls one service method and returns a DTO; the
   service checks the duplicate email and hashes the password; one `@RestControllerAdvice` builds every error.
5. [judge] A duplicate that slips past the service check (two requests at once) still ends as `409`, not `500`
   (the unique constraint from stage 01 is handled).
6. [judge] Changed files: DTO records, controller, service, error handler and its response record, `pom.xml`
   (one dependency), the test.

## Check by eye (Slava)
- [ ] `curl -i -X POST localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{...}"` → `201`;
      the same again → `409` with the error JSON.

## Out of scope
- Token in the response, login → stage 03. Protecting endpoints → stage 04.
- Localized error messages (`Accept-Language`) → feature "Multilanguage".

## Status
- **Done:** —
- **Left:** everything
- **Risks / questions:** the three decisions in "Context".
