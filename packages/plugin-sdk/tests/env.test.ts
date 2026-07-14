import { describe, it, expect } from 'vitest';
import { substituteEnv, checkEnv } from '../src/env.js';
import type { Bl1nkConfig } from '../src/types.js';

describe('substituteEnv', () => {
  it('should substitute ${VAR_NAME} syntax', () => {
    const result = substituteEnv('python ${pluginPath}/scripts/hook.py', {
      pluginPath: '/plugins/test',
    });
    expect(result).toBe('python /plugins/test/scripts/hook.py');
  });

  it('should substitute $VAR_NAME syntax', () => {
    const result = substituteEnv('echo $HOME/dir', {
      HOME: '/Users/test',
    });
    expect(result).toBe('echo /Users/test/dir');
  });

  it('should leave unsubstituted vars unchanged', () => {
    const result = substituteEnv('python ${MISSING}/script.py');
    expect(result).toBe('python ${MISSING}/script.py');
  });

  it('should handle multiple substitutions', () => {
    const result = substituteEnv('${a} + ${b} = ${c}', {
      a: '1',
      b: '2',
      c: '3',
    });
    expect(result).toBe('1 + 2 = 3');
  });

  it('should handle empty string', () => {
    expect(substituteEnv('')).toBe('');
  });

  it('should handle string with no variables', () => {
    expect(substituteEnv('hello world')).toBe('hello world');
  });

  it('should use system env vars when not in extraVars', () => {
    // This test depends on system environment
    const result = substituteEnv('path: $PATH');
    // PATH should exist on most systems
    expect(result).not.toBe('path: $PATH');
    expect(result).toContain('path: ');
  });
});

describe('checkEnv', () => {
  it('should return empty arrays when no env config', () => {
    const config: Bl1nkConfig = {
      name: 'test',
      version: '1.0.0',
      description: 'test',
      contextFile: 'TEST.md',
    };
    const result = checkEnv(config);
    expect(result.missing).toEqual([]);
    expect(result.present).toEqual([]);
  });

  it('should detect missing required env vars', () => {
    const config: Bl1nkConfig = {
      name: 'test',
      version: '1.0.0',
      description: 'test',
      contextFile: 'TEST.md',
      env: {
        required: ['NONEXISTENT_VAR_12345'],
      },
    };
    const result = checkEnv(config);
    expect(result.missing).toContain('NONEXISTENT_VAR_12345');
    expect(result.present).toEqual([]);
  });

  it('should detect present env vars', () => {
    // Set a temp env var for testing
    process.env.TEST_VAR_12345 = 'value';

    const config: Bl1nkConfig = {
      name: 'test',
      version: '1.0.0',
      description: 'test',
      contextFile: 'TEST.md',
      env: {
        required: ['TEST_VAR_12345'],
      },
    };
    const result = checkEnv(config);
    expect(result.missing).toEqual([]);
    expect(result.present).toContain('TEST_VAR_12345');

    delete process.env.TEST_VAR_12345;
  });

  it('should handle both required and optional', () => {
    process.env.PRESENT_REQUIRED = 'value';
    process.env.PRESENT_OPTIONAL = 'value';

    const config: Bl1nkConfig = {
      name: 'test',
      version: '1.0.0',
      description: 'test',
      contextFile: 'TEST.md',
      env: {
        required: ['PRESENT_REQUIRED', 'MISSING_REQUIRED'],
        optional: ['PRESENT_OPTIONAL', 'MISSING_OPTIONAL'],
      },
    };
    const result = checkEnv(config);
    expect(result.missing).toContain('MISSING_REQUIRED');
    expect(result.missing).not.toContain('MISSING_OPTIONAL');
    expect(result.present).toContain('PRESENT_REQUIRED');
    expect(result.present).toContain('PRESENT_OPTIONAL');

    delete process.env.PRESENT_REQUIRED;
    delete process.env.PRESENT_OPTIONAL;
  });
});
