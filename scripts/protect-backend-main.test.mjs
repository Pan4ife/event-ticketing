// Examples for the lock (scripts/protect-backend-main.mjs): each example is a hook payload written to a file and fed
// to the script as `node protect-backend-main.mjs --agent=<agent> < file`, then the answer is compared with the
// expected one. On Windows, the Codex examples run once more the way Codex runs hooks there:
// `powershell.exe -NoProfile -Command "node ..."` (that shell turns exit code 2 into 1 — the step 4 failure).
// Run from the repo root: node scripts/protect-backend-main.test.mjs   (exit 1 if any example fails)

import { spawnSync } from "node:child_process";
import { closeSync, mkdtempSync, openSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "protect-backend-main.mjs");
const MAIN = "D:\\event-ticketing\\backend\\src\\main\\java\\io\\github\\pan4ife\\eventticketing\\EventTicketingApplication.java";

const claudeTool = (tool_name, tool_input) => ({ hook_event_name: "PreToolUse", tool_name, tool_input });
const codexTool = (tool_name, command) => ({ hook_event_name: "PreToolUse", turn_id: "t1", tool_name, tool_input: { command } });
const patch = (header) => `*** Begin Patch\r\n*** ${header}\r\n@@\r\n+// trial\r\n*** End Patch\r\n`;
const cursorShell = (command) => ({ hook_event_name: "beforeShellExecution", cursor_version: "x", command, cwd: "D:\\event-ticketing" });

// [name, agent, payload (object, or a raw string), expected: "block" | "pass"]
const EXAMPLES = [
    // Claude Code — file tools
    ["claude Edit in backend/src/main", "claude", claudeTool("Edit", { file_path: MAIN, old_string: "a", new_string: "b" }), "block"],
    ["claude Write in frontend", "claude", claudeTool("Write", { file_path: "D:\\event-ticketing\\frontend\\src\\App.tsx", content: "x" }), "pass"],
    ["claude Edit of a doc that mentions the path", "claude", claudeTool("Edit", { file_path: "docs/retro.md", old_string: "a", new_string: "backend/src/main/ x" }), "pass"],
    // Claude Code — shell writes
    ["claude Bash redirect >", "claude", claudeTool("Bash", { command: "echo x > backend/src/main/java/X.java" }), "block"],
    ["claude Bash cd + append >>", "claude", claudeTool("Bash", { command: "cd backend && echo x >> src/main/java/X.java" }), "block"],
    ["claude Bash sed -i", "claude", claudeTool("Bash", { command: "sed -i 's/a/b/' backend/src/main/java/X.java" }), "block"],
    ["claude Bash cp into", "claude", claudeTool("Bash", { command: "cp /tmp/X.java backend/src/main/java/" }), "block"],
    ["claude Bash rm", "claude", claudeTool("Bash", { command: "rm backend/src/main/java/X.java" }), "block"],
    ["claude Bash git checkout --", "claude", claudeTool("Bash", { command: "git checkout -- backend/src/main/java/X.java" }), "block"],
    ["claude PowerShell Set-Content", "claude", claudeTool("PowerShell", { command: "Set-Content -Path backend\\src\\main\\java\\X.java -Value x" }), "block"],
    ["claude PowerShell Out-File", "claude", claudeTool("PowerShell", { command: "'x' | Out-File -FilePath backend/src/main/X.java" }), "block"],
    ["claude PowerShell Add-Content", "claude", claudeTool("PowerShell", { command: "Add-Content backend\\src\\main\\X.java 'x'" }), "block"],
    ["claude PowerShell Move-Item", "claude", claudeTool("PowerShell", { command: "Move-Item X.java backend/src/main/java/X.java" }), "block"],
    ["claude PowerShell Copy-Item", "claude", claudeTool("PowerShell", { command: "Copy-Item C:\\tmp\\X.java D:\\event-ticketing\\backend\\src\\main\\java\\" }), "block"],
    ["claude PowerShell WriteAllText", "claude", claudeTool("PowerShell", { command: "[IO.File]::WriteAllText('backend/src/main/X.java', 'x')" }), "block"],
    // Claude Code — shell reads and unrelated commands
    ["claude Bash cat", "claude", claudeTool("Bash", { command: "cat backend/src/main/java/X.java" }), "pass"],
    ["claude Bash grep 2>/dev/null", "claude", claudeTool("Bash", { command: 'grep -rn "Service" backend/src/main 2>/dev/null' }), "pass"],
    ["claude Bash ls 2>&1", "claude", claudeTool("Bash", { command: "ls backend/src/main 2>&1" }), "pass"],
    ["claude Bash git diff", "claude", claudeTool("Bash", { command: "git diff backend/src/main" }), "pass"],
    ["claude PowerShell Get-Content", "claude", claudeTool("PowerShell", { command: "Get-Content backend\\src\\main\\java\\X.java" }), "pass"],
    ["claude Bash write to frontend/src/main.tsx", "claude", claudeTool("Bash", { command: "echo x > frontend/src/main.tsx" }), "pass"],
    ["claude Bash build log", "claude", claudeTool("Bash", { command: "npm run build > build.log" }), "pass"],
    // Codex
    ["codex apply_patch Update in backend/src/main", "codex", codexTool("apply_patch", patch(`Update File: ${MAIN}`)), "block"],
    ["codex apply_patch Add in frontend", "codex", codexTool("apply_patch", patch("Add File: frontend/src/x.ts")), "pass"],
    ["codex Bash Set-Content", "codex", codexTool("Bash", "Set-Content backend/src/main/X.java x"), "block"],
    ["codex Bash argv array", "codex", codexTool("Bash", ["bash", "-lc", "echo x > backend/src/main/X.java"]), "block"],
    ["codex Bash git diff", "codex", codexTool("Bash", "git diff backend/src/main"), "pass"],
    // Cursor
    ["cursor preToolUse Write in backend/src/main", "cursor", claudeTool("Write", { file_path: MAIN }), "block"],
    ["cursor preToolUse Write in frontend", "cursor", claudeTool("Write", { file_path: "frontend/src/App.tsx" }), "pass"],
    ["cursor beforeShellExecution write", "cursor", cursorShell("echo x > backend/src/main/X.java"), "block"],
    ["cursor beforeShellExecution read", "cursor", cursorShell("cat backend/src/main/X.java"), "pass"],
    // Input that is not a JSON object is blocked (Slava's choice)
    ["claude input is not JSON", "claude", "not json", "block"],
    ["codex input is empty", "codex", "", "block"],
    ["cursor input is null", "cursor", "null", "block"],
];

// What a correct answer looks like for each agent (see the header of protect-backend-main.mjs).
function check(agent, expected, { status, stdout }) {
    if (expected === "pass") return status === 0 && stdout.trim() === "" ? null : `want exit 0 and no stdout`;
    let json;
    try {
        json = JSON.parse(stdout);
    } catch {
        return "stdout is not JSON";
    }
    const denied =
        agent === "cursor"
            ? json.permission === "deny"
            : json.hookSpecificOutput?.hookEventName === "PreToolUse" && json.hookSpecificOutput?.permissionDecision === "deny";
    const wantExit = agent === "codex" ? 0 : 2;
    if (!denied) return "JSON does not say deny";
    if (agent === "codex" && Object.keys(json).join() !== "hookSpecificOutput") return "Codex fails on extra JSON fields";
    return status === wantExit ? null : `want exit ${wantExit}`;
}

function run(inputFile, agent, viaPowerShell) {
    const stdin = openSync(inputFile, "r");
    try {
        const [program, args] = viaPowerShell
            ? ["powershell.exe", ["-NoProfile", "-Command", `node "${SCRIPT}" --agent=${agent}`]]
            : [process.execPath, [SCRIPT, `--agent=${agent}`]];
        const r = spawnSync(program, args, { stdio: [stdin, "pipe", "pipe"], encoding: "utf8", windowsHide: true });
        return { status: r.status, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
    } finally {
        closeSync(stdin);
    }
}

const dir = mkdtempSync(join(tmpdir(), "lock-examples-"));
let failed = 0;
try {
    EXAMPLES.forEach(([name, agent, payload, expected], i) => {
        const file = join(dir, `${i}.json`);
        writeFileSync(file, typeof payload === "string" ? payload : JSON.stringify(payload));
        const modes = agent === "codex" && process.platform === "win32" ? [false, true] : [false];
        for (const viaPowerShell of modes) {
            const result = run(file, agent, viaPowerShell);
            const problem = check(agent, expected, result);
            const label = `${name}${viaPowerShell ? " (via powershell.exe, like Codex on Windows)" : ""}`;
            console.log(`${problem ? "FAIL" : "ok  "}  ${expected.padEnd(5)}  exit=${result.status}  ${label}${problem ? `  <- ${problem}` : ""}`);
            if (problem) failed++;
        }
    });
} finally {
    rmSync(dir, { recursive: true, force: true });
}
console.log(failed ? `\n${failed} example(s) failed` : "\nall examples passed");
process.exitCode = failed ? 1 : 0;
