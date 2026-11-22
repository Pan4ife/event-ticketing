# event-ticketing — Product Requirements

A full-stack platform to discover events (concerts, conferences, workshops, meetups) and book tickets.

## At a glance

- **Goal:** guests find events; users book tickets and manage their bookings; admins run events, bookings and users.
  A public, deployed portfolio project.
- **Roles:** Guest, User, Admin (no Organizer).
- **MVP scope:** auth with JWT and roles · categories · events with statuses, search, filters, sorting, pagination ·
  bookings with no overselling · profile and user management · admin dashboard · rule-based recommendations ·
  EN/KO/RU interface · OpenAPI docs · deployment with demo data.
- **Out of scope (MVP):** payments and refunds · Organizer role · seat maps (users pick a quantity) · email/SMS/push,
  password recovery, SNS login · a real ML/LLM model · native mobile apps (responsive web only).
- **MVP is done when:**
  1. Every feature below is done: its hub's acceptance criteria are met.
  2. Frontend and backend are reachable by a public URL, with demo data and test accounts.
  3. Parallel bookings never sell more tickets than the capacity — proven by an automated concurrency test.
  4. The backend items of the spec's testing checklist are automated tests (JUnit + Testcontainers);
     one command runs every check and CI runs the same command.
  5. The spec's "14. Definition of Done" is met, as changed by the decisions below.

## Features (MVP, in order)

Status and who writes what: [`roadmap.md`](roadmap.md). A feature's hub (its short PRD) is written when its turn comes.

| # | Feature | Hub |
|---|---|---|
| 1 | Sign-up and sign-in | [features/auth](features/auth/README.md) |
| 2 | Categories | — |
| 3 | Events | — |
| 4 | Bookings | — |
| 5 | Profile and user management | — |
| 6 | Dashboard | — |
| 7 | Recommendations | — |
| 8 | Multilanguage | — |
| 9 | API docs | — |
| 10 | Deploy and demo | — |

## Decisions

On top of the technical specification ([`reference/technical-spec.md`](reference/technical-spec.md) — entities, endpoints,
status flows, validation, error format). **Where the spec and this file disagree, this file wins.**

### Scope

- **Roles:** Guest, User, Admin. The optional Organizer role is not built.
- **Additional features:** Dashboard, Advanced statuses, Multilanguage, AI recommendations.
- **Languages:** English, Korean and Russian (the spec's example was English + Ukrainian).
- **Bookings are confirmed immediately** — there is no payment step. `PENDING` and `EXPIRED` stay in the
  status list for admin use only.
- **AI recommendations** are rule-based (categories the user booked + popularity + upcoming date), with a
  short "why" text. No external AI model in the MVP.

### Must-haves added on top of the spec

- **Deployment is required.** The school rule: a project that runs only locally is not finished.
- **No overselling.** "Two users try to book the last ticket" is a hard requirement, proven by a concurrency test.
- **Automated tests** for the backend items of the testing checklist, not only manual checks.

### Timeline

About 5–6 weeks of evenings (the spec's 2-week plan assumes full-time work).
Backend is written by Slava with AI help; frontend is written by AI agents and reviewed by Slava.

### Open questions

1. **Hosting:** where to deploy frontend, backend and PostgreSQL (prefer a free or cheap tier). → feature 10.
2. **Event images:** local disk breaks on most hosts after redeploy — cloud storage or "image URL only"? → feature 3.

### Tech stack (decided 2026-11-23)

- **Backend:** Java 25, Spring Boot 4.2, PostgreSQL 18, Flyway migrations, Maven wrapper.
- **Backend checks:** JUnit 5 + Testcontainers, ArchUnit (layer rules), Spotless + Palantir Java Format.
- **Frontend:** React 19 + TypeScript + Vite, oxlint, Node.js 26 LTS.
- **CI:** GitHub Actions runs the same checks as locally. Agent rules: [`AGENTS.md`](../AGENTS.md).
