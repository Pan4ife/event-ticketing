// Lock for AI agents: blocks any agent edit inside backend/src/main/ (that code is written by Slava only).
// One script for three agents' "before tool use" hooks:
//   Claude Code — .claude/settings.json (PreToolUse: Edit|Write|MultiEdit|NotebookEdit)
//   Codex       — .codex/hooks.json      (PreToolUse: apply_patch, path is inside the patch text)
//   Cursor      — .cursor/hooks.json     (preToolUse: Write|Delete)
// Reads the hook payload (JSON) from stdin. Exit 2 + message on stderr = "blocked" for all three agents.
// Only file-path fields and patch headers are checked, so editing a doc that merely mentions the path is fine.

const PROTECTED = /(^|\/)backend\/src\/main(\/|$)/;
const PATH_KEYS = new Set(["file_path", "filePath", "path", "notebook_path", "target_file", "targetFile"]);
const PATCH_HEADER = /^\*\*\* (?:Add File|Update File|Delete File|Move to): (.+)$/gm;

function collectPaths(value, key, out) {
    if (typeof value === "string") {
        if (PATH_KEYS.has(key)) out.push(value);
        for (const match of value.matchAll(PATCH_HEADER)) out.push(match[1]);
    } else if (Array.isArray(value)) {
        for (const item of value) collectPaths(item, key, out);
    } else if (value && typeof value === "object") {
        for (const [k, v] of Object.entries(value)) collectPaths(v, k, out);
    }
    return out;
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
    let payload;
    try {
        payload = JSON.parse(raw);
    } catch {
        process.exit(0); // not a hook payload — nothing to check
    }
    const paths = collectPaths(payload.tool_input ?? {}, "", []);
    const hit = paths.find((p) => PROTECTED.test(p.trim().replaceAll("\\", "/")));
    if (hit) {
        process.stderr.write(
            `Blocked: ${hit} is in backend/src/main/ — production backend code is written by Slava only ` +
                `(AGENTS.md, "Who writes what"). Explain or suggest the change in chat instead.\n`,
        );
        process.exit(2);
    }
    process.exit(0);
});
