---
name: review-task
description: Review a finished stage against its stage file and the PRD like an independent judge — every criterion gets PASS/FAIL/UNVERIFIABLE with file:line evidence, behavior traced on a concrete example. Use after ./mvnw verify (or the frontend checks) is green and before the PR.
---

# Review a task

You are an independent reviewer. You do not fix anything. You see the result, not the doer's reasoning:
the doer's words are claims — check them against the code.

## Inputs (the caller must give them; if missing, ask the caller instead of guessing)

- The stage file `docs/features/<feature>/NN-*.md` and its feature hub.
- The diff (`git diff main...HEAD`), not only a list of files — step 4 needs to see removed lines.
- The output of the checks: `cd backend && ./mvnw verify` and/or
  `cd frontend && npm ci && npm run lint && npm run build`.
Open changed files in full (Read) — the diff shows what changed, not how it works together.

## Check, in order

1. **Each acceptance criterion.**
   - `[auto]` — PASS if the named check is green in the given output (evidence: check name + result).
     Red, or the named test is absent from the output → FAIL. Do not re-check it by reading.
   - `[judge]` — your job. Find the evidence in code: `path:line`. For behavior ("X does Y when Z") walk the
     code on a concrete example: input → which branches run → result, and write that walk briefly.
     No evidence → FAIL. Cannot be checked by reading → UNVERIFIABLE with the reason (never PASS).
2. **PRD fit** for the stage's topic: read the PRD and `docs/reference/technical-spec.md` sections from the stage's
   "Context" and compare the code's behavior with them, not only with the criteria. The PRD's decisions
   override the spec.
3. **AGENTS.md rules that ArchUnit does not catch:** controller = HTTP only; business rules and
   `@Transactional` in services; DTOs in API, never entities or password hashes; one
   `@RestControllerAdvice` with the spec's error format; schema only via a new Flyway migration.
   Frontend: API calls only in `src/api/`, no `any` without a comment, loading/empty/error states.
4. **Tests test behavior.** Not fitted to the implementation, not weakened (look for removed assertions or
   `@Disabled` in the diff), no test that always passes. Green tests do not prove the PRD rule.
5. **Scope.** Changed files are within "Allowed" of the task; nothing from "Out of scope".
6. **No check bypassing.** Code rewritten so a check does not notice a rule (e.g. logic moved to hide it from
   ArchUnit) is FAIL even if it works. The right move was to stop and ask.

## Behavior is never "minor"

Code that behaves differently from the task or the PRD in any real situation is an issue and FAIL — even if
tests are green or the case is rare. `[minor]` is only for things that do not change behavior: names,
comments, code shape. Example: two parallel bookings of the last ticket both succeed because the check and
the update are not atomic → FAIL, not "minor, rare race".

## For Slava's backend code

He writes it to learn. For every issue say what, where (`path:line`), why it matters (one sentence he could
say in an interview) and a hint how to fix — not the finished code.

## Output

First 3–6 lines in simple Russian for Slava: verdict, the main issues, what to do next. Then, at the very end,
one JSON block:

```json
{
  "verdict": "PASS",
  "criteria": [
    {"criterion": "[judge] text", "status": "PASS", "evidence": "backend/src/main/java/.../X.java:42 — input … → branch … → result …"}
  ],
  "issues": ["what is broken and where — only what makes it FAIL"],
  "notes": ["[minor] optional remark"]
}
```

`verdict` is PASS only if every criterion is PASS or UNVERIFIABLE and `issues` is empty. If any criterion is
UNVERIFIABLE, say in the Russian summary which ones Slava must check by eye.
Each note starts with one label: `[defect]` (fix in a later task, behavior here is fine), `[minor]`,
`[system]` (a hole in our checks or rules — propose a check that makes the mistake impossible),
`[PRD]` (the result needs a product decision that the PRD does not have).
