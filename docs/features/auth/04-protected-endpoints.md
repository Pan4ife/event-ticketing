---
id: auth-04
feature: auth
title: Protected endpoints and roles
writer: Slava
tests: tester
area: backend
branch: task/auth-04-protected-endpoints
status: draft
---

Feature hub: [`README.md`](README.md)

## Who writes what
- Production code (`backend/src/main/`): **Slava** — Spring Security configuration, `GET /api/users/me`.
- Tests first (`backend/src/test/`): **tester agent** (including a test-only admin endpoint inside `backend/src/test/`).
- Help: **mentor** · Review: **reviewer** · Merge: **Slava**

## Goal
The backend checks the JWT on every request: public endpoints stay open, private ones need a valid token (`401`),
admin ones need the `ADMIN` role (`403`); `GET /api/users/me` returns the current user.

## Context
- Details: `docs/reference/technical-spec.md` → "6. Backend Requirements" → "Authentication and Authorization"
  (public / user / admin endpoints, 401, 403); "12. Error Handling"; "13. Testing Checklist" → "Role access tests".
- Earlier stages: [02](02-registration.md) (error format), [03](03-login-jwt.md) (token and its claims).
- Contract the tests rely on:
  - Open without a token: `POST /api/auth/register`, `POST /api/auth/login`, `GET /actuator/health`.
  - `/api/admin/**` → role `ADMIN` only. Everything else under `/api/**` → any valid token.
  - `GET /api/users/me` with a valid token → `200` with the `user` fields from stage 02.
  - No token or a bad/expired token → `401`; valid token without the role → `403`; both in the error format
    from stage 02 (not Spring's default page).
  - Stateless: no session cookie.
- **Slava decides before approval:** add `spring-boot-starter-security` (proposed — needed for the filter chain) /
  another way.

## Allowed / not allowed (on top of AGENTS.md)
- Allowed to change: `backend/src/main/java/**`, `backend/pom.xml` (the security starter), `backend/src/test/**`.
- Not allowed: real admin endpoints (they come with their features); profile update.
- Agents explain, write tests in `backend/src/test/`, review. They do not edit `backend/src/main/`.

## Acceptance criteria
1. [auto] `./mvnw verify` is green; `HealthEndpointTest`, `RegistrationTest`, `LoginTest` still pass unchanged.
2. [auto] Test `ProtectedEndpointsTest` (written first): `/api/users/me` without a token → `401`, with a broken
   token → `401`, with a valid token → `200` and the caller's own email.
3. [auto] Same test, with a test-only controller at `/api/admin/test-ping` (in `backend/src/test/`): `USER` token →
   `403`; `ADMIN` token → `200` (the admin row is inserted with `JdbcTemplate`, then logs in).
4. [judge] `401` and `403` bodies come from the same error format (security entry point / access-denied handler
   reuse it), with the request `path`.
5. [judge] Rules are in one security configuration class; controllers have no manual token checks.
6. [judge] Changed files: security config, token filter or resource-server config, `UserController` + service
   method for `/me`, `pom.xml`, tests.

## Check by eye (Slava)
- [ ] `curl -i localhost:8080/api/users/me` → `401` JSON; with `-H "Authorization: Bearer <token>"` → your user.

## Out of scope
- Public `GET` rules for events and categories → added by those features.
- Profile update, user list, blocking → feature "Profile and user management".

## Status
- **Done:** —
- **Left:** everything
- **Risks / questions:** the dependency decision in "Context".
