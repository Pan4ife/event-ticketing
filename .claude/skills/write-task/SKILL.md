---
name: write-task
description: Turn one plan line into a task file docs/tasks/NNN-short-name.md from docs/tasks/_template.md — goal, PRD links, allowed files, criteria labelled [auto]/[judge], check by eye, out of scope. Use when Slava wants a new task written.
---

# Write a task

The task is the only thing the doer knows about the work, besides `AGENTS.md`. What is not in the task does
not exist for the doer — they do not see this chat. The reviewer later checks the work criterion by criterion.

## Inputs (read them, do not recall them)

1. The plan line from Slava (later: `docs/roadmap.md`).
2. The PRD sections it is about — `docs/PRD.md`, read in full, including Part 1 "Project decisions" (they
   override Part 2).
3. `AGENTS.md` and `docs/tasks/_template.md`.
4. What already exists: earlier tasks in `docs/tasks/`, the code and tests they produced (Grep/Glob).

## Write each section

- **Header.** `id` — next free number in `docs/tasks/` (three digits); file `NNN-short-name.md`;
  `branch: task/NNN-short-name`. `writer` = who writes the *production* code: `Slava` if it is in
  `backend/src/main/` (tests in such a task are still written by the `tester` — say so in the criteria),
  `agent` for frontend and docs. `area`: backend | frontend | docs.
- **Goal.** One or two sentences: what will be true. No "how".
- **Context.** Links like `docs/PRD.md` → "8. API Endpoints" → `POST /api/bookings`. Grep that every heading
  you cite exists. Quote numbers (limits, status codes) with their PRD section.
- **Allowed / not allowed.** Only narrowing on top of AGENTS.md: which paths may change, what must not.
  If the doer has a choice and Slava has an opinion — write the choice down here.
- **Acceptance criteria.** Numbered; each is a checkable statement "X does Y when Z", with a label:
  - `[auto]` — a named test or command proves it: `[auto] ./mvnw verify: BookingConcurrencyTest is green`.
  - `[judge]` — only visible by reading code: behavior in cases tests do not cover, layer rules, PRD fit.
  - Half auto, half judge → split into two criteria.
  - The main behavior of the task gets a `[judge]` criterion too, not only "tests are green".
  - For backend tasks: say which tests the `tester` writes first (class name + what each proves), and give
    the API contract the tests rely on (endpoint, JSON fields, status codes, error format from PRD
    "Error Handling") — tests are written before the code and must compile without it.
  - The last criterion: which files are changed.
  - "Nice", "clean", "convenient" are not criteria — move them to "Check by eye".
- **Check by eye (Slava).** What to open or call (page, curl/Postman request) to see it work.
- **Out of scope.** What is tempting to do as well, and which later task does it.

## Size

One task = one small vertical piece (one endpoint, one rule, one page). If it needs more than ~5 criteria
or touches more than one feature — propose splitting it.

## Do not

- Invent product rules. A rule must come from the PRD or from Slava's own words (the plan line, the chat).
  A decision only from Slava: cite it in "Context" as `Slava, YYYY-MM-DD: …` and suggest adding it to the PRD.
  Neither → do not write the task; return the open question (what is missing, options, your recommendation)
  so the main session asks Slava. Technical tasks without a PRD section (setup, config) mark Context `tech`.
- Prescribe Slava's code line by line (private method names, exact classes) — he designs it. Fix only what
  tests and other tasks depend on (endpoint, DTO fields, status codes).
- Mix backend and frontend in one task.

## Before handing back

1. Every section filled; every PRD link exists; every `[auto]` names a real command or test.
2. Re-read the criteria as the reviewer: for each one, is it clear what evidence proves it?
3. Return the full task text and the file path. Slava approves it before work starts.
