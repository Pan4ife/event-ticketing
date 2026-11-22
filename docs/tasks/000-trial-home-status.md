---
id: 000
title: Trial — home page with backend status and language switch
writer: agent        # who writes the production code: Slava (backend/src/main) | agent (frontend, tests, docs)
area: frontend       # backend | frontend | docs
branch: trial/<agent-name>
---
<!--
Trial task for step 4 (docs/agents-setup.md): the same task is given to Claude Code, Codex and Cursor
to check that the shared rules (AGENTS.md + hook locks) work for every agent. Not a product feature yet.
-->

## Goal
The Vite starter page is replaced by a small home page "Event Ticketing" that shows whether the backend is up
(from `GET /actuator/health`) and lets the user switch the page language between English, Korean and Russian.

## Context
- PRD: `docs/PRD.md` → "Scope" (line 16, languages EN + KO + RU); → "Multilanguage" (language switcher,
  choice saved in `localStorage`, switch without page reload).
- Backend: the only public endpoint is `GET /actuator/health` (Spring Boot Actuator,
  `backend/src/main/resources/application.properties`, last line). When the app is up it answers
  `200` with JSON whose `status` field is `"UP"`. The backend runs on `http://localhost:8080`.
- Current code: `frontend/src/App.tsx` (Vite starter), `frontend/vite.config.ts`.

## Allowed / not allowed (on top of AGENTS.md)
- Allowed to change: `frontend/src/**`, `frontend/vite.config.ts`, `frontend/index.html` (page title only).
- Not allowed: anything outside `frontend/`; new npm dependencies (no i18n library — a plain texts object is
  enough here); changes to `package.json` / `package-lock.json`.

## Acceptance criteria
`[auto]` — a command proves it; `[judge]` — the reviewer reads the code and cites `file:line`.
1. [auto] `cd frontend && npm ci && npm run lint && npm run build` is green.
2. [auto] `git diff --name-only main` lists only files under `frontend/`.
3. [judge] The only `fetch` call is in `frontend/src/api/` (for example `src/api/health.ts`), with a typed
   response; components import it and never call `fetch` themselves.
4. [judge] The status has three states: "checking" (request in flight), "up" (`status === "UP"`), "down"
   (any other status, non-2xx answer or network error). No stack traces or raw errors on the page.
5. [judge] All UI texts live in one place (for example `src/i18n/texts.ts`) in EN, KO and RU; a switcher on
   the page changes them without reload; the choice is kept in `localStorage` and restored after refresh.
6. [judge] In dev mode `/actuator` is proxied to `http://localhost:8080` in `vite.config.ts`, so the page
   calls a relative URL (`/actuator/health`), not a hard-coded host.
7. [judge] TypeScript without `any`; small components; the Vite starter content and unused assets are removed.

## Check by eye (Slava)
- [ ] `cd frontend && npm run dev`, open http://localhost:5173 with the backend stopped → page shows "down".
- [ ] Start the backend (`cd backend && ./mvnw spring-boot:run`, needs PostgreSQL) → after refresh "up".
- [ ] Switch to 한국어 and Русский, refresh — the language stays.
- [ ] Narrow the window to phone width — nothing overflows.

## Out of scope
- Routing, auth, events list, React Context for language (step 5 tasks).
- Any backend change.
