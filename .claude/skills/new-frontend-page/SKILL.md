---
name: new-frontend-page
description: Build a frontend page or component from a task — React 19 + TypeScript + Vite, API calls only in src/api/, loading/empty/error states, EN+KO texts, responsive, lint and build green. Use when a frontend task in docs/tasks/ is approved.
---

# New frontend page

Agents write `frontend/`; Slava reviews it. He is a backend developer — keep the code plain and readable.

## Inputs

- The task `docs/tasks/NNN-*.md` — do exactly it, nothing from "Out of scope".
- `docs/PRD.md` → "5. Frontend Requirements" (pages, components, forms, validation, state, API integration,
  responsive) and "8. API Endpoints" for the request/response shapes; "6. Backend Requirements" →
  "Error Handling" for the error JSON format and "12. Error Handling" for what the UI shows on
  400/401/403/404/409/500.
- Current code: look at `frontend/src/` first and follow what is already there.

## Rules

- **API in one place:** all `fetch` calls in `frontend/src/api/` (AGENTS.md "Code rules"), with typed
  request/response types. Pages and components import from there; no `fetch` elsewhere.
- **Do not invent the backend.** Shapes come from the PRD API section or the backend task/code. Not defined →
  stop and ask; do not guess field names.
- **TypeScript strict**, no `any` without a comment why.
- **Every data screen has four states:** loading, success, empty, error. Errors use the PRD error format
  (`message`, `validationErrors` near form fields). Never show stack traces.
- **Texts in English and Korean** (PRD Part 1 "Scope"): no hard-coded UI strings scattered in components;
  keep them where the language switch can reach them.
- **Responsive:** works on mobile, tablet, desktop (PRD "Responsive Behavior").
- **New dependency** (router, state library, UI kit, i18n library) → stop and ask Slava first; versions must
  be checked against official docs (`verify-facts`).
- Small components, one job each. Plain CSS is fine.

## Done when

1. `cd frontend && npm ci && npm run lint && npm run build` is green — run it, do not assume.
2. If the task has "Check by eye": say what to open (`npm run dev`, which URL, what to click) — Slava or
   the main session looks at the page; you have no browser.
3. Report: changed files, what you chose yourself and why, what Slava should open to check.
