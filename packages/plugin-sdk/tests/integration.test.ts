import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { loadPlugin, listPlugins, loadAllPlugins } from '../src/config.js';
import { PluginConfigError } from '../src/errors.js';

describe('config integration', () => {
  let testDir: string;
  let pluginsDir: string;

  beforeEach(() => {
    testDir = join(process.cwd(), 'tests', '__integration_test__');
    pluginsDir = join(testDir, 'plugins');
    try {
      rmSync(testDir, { recursive: true, force: true });
    } catch {}
    mkdirSync(pluginsDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe('loadPlugin', () => {
    it('should load a valid plugin', () => {
      const pluginDir = join(pluginsDir, 'test-plugin');
      mkdirSync(pluginDir, { recursive: true });
      writeFileSync(
        join(pluginDir, 'bl1nk.jsonc'),
        JSON.stringify({
          name: 'test-plugin',
          version: '1.0.0',
          description: 'A test plugin',
          contextFile: 'CONTEXT.md',
        })
      );
      writeFileSync(join(pluginDir, 'CONTEXT.md'), '# Context');

      const result = await loadPlugin(pluginDir);
      expect(result.config.name).toBe('test-plugin');
      expect(result.pluginDir).toBe(pluginDir);
      expect(result.contextFilePath).toBe(join(pluginDir, 'CONTEXT.md'));
    });

    it('should throw PluginConfigError for missing bl1nk.jsonc', async () => {
      const pluginDir = join(pluginsDir, 'no-config');
      mkdirSync(pluginDir, { recursive: true });

      await expect(loadPlugin(pluginDir)).rejects.toThrow(PluginConfigError);
    });

    it('should throw PluginConfigError for invalid JSONC', async () => {
      const pluginDir = join(pluginsDir, 'bad-json');
      mkdirSync(pluginDir, { recursive: true });
      writeFileSync(join(pluginDir, 'bl1nk.jsonc'), '{invalid json}');

      await expect(loadPlugin(pluginDir)).rejects.toThrow(PluginConfigError);
    });

    it('should parse JSONC with comments', () => {
      const pluginDir = join(pluginsDir, 'with-comments');
      mkdirSync(pluginDir, { recursive: true });
      writeFileSync(
        join(pluginDir, 'bl1nk.jsonc'),
        `{
          // This is a comment
          "name": "with-comments",
          "version": "1.0.0",
          /* Multi-line comment */
          "description": "Test",
          "contextFile": "CONTEXT.md"
        }`
      );
      writeFileSync(join(pluginDir, 'CONTEXT.md'), '# Context');

      const result = await loadPlugin(pluginDir);
      expect(result.config.name).toBe('with-comments');
    });
  });

  describe('listPlugins', () => {
    it('should list only directories with bl1nk.jsonc', async () => {
      // Create two valid plugins
      const plugin1 = join(pluginsDir, 'plugin-a');
      const plugin2 = join(pluginsDir, 'plugin-b');
      mkdirSync(plugin1, { recursive: true });
      mkdirSync(plugin2, { recursive: true });
      writeFileSync(join(plugin1, 'bl1nk.jsonc'), '{}'); // Invalid but exists
      writeFileSync(join(plugin2, 'bl1nk.jsonc'), '{}');

      // Create a directory without bl1nk.jsonc
      mkdirSync(join(pluginsDir, 'not-a-plugin'), { recursive: true });

      const result = await listPlugins(pluginsDir);
      expect(result).toContain('plugin-a');
      expect(result).toContain('plugin-b');
      expect(result).not.toContain('not-a-plugin');
    });

    it('should return empty array for empty plugins directory', async () => {
      const result = await listPlugins(pluginsDir);
      expect(result).toEqual([]);
    });
  });

  describe('loadAllPlugins', () => {
    it('should load all valid plugins', async () => {
      // Create two valid plugins
      for (const name of ['plugin-a', 'plugin-b']) {
        const pluginDir = join(pluginsDir, name);
        mkdirSync(pluginDir, { recursive: true });
        writeFileSync(
          join(pluginDir, 'bl1nk.jsonc'),
          JSON.stringify({
            name,
            version: '1.0.0',
            description: `Plugin ${name}`,
            contextFile: 'CONTEXT.md',
          })
        );
        writeFileSync(join(pluginDir, 'CONTEXT.md'), '# Context');
      }

      const results = await loadAllPlugins(pluginsDir);
      expect(results.length).toBe(2);
      expect(results.map((r) => r.config.name)).toContain('plugin-a');
      expect(results.map((r) => r.config.name)).toContain('plugin-b');
    });

    it('should skip invalid plugins and continue', async () => {
      // Create one valid and one invalid plugin
      const validDir = join(pluginsDir, 'valid');
      const invalidDir = join(pluginsDir, 'invalid');
      mkdirSync(validDir, { recursive: true });
      mkdirSync(invalidDir, { recursive: true });

      writeFileSync(
        join(validDir, 'bl1nk.jsonc'),
        JSON.stringify({
          name: 'valid',
          version: '1.0.0',
          description: 'Valid plugin',
          contextFile: 'CONTEXT.md',
        })
      );
      writeFileSync(join(validDir, 'CONTEXT.md'), '# Context');
      writeFileSync(join(invalidDir, 'bl1nk.jsonc'), '{}'); // Invalid

      const results = await loadAllPlugins(pluginsDir);
      expect(results.length).toBe(1);
      expect(results[0].config.name).toBe('valid');
    });
  });
});
