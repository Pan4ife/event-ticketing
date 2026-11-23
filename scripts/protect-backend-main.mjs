// Lock for AI agents: blocks agent edits and shell commands that write inside backend/src/main/
// (that code is written by Slava only — AGENTS.md, "Who writes what").
//
// One script for three agents' "before tool use" hooks; the config passes --agent=<name>:
//   Claude Code — .claude/settings.json (PreToolUse: Edit|Write|MultiEdit|NotebookEdit|Bash|PowerShell)
//   Codex       — .codex/hooks.json     (PreToolUse: apply_patch + Bash; the path is inside the patch text)
//   Cursor      — .cursor/hooks.json    (preToolUse: Write|Delete, and beforeShellExecution)
//
// How it answers "blocked" (formats from each agent's hooks docs, links in docs/agents-setup.md):
//   claude — exit 2 + reason on stderr + JSON {hookSpecificOutput: {permissionDecision: "deny"}} on stdout
//   cursor — exit 2 + reason on stderr + JSON {permission: "deny"} on stdout
//   codex  — exit 0 + the same JSON as claude on stdout (+ reason on stderr). Codex on Windows runs hooks through
//            `powershell.exe -Command`, which turns exit code 2 into 1, and Codex treats 1 as "hook failed" and lets
//            the edit through. JSON on stdout reaches Codex unchanged; Codex reads it only on exit 0.
// Input that is not JSON is blocked too (Slava's choice): a lock that cannot read its input must not open.
//
// What is checked:
//   - file tools: only file-path fields and patch headers, so editing a doc that merely mentions the path is fine;
//   - shell commands: a simple rule, not a parser — the command names a src/main folder AND contains something
//     that writes (redirection >, Set-Content, Out-File, sed -i, cp, mv, rm, git checkout, ...).
//     Reading (cat, grep, Get-Content, git diff) passes. It can be bypassed (a script that writes the file, a path
//     built from pieces) and may block a harmless command that only reads from that folder; it is a guardrail,
//     not a guarantee — the rule in AGENTS.md and PR review stay the real protection.

const AGENT = (process.argv.find((arg) => arg.startsWith("--agent=")) ?? "--agent=claude").slice("--agent=".length);

const PROTECTED_PATH = /(^|\/)backend\/src\/main(\/|$)/;
const PATH_KEYS = new Set(["file_path", "filePath", "path", "notebook_path", "target_file", "targetFile"]);
const PATCH_HEADER = /^\*\*\* (?:Add File|Update File|Delete File|Move to): (.+)$/gm;

const SHELL_TOOLS = new Set(["Bash", "PowerShell", "Shell"]);
// "src/main" as a folder (not frontend's src/main.tsx): backend/src/main/..., or src/main after `cd backend`.
const SHELL_TARGET = /(^|[\s"'`=(/])src\/main(?=\/|[\s"'`;|&)]|$)/i;
// Redirections that write nowhere: 2>&1, >/dev/null, >$null, >nul.
const HARMLESS_REDIRECT = /\d?>&\d|[\d*]?>>?\s*(\/dev\/null|\$null|nul)(?=[\s;|&)]|$)/gi;
const WRITE_WORDS = [
    // PowerShell cmdlets and their short aliases
    "Set-Content", "Add-Content", "Clear-Content", "Out-File", "Tee-Object", "New-Item", "Remove-Item", "Copy-Item",
    "Move-Item", "Rename-Item", "sc", "ac", "ni", "ri", "cpi", "mi", "rni",
    // cmd and Unix commands
    "del", "erase", "copy", "move", "ren", "rd", "rm", "rmdir", "cp", "mv", "tee", "touch", "truncate", "mkdir",
    "ln", "install", "dd", "rsync", "patch",
];
const SHELL_WRITE = [
    />/, // any redirection left after removing the harmless ones
    new RegExp(`(^|[\\s;&|({"'\`])(${WRITE_WORDS.join("|")})(?=$|[\\s;&|)}"'\`])`, "i"),
    /(WriteAll|AppendAll)(Text|Lines|Bytes)/i, // [IO.File]::WriteAllText(...)
    /\b(sed|perl)\b[^;&|\n]*\s(-[a-z]*i|--in-place)/i, // in-place edit
    /\bgit\s+(checkout|restore|apply|mv|rm|reset|stash|clean|switch|merge|pull|cherry-pick|revert|am)\b/i,
];

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

function shellCommand(payload) {
    const command =
        payload.hook_event_name === "beforeShellExecution"
            ? payload.command
            : SHELL_TOOLS.has(payload.tool_name)
              ? payload.tool_input?.command
              : undefined;
    return Array.isArray(command) ? command.join(" ") : typeof command === "string" ? command : undefined;
}

function shellWritesProtected(command) {
    const normalized = command.replaceAll("\\", "/");
    if (!SHELL_TARGET.test(normalized)) return false;
    const withoutHarmless = normalized.replace(HARMLESS_REDIRECT, " ");
    return SHELL_WRITE.some((rule) => rule.test(withoutHarmless));
}

// JSON with only ASCII characters, so no shell or code page on the way can damage it.
function asciiJson(value) {
    return JSON.stringify(value).replace(/[\u007f-￿]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

function block(what) {
    const reason =
        `Blocked: ${what} - production backend code in backend/src/main/ is written by Slava only ` +
        `(AGENTS.md, "Who writes what"). Explain or suggest the change in chat instead.`;
    const json =
        AGENT === "cursor"
            ? { permission: "deny", user_message: reason, agent_message: reason }
            : { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason } };
    process.stderr.write(`${reason}\n`);
    process.stdout.write(`${asciiJson(json)}\n`);
    process.exitCode = AGENT === "codex" ? 0 : 2; // exitCode, not process.exit(): let stdout/stderr finish writing
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
    let payload;
    try {
        payload = JSON.parse(raw);
    } catch {
        payload = undefined;
    }
    if (!payload || typeof payload !== "object") {
        block("the lock could not read the hook input (not a JSON object), so it does not let the call through");
        return;
    }
    const paths = collectPaths(payload.tool_input ?? {}, "", []);
    const hit = paths.find((p) => PROTECTED_PATH.test(p.trim().replaceAll("\\", "/")));
    if (hit) {
        block(`${hit} is in backend/src/main/`);
        return;
    }
    const command = shellCommand(payload);
    if (command && shellWritesProtected(command)) {
        block(`this shell command writes into backend/src/main/: ${command.slice(0, 200)}`);
    }
});
