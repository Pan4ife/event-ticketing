---
name: write-task
description: Turn a roadmap row into a feature hub docs/features/<feature>/README.md plus stage files NN-short-name.md (from docs/features/_hub-template.md and _stage-template.md), or finalize one draft stage before it starts — goal, PRD/spec links, who writes what, allowed files, criteria labelled [auto]/[judge], check by eye, out of scope. Use when Slava wants the next feature or stage written.
---

# Write a feature hub and its stages

Two documents, two jobs:
- **Hub** (`docs/features/<feature>/README.md`) — the short PRD of one feature: goal, scope, scope out,
  feature-level criteria, the stages table, status. Fits on one screen.
- **Stage file** (`docs/features/<feature>/NN-short-name.md`) — the task. Together with `AGENTS.md` and the hub it
  is the only thing the doer knows about the work: they do not see this chat. The reviewer later checks it
  criterion by criterion.

## Inputs (read them, do not recall them)

1. The roadmap row from `docs/roadmap.md` (or Slava's words in the chat).
2. `docs/PRD.md` — the decisions override the spec. The details the feature is about in
   `docs/reference/technical-spec.md`, read in full (entities, endpoints, status flows, validation, errors, testing
   checklist).
3. `AGENTS.md` (especially "Work protocol") and the two templates in `docs/features/`.
4. What already exists: other hubs and stage files, the code and tests they produced (Grep/Glob).

## Job A — a new feature (hub + stage drafts)

1. Folder `docs/features/<feature>/` — short lowercase name (`auth`, `events`, `bookings`).
2. Hub from `_hub-template.md`: goal, scope, scope out (name the feature that does each excluded thing),
   feature-level criteria (take them from the spec's testing checklist and acceptance criteria), sources.
3. Split into stages: **one stage = one small vertical piece** (one table, one endpoint, one rule, one page).
   Backend stages first, then frontend. Never backend and frontend in one stage. More than ~5 criteria → split.
4. Stage files from `_stage-template.md`, all `status: draft`. Fill every section now; what needs Slava goes into
   "Slava decides before approval".
5. The hub's "Stages" table: number, link, who writes the code, who writes tests first, status.
6. The feature's row in `docs/roadmap.md`: replace "written when started" with the hub link.

## Job B — finalize one stage before it starts

Re-read the draft against the code that exists now (earlier stages may have changed names or contracts), fix it,
put Slava's answers into it (as `Slava, YYYY-MM-DD: …` in "Context"), and return it for approval. Slava says yes →
`status: approved` (in the stage header and the hub table).

## Each section of a stage file

- **Header.** `id: <feature>-NN`; `branch: task/<feature>-NN-short-name`. `writer` = who writes the *production*
  code: `Slava` if it is in `backend/src/main/`, `agent` for frontend and docs. `tests`: `tester` for backend
  stages, `none` for frontend. `area`: backend | frontend | docs.
- **Who writes what.** Name each person or agent explicitly — Slava must see at a glance what is his.
- **Goal.** One or two sentences: what will be true. No "how".
- **Context.** Links like `docs/reference/technical-spec.md` → "8. API Endpoints" → `POST /api/bookings`. Grep that every
  heading you cite exists. Quote numbers (limits, status codes) with their section.
- **Allowed / not allowed.** Only narrowing on top of AGENTS.md: which paths may change, what must not. A stage that
  deletes files lists them and allows them (`docs/retro.md`, step 4). A new dependency is always Slava's decision.
- **Acceptance criteria.** Numbered; each is a checkable statement "X does Y when Z", with a label:
  - `[auto]` — a named test or command proves it: `[auto] ./mvnw verify: BookingConcurrencyTest is green`.
  - `[judge]` — only visible by reading code: behavior in cases tests do not cover, layer rules, PRD fit.
  - Half auto, half judge → split into two criteria.
  - The main behavior of the stage gets a `[judge]` criterion too, not only "tests are green".
  - For backend stages: say which tests the `tester` writes first (class name + what each proves), and give the
    API contract the tests rely on (endpoint, JSON fields, status codes, error format) — tests are written before
    the code and must compile without it.
  - The last criterion: which files are changed.
  - "Nice", "clean", "convenient" are not criteria — move them to "Check by eye".
- **Check by eye (Slava).** What to open or call (page, curl/Postman request) to see it work.
- **Out of scope.** What is tempting to do as well, and which later stage or feature does it.
- **Status.** Leave the template's starting values; the doer updates it (AGENTS.md → "Work protocol").

## Do not

- Invent product rules. A rule must come from the PRD, the spec or Slava's own words (the roadmap row, the
  chat). A decision only from Slava: cite it as `Slava, YYYY-MM-DD: …` and add it to the hub's "Decisions"; a
  product rule — also suggest adding it to the PRD. Neither → "Slava decides before approval" with options and your
  recommendation. Technical stages without a product section (setup, config) mark Context `tech`.
- Prescribe Slava's code line by line (private method names, exact classes) — he designs it. Fix only what tests
  and other stages depend on (endpoint, DTO fields, status codes, table and column names).
- Mix backend and frontend in one stage.

## Before handing back

1. Every section filled; every link and cited heading exists; every `[auto]` names a real command or test.
2. Re-read the criteria as the reviewer: for each one, is it clear what evidence proves it?
3. Return the paths and the full text. Slava approves each stage before work starts.
