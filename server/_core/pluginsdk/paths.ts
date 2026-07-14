import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import fg from 'fast-glob';
import type { Bl1nkConfig, ResolvedConfig } from './types.js';
import { PathResolutionError } from './errors.js';

/**
 * Resolve relative paths in config to absolute paths.
 * Throws PathResolutionError if paths don't exist.
 */
export function resolvePaths(
  config: Bl1nkConfig,
  pluginDir: string
): ResolvedConfig['components'] {
  const components = config.components || {};
  const absoluteDir = resolve(pluginDir);

  const result: ResolvedConfig['components'] = {
    agents: [],
    commands: [],
    skills: [],
    tools: [],
    hooks: [],
    themes: [],
  };

  // Resolve each component type
  for (const [type, patterns] of Object.entries(components)) {
    if (!patterns || !Array.isArray(patterns)) continue;
    if (!(type in result)) continue;

    for (const pattern of patterns) {
      const absolutePattern = join(absoluteDir, pattern);
      const matches = fg.sync(absolutePattern, { onlyFiles: false });

      if (matches.length === 0) {
        // Log warning for debugging - components may be optional
        console.warn(
          `[plugin-sdk] Pattern "${pattern}" in ${config.name} matched no files`
        );
        continue;
      }

      (result as Record<string, string[]>)[type].push(...matches);
    }
  }

  return result;
}

/**
 * Resolve context file path.
 * Throws PathResolutionError if file doesn't exist.
 */
export function resolveContextPath(
  config: Bl1nkConfig,
  pluginDir: string
): string {
  const absoluteDir = resolve(pluginDir);
  const contextPath = join(absoluteDir, config.contextFile);

  if (!existsSync(contextPath)) {
    throw new PathResolutionError(
      `Context file not found: ${config.contextFile}`,
      config.name,
      contextPath
    );
  }

  return contextPath;
}
