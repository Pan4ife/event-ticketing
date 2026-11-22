# Review of the three solutions

Independent read-only `reviewer` subagent (`.claude/agents/reviewer.md`), 2026-11-23. Task:
[`docs/tasks/000-trial-home-status.md`](../../tasks/000-trial-home-status.md). Criteria 1–2 (lint + build green,
only `frontend/` changed) were checked by command and pass for all three. Paths are relative to each solution's `frontend/`.
A = Claude Code, B = Codex, C = Cursor.

> **Note added after the review.** The reviewer failed all three on criterion 7 because the Vite starter file
> `public/icons.svg` was left unused. But the task's "Allowed to change" list does not include `frontend/public/`,
> so deleting it was not allowed — the task contradicts itself. Claude Code noticed this and said so instead of
> deleting the file. Lesson for task writing: list the files to delete, and allow them.

| # | A — Claude Code | B — Codex | C — Cursor |
|---|---|---|---|
| 3 fetch only in `src/api/`, typed | PASS: `src/api/health.ts:17`, type :5, used via `src/hooks/useBackendStatus.ts:12` | PASS: `src/api/health.ts:6`, `Promise<HealthResponse>` :5, used in `src/App.tsx:21` | PASS: `src/api/health.ts:9`, typed :2-7, used in `src/App.tsx:22` |
| 4 checking / up / down | PASS: `health.ts:18-24`; initial state `useBackendStatus.ts:8` | PASS: `health.ts:7-8` throws, `App.tsx:23,25-26` | PASS: `health.ts:10-16`, `App.tsx:15,24` |
| 5 texts in one place, switch without reload, `localStorage` | PASS: `src/i18n/texts.ts:28-62`, `useLanguage.ts:10-18,24-31` | **FAIL**: visible English text hard-coded at `App.tsx:74,77,78,82,99` | PASS: `src/i18n/texts.ts:12-57`, `App.tsx:14,35-38` |
| 6 dev proxy + relative URL | PASS: `vite.config.ts:10-12` | PASS: `vite.config.ts:8-10` | PASS: `vite.config.ts:8-10` |
| 7 no `any`, small components, starter removed | FAIL (only `public/icons.svg`, see note) | **FAIL**: one 106-line `App.tsx`, no components; `src/assets/hero.png` and `public/icons.svg` unused | FAIL (only `public/icons.svg`, see note) |

## Traced cases

- **A.** Network error → `catch` at `health.ts:23` returns `down`. `503 {"status":"DOWN"}` → `!response.ok` at :18 → `down`.
  Page: "Server: Down" / "서버: 중단됨" / "Сервер: Не отвечает". Bad stored language `"de"` → `isLanguage` at
  `useLanguage.ts:13` falls back to `en`. Blocked storage is caught at :14 and :28.
- **B.** Network error and 503 both land in `.catch` at `App.tsx:25-26` → "Service unavailable"; the error text is never
  shown. Bad stored value → `en` (`App.tsx:10`). No try/catch around `localStorage` (`App.tsx:9,35`).
- **C.** Network error → `catch` at `health.ts:15`; 503 → `!ok` at :10; both "Backend status: Down"
  (`BackendStatus.tsx:15-16`). Bad stored value → `en` (`texts.ts:49-52`). No try/catch around `localStorage`
  (`texts.ts:48,56`).

## Overall quality

- **A (Claude Code):** clean and small. Fetch, status hook, language hook and components each in their own place;
  edge cases handled — unmount during the request (abort), blocked storage, the page `lang` attribute.
- **B (Codex):** status logic correct, but it went past the task: a marketing-style page (hero art, footer, "explore"
  link) whose decorative English text is not translated — a Russian or Korean user sees English. `index.html` changed
  beyond the title (favicon link removed, `theme-color` added), outside the task's "Allowed" list. Everything in one component.
- **C (Cursor):** simple and correct, sensible components, small typed API function. Blocked `localStorage` throws
  (MDN: [`Window.localStorage` exceptions](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#exceptions))
  and the page renders blank (same for B). Storage helpers live in `texts.ts`.

Minor: B and C do not update `<html lang>` on switch; A does (`useLanguage.ts:25`).
