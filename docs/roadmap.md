# Roadmap — MVP features in order

What gets built, in what order, who writes it, and where it stands. Product truth: [`PRD.md`](PRD.md).
Updated after every finished stage (AGENTS.md → "Work protocol"); a feature's hub is written by the task-writer
when its turn comes. Each feature: backend stages first (code — **Slava**, tests first — tester agent), then
frontend stages (code — **frontend-dev agent**).

Status: `not started` · `in progress` · `done`.

## System work

| # | Item | Who writes | Status | Where |
|---|---|---|---|---|
| 0 | Fix the Codex lock + lock shell commands for all three agents | agent (Slava allowed `scripts/` for this task) | not started | [`retro.md`](retro.md), [`agents-setup.md`](agents-setup.md) → "Finding: the Codex lock did not block" |

## Product features

| # | Feature | What it gives | Backend (Slava) | Frontend (agent) | Hub |
|---|---|---|---|---|---|
| 1 | Sign-up and sign-in | register, login, JWT, roles, one error format | not started | not started | [auth](features/auth/README.md) |
| 2 | Categories | admin manages categories; public list | not started | not started | written when started |
| 3 | Events | admin creates, edits and changes event status; public list with search, filters, sorting, pagination; details; image URL | not started | not started | written when started |
| 4 | Bookings | book tickets (no overselling), my bookings, cancel, admin bookings and statuses | not started | not started | written when started |
| 5 | Profile and user management | profile update, preferred language; admin user list, block/activate; first admin account | not started | not started | written when started |
| 6 | Dashboard | admin statistics | not started | not started | written when started |
| 7 | Recommendations | rule-based "recommended for you" with a short "why" | not started | not started | written when started |
| 8 | Multilanguage | EN/KO/RU everywhere, status labels, saved language | — (status keys only) | not started | written when started |
| 9 | API docs | Swagger / OpenAPI page | not started | — | written when started |
| 10 | Deploy and demo | public URL, demo data, test accounts, final README | not started | not started | written when started |

Order follows the spec's development plan (`reference/technical-spec.md` → "15. Suggested Development Plan"):
data and auth first, then the main entities, then the additional features, then deploy.
Open questions that block a feature are in [`PRD.md`](PRD.md) → "Open questions" (hosting → #10, event images → #3).
