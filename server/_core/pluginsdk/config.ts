import { join, resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'jsonc-parser';
import type { Bl1nkConfig, ResolvedConfig } from './types.js';
import { PluginConfigError, ConfigValidationError } from './errors.js';
import { validateConfig } from './validate.js';
import { resolvePaths, resolveContextPath } from './paths.js';

/**
 * Load and validate plugin configuration from bl1nk.jsonc.
 * Returns fully resolved config with absolute paths.
 */
export async function loadPlugin(pluginDir: string): Promise<ResolvedConfig> {
  const absoluteDir = resolve(pluginDir);
  const configPath = join(absoluteDir, 'bl1nk.jsonc');

  // Check if config file exists
  if (!existsSync(configPath)) {
    throw new PluginConfigError(
      `bl1nk.jsonc not found in ${pluginDir}`,
      'unknown'
    );
  }

  // Read and parse JSONC
  const content = readFileSync(configPath, 'utf-8');
  let config: Bl1nkConfig;

  try {
    config = parse(content) as Bl1nkConfig;
  } catch (err) {
    throw new PluginConfigError(
      `Failed to parse bl1nk.jsonc: ${(err as Error).message}`,
      'unknown'
    );
  }

  // Validate config
  const pluginName = config.name || 'unknown';
  const result = validateConfig(config);

  if (!result.valid) {
    throw new ConfigValidationError(
      `Invalid config: ${result.errors.map((e) => e.message).join(', ')}`,
      pluginName,
      result.errors
    );
  }

  // Resolve paths
  const contextFilePath = resolveContextPath(config, absoluteDir);
  const components = resolvePaths(config, absoluteDir);

  return {
    pluginDir: absoluteDir,
    config,
    contextFilePath,
    components,
  };
}

/**
 * List all plugin directories in plugins directory.
 * Each subdirectory should contain bl1nk.jsonc.
 */
export async function listPlugins(pluginsDir: string): Promise<string[]> {
  const { readdirSync } = await import('node:fs');
  const absoluteDir = resolve(pluginsDir);

  if (!existsSync(absoluteDir)) {
    throw new PluginConfigError(`Plugins directory not found: ${pluginsDir}`, 'unknown');
  }

  const entries = readdirSync(absoluteDir, { withFileTypes: true });

  // Filter directories that contain bl1nk.jsonc
  const plugins: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const configPath = join(absoluteDir, entry.name, 'bl1nk.jsonc');
    if (existsSync(configPath)) {
      plugins.push(entry.name);
    }
  }

  return plugins.sort();
}

/**
 * Load all plugins in a plugins directory.
 * Returns array of resolved configs.
 */
export async function loadAllPlugins(
  pluginsDir: string
): Promise<ResolvedConfig[]> {
  const pluginNames = await listPlugins(pluginsDir);
  const absoluteDir = resolve(pluginsDir);

  const results: ResolvedConfig[] = [];

  for (const name of pluginNames) {
    const pluginDir = join(absoluteDir, name);
    try {
      const resolved = await loadPlugin(pluginDir);
      results.push(resolved);
    } catch (err) {
      // Log warning but continue with other plugins
      console.warn(`Warning: Failed to load plugin "${name}": ${(err as Error).message}`);
    }
  }

  return results;
}
