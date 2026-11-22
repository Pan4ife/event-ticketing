<!-- One stage = one PR. Fill every section; "—" if nothing. Slava reviews and merges. -->

## What was done
One or two sentences.

**Stage file:** `docs/features/<feature>/NN-*.md` · **Hub:** `docs/features/<feature>/README.md`
**Who wrote the code:** Slava | frontend-dev agent · **Tests first:** tester agent | none

## Checks (run for this PR)
- [ ] `cd backend && ./mvnw verify` — green (tests: N, new: N)
- [ ] `cd frontend && npm ci && npm run lint && npm run build` — green (frontend changes only)
- [ ] `git diff --name-only main` — only files the stage allows

## Reviewer verdict
Verdict (ACCEPT / ACCEPT WITH NOTES / REJECT) and one line per criterion: `N. PASS|FAIL|UNVERIFIABLE — file:line`.

## Check by eye (Slava)
Copied from the stage file — what to open or call.
- [ ] ...

## Docs updated (AGENTS.md → "Work protocol")
- [ ] Stage file → "Status" (done / left / risks)
- [ ] Hub → stages table and "Status"
- [ ] `docs/roadmap.md` — if the feature status changed
- [ ] `docs/retro.md` — 3–5 lines (backend stages always; others when something went wrong)

## New files
One line each: link — what it is — who creates and changes it.
- —
