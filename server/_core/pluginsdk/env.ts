import type { Bl1nkConfig } from './types.js';

/**
 * Substitute environment variables in a string.
 * Supports ${VAR_NAME} and $VAR_NAME syntax.
 * Also supports custom variables passed via extraVars.
 */
export function substituteEnv(
  str: string,
  extraVars: Record<string, string> = {}
): string {
  // Merge system env vars with extraVars (extraVars take precedence)
  const vars: Record<string, string> = { ...process.env, ...extraVars };

  // Replace ${VAR_NAME} syntax
  str = str.replace(/\$\{([^}]+)\}/g, (_match, varName) => {
    return vars[varName] || _match;
  });

  // Replace $VAR_NAME syntax (word characters only)
  str = str.replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_match, varName) => {
    return vars[varName] || _match;
  });

  return str;
}

/**
 * Check if required environment variables are set.
 * Returns lists of missing and present variables.
 */
export function checkEnv(config: Bl1nkConfig): {
  missing: string[];
  present: string[];
} {
  const required = config.env?.required || [];
  const optional = config.env?.optional || [];
  const allVars = [...new Set([...required, ...optional])];

  const missing: string[] = [];
  const present: string[] = [];

  for (const v of allVars) {
    if (process.env[v]) {
      present.push(v);
    } else if (required.includes(v)) {
      missing.push(v);
    }
  }

  return { missing, present };
}
