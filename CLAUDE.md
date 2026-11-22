@AGENTS.md

## Only for Claude Code

- The project rules are in `AGENTS.md` (imported above) — one source for Claude Code, Codex and Cursor.
  Change rules there, not here.
- The hook in `.claude/settings.json` blocks Edit/Write in `backend/src/main/`. If it blocks you, do not work
  around it with Bash or PowerShell — explain the change to Slava in chat instead.
- Talk to Slava in simple Russian. Decisions that are his — ask with AskUserQuestion, one decision per question,
  your recommendation first.
- When you show a new file, give one line: link — what it is — who creates and changes it.
