import {
  execFile,
  spawn,
  type ChildProcessWithoutNullStreams,
} from "node:child_process";
import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const MAX_OUTPUT = 8_000;

type LoginState = {
  phase: "starting" | "waiting" | "complete" | "failed";
  output: string;
  error: string | null;
  startedAt: string;
  process?: ChildProcessWithoutNullStreams;
};

const loginStates = new Map<number, LoginState>();

function codexHome(userId: number) {
  const stateRoot =
    process.env.AGENT_AUTH_STATE_DIR ||
    join(homedir(), ".local", "state", "ibl1nk", "agent-auth");
  return join(stateRoot, "codex", String(userId));
}

async function codexEnv(userId: number) {
  const home = codexHome(userId);
  await mkdir(home, { recursive: true, mode: 0o700 });
  return { ...process.env, CODEX_HOME: home };
}

function appendOutput(state: LoginState, chunk: Buffer | string) {
  state.output = (state.output + chunk.toString()).slice(-MAX_OUTPUT);
  if (state.phase === "starting") state.phase = "waiting";
}

function executableMissing(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ENOENT"
  );
}

export async function getCodexAuthStatus(userId: number) {
  const active = loginStates.get(userId);
  try {
    const env = await codexEnv(userId);
    const { stdout, stderr } = await execFileAsync(
      "codex",
      ["login", "status"],
      { timeout: 10_000, env }
    );
    return {
      installed: true,
      connected: true,
      mode: (stdout || stderr).trim() || "ChatGPT",
      login: active
        ? { phase: active.phase, output: active.output, error: active.error }
        : null,
    };
  } catch (error) {
    return {
      installed: !executableMissing(error),
      connected: false,
      mode: null,
      login: active
        ? { phase: active.phase, output: active.output, error: active.error }
        : null,
    };
  }
}

export async function startCodexLogin(
  userId: number,
  mode: "browser" | "device"
) {
  const current = loginStates.get(userId);
  if (current?.process && !current.process.killed) {
    return { started: false, reason: "login_already_running" } as const;
  }

  const args = mode === "device" ? ["login", "--device-auth"] : ["login"];
  const env = await codexEnv(userId);
  const child = spawn("codex", args, {
    shell: false,
    stdio: ["pipe", "pipe", "pipe"],
    env,
  });
  const state: LoginState = {
    phase: "starting",
    output: "",
    error: null,
    startedAt: new Date().toISOString(),
    process: child,
  };
  loginStates.set(userId, state);

  child.stdout.on("data", chunk => appendOutput(state, chunk));
  child.stderr.on("data", chunk => appendOutput(state, chunk));
  child.on("error", error => {
    state.phase = "failed";
    state.error = executableMissing(error)
      ? "Codex CLI is not installed on the app host."
      : error.message;
    delete state.process;
  });
  child.on("exit", code => {
    state.phase = code === 0 ? "complete" : "failed";
    if (code !== 0 && !state.error) {
      state.error = `Codex login exited with code ${code ?? "unknown"}.`;
    }
    delete state.process;
  });

  return { started: true, mode } as const;
}

export async function logoutCodex(userId: number) {
  const active = loginStates.get(userId);
  if (active?.process && !active.process.killed) active.process.kill("SIGTERM");
  loginStates.delete(userId);
  const env = await codexEnv(userId);
  await execFileAsync("codex", ["logout"], { timeout: 10_000, env });
  return { success: true } as const;
}
