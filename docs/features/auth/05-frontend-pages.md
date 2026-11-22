---
id: auth-05
feature: auth
title: Login and registration pages
writer: agent
tests: none
area: frontend
branch: task/auth-05-frontend-pages
status: draft
---

Feature hub: [`README.md`](README.md)

## Who writes what
- Production code (`frontend/`): **frontend-dev agent**.
- Tests first: none — checked by `npm run lint`, `npm run build` and Slava's eye check.
- Review: **reviewer** · Looks at the page and merges: **Slava**

## Goal
A guest opens the web app, registers or logs in on its own page, sees their name in the header and can log out;
all texts are in English, Korean and Russian.

## Context
- PRD: `docs/PRD.md` → "Scope" (languages EN, KO, RU).
- Details: `docs/reference/technical-spec.md` → "5. Frontend Requirements" → "Main Pages" (Login, Registration),
  "Forms", "Validation", "State Management Expectations", "API Integration", "Responsive Behavior";
  "12. Error Handling" (frontend part).
- Backend contract (stages [02](02-registration.md), [03](03-login-jwt.md), [04](04-protected-endpoints.md)):
  `POST /api/auth/register`, `POST /api/auth/login` → `{"token", "user"}`; errors
  `{"timestamp", "status", "error", "message", "path", "validationErrors"}`; `GET /api/users/me` with
  `Authorization: Bearer <token>`.
- Lesson from step 4 (`docs/retro.md`): files to delete are listed here and allowed.
- **Slava decides before approval** (proposed answer first):
  1. Router: `react-router` / no router (switch views by state).
  2. Translations: `react-i18next` (the spec recommends it) / a plain texts object for now.

## Allowed / not allowed (on top of AGENTS.md)
- Allowed to change: `frontend/src/**`, `frontend/vite.config.ts`, `frontend/index.html` (title only),
  `frontend/package.json` + `package-lock.json` (only the libraries from the decisions).
- Allowed to delete: `frontend/src/App.css`, `frontend/src/assets/hero.png`, `frontend/src/assets/react.svg`,
  `frontend/src/assets/vite.svg`, `frontend/public/icons.svg`.
- Not allowed: anything outside `frontend/`.

## Acceptance criteria
1. [auto] `cd frontend && npm ci && npm run lint && npm run build` is green.
2. [auto] `git diff --name-only main` lists only files under `frontend/`.
3. [judge] API calls only in `src/api/` (typed request and response); the token is added to protected requests in
   one place.
4. [judge] Forms validate before sending: required fields, email format, password at least 8 characters; server
   `validationErrors` show next to their fields; `409` → "email already registered"; `401` → "wrong email or
   password"; network error → a general message. No raw errors or stack traces on the page.
5. [judge] Token and user are kept in `localStorage` and in one auth state (React Context); after refresh the user is
   still logged in; "Log out" removes the token.
6. [judge] Every text in EN, KO and RU in one place; a language switcher changes them without reload and the choice
   survives refresh. In dev, `/api` is proxied to `http://localhost:8080` in `vite.config.ts`.
7. [judge] TypeScript strict, no `any`; small components; the starter files listed above are gone.

## Check by eye (Slava)
- [ ] Backend running, `cd frontend && npm run dev` → register a new user → you are logged in and see your name.
- [ ] Log out, log in with a wrong password → a clear message; with the right one → logged in.
- [ ] Switch to 한국어 and Русский, refresh — language and login stay.
- [ ] Phone width — forms fit, nothing overflows.

## Out of scope
- Private-page redirects and the "access denied" page → come with the first private pages (bookings, admin).
- Profile page → feature "Profile and user management".

## Status
- **Done:** —
- **Left:** everything
- **Risks / questions:** the two decisions in "Context".
