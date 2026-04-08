import { describe, it, expect } from 'vitest';
import { validateConfig } from '../src/validate.js';
import type { Bl1nkConfig } from '../src/types.js';

describe('validateConfig', () => {
  it('should validate a correct config', () => {
    const config: Bl1nkConfig = {
      name: 'my-plugin',
      version: '1.0.0',
      description: 'A test plugin',
      contextFile: 'CONTEXT.md',
    };
    const result = validateConfig(config);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should reject config missing required fields', () => {
    const config = { name: 'test' } as Bl1nkConfig;
    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should reject invalid name (not kebab-case)', () => {
    const config: Bl1nkConfig = {
      name: 'MyPlugin',
      version: '1.0.0',
      description: 'test',
      contextFile: 'TEST.md',
    };
    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    const nameError = result.errors.find((e) => e.field === '/name');
    expect(nameError).toBeDefined();
  });

  it('should accept kebab-case name', () => {
    const config: Bl1nkConfig = {
      name: 'my-test-plugin',
      version: '1.0.0',
      description: 'test',
      contextFile: 'TEST.md',
    };
    const result = validateConfig(config);
    expect(result.valid).toBe(true);
  });

  it('should reject invalid version (not semver)', () => {
    const config: Bl1nkConfig = {
      name: 'test',
      version: '1.0',
      description: 'test',
      contextFile: 'TEST.md',
    };
    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    const versionError = result.errors.find((e) => e.field === '/version');
    expect(versionError).toBeDefined();
  });

  it('should accept valid semver', () => {
    const config: Bl1nkConfig = {
      name: 'test',
      version: '0.1.0',
      description: 'test',
      contextFile: 'TEST.md',
    };
    const result = validateConfig(config);
    expect(result.valid).toBe(true);
  });

  it('should reject empty description', () => {
    const config: Bl1nkConfig = {
      name: 'test',
      version: '1.0.0',
      description: '',
      contextFile: 'TEST.md',
    };
    const result = validateConfig(config);
    expect(result.valid).toBe(false);
  });

  it('should reject invalid contextFile', () => {
    const config: Bl1nkConfig = {
      name: 'test',
      version: '1.0.0',
      description: 'test',
      contextFile: '../etc/passwd',
    };
    const result = validateConfig(config);
    expect(result.valid).toBe(false);
  });

  it('should warn about missing displayName', () => {
    const config: Bl1nkConfig = {
      name: 'test',
      version: '1.0.0',
      description: 'test',
      contextFile: 'TEST.md',
    };
    const result = validateConfig(config);
    expect(result.valid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
    const displayNameWarning = result.warnings.find(
      (w) => w.field === 'displayName'
    );
    expect(displayNameWarning).toBeDefined();
  });

  it('should not warn when displayName is present', () => {
    const config: Bl1nkConfig = {
      name: 'test',
      version: '1.0.0',
      description: 'test',
      contextFile: 'TEST.md',
      displayName: 'Test Plugin',
    };
    const result = validateConfig(config);
    expect(result.valid).toBe(true);
    expect(result.warnings).toEqual([]);
  });

  it('should validate components structure', () => {
    const config: Bl1nkConfig = {
      name: 'test',
      version: '1.0.0',
      description: 'test',
      contextFile: 'TEST.md',
      components: {
        agents: ['agents/*.md'],
        commands: ['commands/*.toml'],
        skills: ['skills/*/SKILL.md'],
      },
    };
    const result = validateConfig(config);
    expect(result.valid).toBe(true);
  });

  it('should reject additional properties', () => {
    const config = {
      name: 'test',
      version: '1.0.0',
      description: 'test',
      contextFile: 'TEST.md',
      unknownField: 'value',
    } as Bl1nkConfig;
    const result = validateConfig(config);
    expect(result.valid).toBe(false);
  });
});
