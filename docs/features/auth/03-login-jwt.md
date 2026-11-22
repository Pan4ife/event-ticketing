---
id: auth-03
feature: auth
title: Login and JWT
writer: Slava
tests: tester
area: backend
branch: task/auth-03-login-jwt
status: draft
---

Feature hub: [`README.md`](README.md)

## Who writes what
- Production code (`backend/src/main/`): **Slava** — login endpoint, token creation.
- Tests first (`backend/src/test/`): **tester agent**.
- Help: **mentor** · Review: **reviewer** · Merge: **Slava**

## Goal
A registered user can log in with `POST /api/auth/login` and gets a signed JWT with their role in the claims;
registration returns a token too.

## Context
- Details: `docs/reference/technical-spec.md` → "4. Functional Requirements" → "Authentication and Authorization"
  (JWT, role in claims); "8. API Endpoints" → `POST /api/auth/login`; "12. Error Handling" (401);
  "13. Testing Checklist" → "Authentication tests".
- Earlier stage: [02 Registration and error format](02-registration.md) (error format, `user` object).
- Contract the tests rely on:
  - Request: `{"email", "password"}`.
  - `200` → `{"token": "<JWT>", "user": {...same fields as stage 02...}}`. `POST /api/auth/register` now also
    returns `token` next to `user`.
  - Wrong password or unknown email → `401` with the same message for both (do not reveal which emails exist).
  - The token is a JWT (three dot-separated parts); its payload has the user's role (`USER` / `ADMIN`).
- **Slava decides before approval** (proposed answer first):
  1. JWT library: Spring Security's own JWT support (OAuth2 Resource Server / JOSE) / the `jjwt` library.
     The mentor shows both in the official docs before you choose.
  2. Token lifetime: one value in `application.properties` (for example 24 hours) / something else.
  3. Signing secret: from an environment variable with a dev-only default in `application.properties` /
     environment variable only.

## Allowed / not allowed (on top of AGENTS.md)
- Allowed to change: `backend/src/main/java/**`, `backend/src/main/resources/application.properties`,
  `backend/pom.xml` (only the dependency from decision 1), `backend/src/test/**`.
- Not allowed: checking the token on requests, `401`/`403` rules → stage 04.
- Agents explain, write tests in `backend/src/test/`, review. They do not edit `backend/src/main/`.

## Acceptance criteria
1. [auto] `./mvnw verify` is green.
2. [auto] Test `LoginTest` (written first): register then login → `200` with a non-empty `token` and the `user`
   object; the token's payload (Base64-decoded in the test) contains the role `USER`; wrong password → `401` in the
   error format; unknown email → `401` with the same message.
3. [auto] `RegistrationTest` is extended: the register response has a `token`. No old assertion is weakened.
4. [judge] The password is checked with the BCrypt encoder, never by comparing strings; the secret is not hard-coded
   in Java code.
5. [judge] Token creation lives in one service class; the controller does not build tokens.
6. [judge] Changed files: login DTOs, controller method, token service, properties, `pom.xml`, tests.

## Check by eye (Slava)
- [ ] Log in with `curl`, paste the token into a JWT decoder (for example the one on jwt.io) and find your role.

## Out of scope
- Using the token to protect endpoints → stage 04.
- Refusing login for `BLOCKED` users → feature "Profile and user management".
- Refresh tokens, logout on the server → not in the MVP (logout is the frontend removing the token).

## Status
- **Done:** —
- **Left:** everything
- **Risks / questions:** the three decisions in "Context".
