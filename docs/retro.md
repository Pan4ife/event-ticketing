# Retro — what went wrong and what we changed

One entry per lesson, newest first. 3–5 lines: what happened → why it was not caught → what changes (best: a new
check, not a new "be careful" sentence). Written by the agent of the stage in the same PR, before Slava merges
(AGENTS.md → "Work protocol"); also after any surprise outside a stage.

## 2026-11-23 — Why the Codex lock did not block, and the fix (roadmap item 0)

- **What happened:** Codex on Windows runs hooks through `powershell.exe -Command`, which turns our exit code `2` into
  `1`; Codex treats `1` as "hook failed" and lets the edit through.
- **Why not caught earlier:** we tested the script by running it ourselves (exit 2 was there), never through the shell
  the agent actually uses.
- **What changes:** the script answers Codex with JSON on exit 0 (not damaged by any shell); shell commands are locked
  too; bad input closes the lock. New check: `node scripts/protect-backend-main.test.mjs` runs the Codex examples through
  `powershell.exe`, like Codex does. Live re-check: blocked on Claude Code, Codex and Cursor.
- **Details:** [`agents-setup.md`](agents-setup.md) → "Fixed: the lock works on all three".

## 2026-11-23 — The Codex lock did not block (step 4)

- **What happened:** in the rules check Codex refused to edit `backend/src/main/` when asked — but when Slava allowed
  one direct attempt, the edit went through. Codex logged `hook: PreToolUse Failed`; the edit was reverted at once.
- **Why not caught earlier:** the lock script was tested only on Claude Code (step 3) and by feeding it input by hand.
  Our script answers `Blocked` with exit code 2; this Codex build (Windows, 0.169.0-alpha) did not treat that as a block.
- **What changes:** roadmap item 0 — the script also answers in the JSON form (`permissionDecision: "deny"`) from the
  Codex hooks docs, shell commands get a lock too, then the lock check is repeated on Codex and Claude Code.
  Until then the rule in `AGENTS.md` and PR review protect `backend/src/main/` on Codex.
- **Details:** [`agents-setup.md`](agents-setup.md) → "Finding: the Codex lock did not block".

## 2026-11-23 — A task contradicted itself (step 4)

- **What happened:** the trial task asked to remove unused starter files but did not allow changes in
  `frontend/public/`, so all three agents left `public/icons.svg`.
- **What changes:** a stage that deletes files lists them and allows them (`write-task` skill; see
  [`features/auth/05-frontend-pages.md`](features/auth/05-frontend-pages.md)).
