/**
 * @module core/modal
 * @description Modal.com client wrapper for sandboxes, notebooks, and plugin runtime.
 * @done 2026-04-10 — Initial implementation of Modal.com REST API wrapper.
 * @tested @todo tests/core/modal.test.ts
 * @status completed
 */

import { ENV } from "./env";

const MODAL_API = 'https://api.modal.com/v1';

/**
 * Get Basic Auth string for Modal API.
 * @returns {string} - Base64 encoded ID:Secret string.
 * @throws {Error} - If Modal credentials are not in ENV.
 */
function getAuth(): string {
  const id = ENV.modalTokenId;
  const secret = ENV.modalTokenSecret;
  if (!id || !secret) {
    throw new Error('Modal.com credentials not configured. Set MODAL_TOKEN_ID and MODAL_TOKEN_SECRET.');
  }
  return Buffer.from(`${id}:${secret}`).toString('base64');
}

/**
 * Common headers for Modal API requests.
 * @returns {HeadersInit} - Authentication and content-type headers.
 */
function headers(): HeadersInit {
  return {
    'Authorization': `Basic ${getAuth()}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModalSandbox {
  sandbox_id: string;
  status: 'starting' | 'running' | 'stopped' | 'failed';
  image: string;
  created_at: number;
  tunnel_url?: string;
}

export interface ModalExecResult {
  stdout: string;
  stderr: string;
  exit_code: number;
  duration_ms?: number;
}

export interface ModalFunction {
  function_id: string;
  name: string;
  app_name: string;
  deployed_at?: string;
  web_url?: string;
}

// ─── Sandbox API ─────────────────────────────────────────────────────────────

export const ModalSandboxAPI = {
  /**
   * Create a new sandbox container.
   * @param {Object} [opts] - Sandbox options.
   * @param {string} [opts.image] - Image to use (default: python-3.11-slim).
   * @param {number} [opts.cpu] - Number of CPUs (default: 0.5).
   * @param {number} [opts.memory] - Memory in MB (default: 512).
   * @param {number} [opts.timeout] - Timeout in seconds (default: 300).
   * @param {Record<string, string>} [opts.env] - Environment variables.
   * @param {string} [opts.gpu] - GPU type if required.
   * @returns {Promise<ModalSandbox>} - Sandbox metadata.
   */
  async create(opts: {
    image?: string;
    cpu?: number;
    memory?: number;
    timeout?: number;
    env?: Record<string, string>;
    gpu?: string;
  } = {}): Promise<ModalSandbox> {
    const res = await fetch(`${MODAL_API}/sandboxes`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        image_id: opts.image ?? 'python-3.11-slim',
        cpu: opts.cpu ?? 0.5,
        memory_mb: opts.memory ?? 512,
        timeout_secs: opts.timeout ?? 300,
        environment_variables: opts.env ?? {},
        gpu_config: opts.gpu ? { type: opts.gpu } : undefined,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Modal sandbox create failed: ${res.status} ${err}`);
    }
    return res.json();
  },

  /** 
   * Get sandbox status and tunnel URL.
   * @param {string} sandboxId - Unique identifier of the sandbox.
   * @returns {Promise<ModalSandbox>} - Sandbox details.
   */
  async get(sandboxId: string): Promise<ModalSandbox> {
    const res = await fetch(`${MODAL_API}/sandboxes/${sandboxId}`, { headers: headers() });
    if (!res.ok) throw new Error(`Modal get sandbox failed: ${res.status}`);
    return res.json();
  },

  /** 
   * Execute a command in the sandbox container.
   * @param {string} sandboxId - Unique identifier of the sandbox.
   * @param {string | string[]} command - Command string or array to run.
   * @returns {Promise<ModalExecResult>} - Execution output and exit code.
   */
  async exec(sandboxId: string, command: string | string[]): Promise<ModalExecResult> {
    const cmd = Array.isArray(command) ? command : ['/bin/sh', '-c', command];
    const res = await fetch(`${MODAL_API}/sandboxes/${sandboxId}/exec`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ command: cmd }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Modal exec failed: ${res.status} ${err}`);
    }
    return res.json();
  },

  /** 
   * Terminate a sandbox container immediately.
   * @param {string} sandboxId - Unique identifier of the sandbox.
   * @returns {Promise<void>}
   */
  async terminate(sandboxId: string): Promise<void> {
    await fetch(`${MODAL_API}/sandboxes/${sandboxId}`, {
      method: 'DELETE',
      headers: headers(),
    });
  },

  /** 
   * List all currently running sandboxes.
   * @returns {Promise<ModalSandbox[]>} - Active sandboxes.
   */
  async list(): Promise<ModalSandbox[]> {
    const res = await fetch(`${MODAL_API}/sandboxes`, { headers: headers() });
    if (!res.ok) throw new Error(`Modal list sandboxes failed: ${res.status}`);
    const data = await res.json();
    return data.sandboxes ?? [];
  },
};

// ─── Plugin Runtime ───────────────────────────────────────────────────────────

export const ModalPluginRuntime = {
  /**
   * Execute a plugin skill in an ephemeral Modal sandbox.
   */
  async executeSkill(opts: {
    skillCode: string;
    language: 'python' | 'node';
    context: {
      selection?: string;
      content?: string;
      noteId?: number;
    };
    timeout?: number;
  }): Promise<{ output: string; error?: string; exit_code: number }> {
    const image = opts.language === 'python' ? 'python-3.11-slim' : 'node-18-slim';
    const ext = opts.language === 'python' ? 'py' : 'js';

    const sandbox = await ModalSandboxAPI.create({ image, timeout: opts.timeout ?? 60 });

    try {
      const contextJson = JSON.stringify(opts.context);
      await ModalSandboxAPI.exec(sandbox.sandbox_id,
        `echo '${opts.skillCode.replace(/'/g, "'\\''")}' > /tmp/skill.${ext} && ` +
        `echo '${contextJson.replace(/'/g, "'\\''")}' > /tmp/context.json`
      );

      const runner = opts.language === 'python'
        ? `python /tmp/skill.${ext}`
        : `node /tmp/skill.${ext}`;

      const result = await ModalSandboxAPI.exec(sandbox.sandbox_id, runner);
      return {
        output: result.stdout,
        error: result.stderr,
        exit_code: result.exit_code
      };
    } finally {
      await ModalSandboxAPI.terminate(sandbox.sandbox_id).catch(() => {});
    }
  },
};

// ─── Health check ─────────────────────────────────────────────────────────────

/**
 * Verify connection to Modal.com API.
 */
export async function checkModalConnection(): Promise<boolean> {
  try {
    const res = await fetch(`${MODAL_API}/sandboxes?limit=1`, {
      headers: headers(),
      signal: AbortSignal.timeout(5000),
    });
    return res.ok || res.status === 200;
  } catch {
    return false;
  }
}
