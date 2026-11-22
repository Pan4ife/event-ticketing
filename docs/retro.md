# Retro — what went wrong and what we changed

One entry per lesson, newest first. 3–5 lines: what happened → why it was not caught → what changes (best: a new
check, not a new "be careful" sentence). Written by the agent of the stage in the same PR, before Slava merges
(AGENTS.md → "Work protocol"); also after any surprise outside a stage.

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
