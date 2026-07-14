import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { resolvePaths, resolveContextPath } from '../../server/_core/pluginsdk/paths.js';
import { PathResolutionError } from '../../server/_core/pluginsdk/errors.js';
import type { Bl1nkConfig } from '../../server/_core/pluginsdk/types.js';

describe('paths', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(process.cwd(), 'tests', '__test_plugin__');
    // Clean up before test
    try {
      rmSync(testDir, { recursive: true, force: true });
    } catch {}
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe('resolveContextPath', () => {
    it('should resolve existing context file', () => {
      writeFileSync(join(testDir, 'CONTEXT.md'), '# Context');
      const config: Bl1nkConfig = {
        name: 'test',
        version: '1.0.0',
        description: 'test',
        contextFile: 'CONTEXT.md',
      };

      const result = resolveContextPath(config, testDir);
      expect(result).toBe(join(testDir, 'CONTEXT.md'));
    });

    it('should throw PathResolutionError for missing context file', () => {
      const config: Bl1nkConfig = {
        name: 'test',
        version: '1.0.0',
        description: 'test',
        contextFile: 'MISSING.md',
      };

      expect(() => resolveContextPath(config, testDir)).toThrow(
        PathResolutionError
      );
    });
  });

  describe('resolvePaths', () => {
    it('should resolve existing component patterns', () => {
      // Create test structure
      mkdirSync(join(testDir, 'skills', 'my-skill'), { recursive: true });
      writeFileSync(join(testDir, 'skills', 'my-skill', 'SKILL.md'), '');

      const config: Bl1nkConfig = {
        name: 'test',
        version: '1.0.0',
        description: 'test',
        contextFile: 'CONTEXT.md',
        components: {
          skills: ['skills/*/SKILL.md'],
        },
      };

      const result = resolvePaths(config, testDir);
      expect(result.skills.length).toBe(1);
      expect(result.skills[0]).toBe(
        join(testDir, 'skills', 'my-skill', 'SKILL.md')
      );
    });

    it('should return empty array for non-matching patterns', () => {
      const config: Bl1nkConfig = {
        name: 'test',
        version: '1.0.0',
        description: 'test',
        contextFile: 'CONTEXT.md',
        components: {
          agents: ['agents/*.md'],
        },
      };

      const result = resolvePaths(config, testDir);
      expect(result.agents).toEqual([]);
    });

    it('should handle multiple patterns', () => {
      mkdirSync(join(testDir, 'commands'), { recursive: true });
      writeFileSync(join(testDir, 'commands', 'cmd1.toml'), '');
      writeFileSync(join(testDir, 'commands', 'cmd2.md'), '');

      const config: Bl1nkConfig = {
        name: 'test',
        version: '1.0.0',
        description: 'test',
        contextFile: 'CONTEXT.md',
        components: {
          commands: ['commands/*.toml', 'commands/*.md'],
        },
      };

      const result = resolvePaths(config, testDir);
      expect(result.commands.length).toBe(2);
    });

    it('should handle empty components', () => {
      const config: Bl1nkConfig = {
        name: 'test',
        version: '1.0.0',
        description: 'test',
        contextFile: 'CONTEXT.md',
      };

      const result = resolvePaths(config, testDir);
      expect(result.agents).toEqual([]);
      expect(result.commands).toEqual([]);
      expect(result.skills).toEqual([]);
    });
  });
});
