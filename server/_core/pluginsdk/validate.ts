import Ajv from 'ajv';
import type { Bl1nkConfig, ValidationResult } from './types.js';

const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['name', 'version', 'description', 'contextFile'],
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-z][a-z0-9-]*$',
      errorMessage: 'must be kebab-case (lowercase letters, numbers, hyphens)',
    },
    version: {
      type: 'string',
      pattern: '^\\d+\\.\\d+\\.\\d+$',
      errorMessage: 'must be semver (e.g., 1.0.0)',
    },
    description: {
      type: 'string',
      minLength: 1,
    },
    contextFile: {
      type: 'string',
      pattern: '^[a-zA-Z0-9._-]+$',
    },
    displayName: {
      type: 'string',
    },
    components: {
      type: 'object',
      properties: {
        agents: { type: 'array', items: { type: 'string' } },
        commands: { type: 'array', items: { type: 'string' } },
        skills: { type: 'array', items: { type: 'string' } },
        tools: { type: 'array', items: { type: 'string' } },
        hooks: { type: 'array', items: { type: 'string' } },
        themes: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    },
    dependencies: {
      type: 'array',
      items: { type: 'string' },
    },
    env: {
      type: 'object',
      properties: {
        required: { type: 'array', items: { type: 'string' } },
        optional: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

const ajv = new Ajv({ allErrors: true });

export function validateConfig(config: Bl1nkConfig): ValidationResult {
  const validate = ajv.compile(schema);
  const valid = validate(config);

  if (!valid) {
    const errors = (validate.errors || []).map((err) => ({
      field: err.instancePath || 'root',
      message: err.message || 'unknown error',
    }));

    return {
      valid: false,
      errors,
      warnings: [],
    };
  }

  // Check for warnings (non-blocking)
  const warnings: ValidationResult['warnings'] = [];

  if (!config.displayName) {
    warnings.push({
      field: 'displayName',
      message: 'displayName is recommended for user-facing display',
    });
  }

  return {
    valid: true,
    errors: [],
    warnings,
  };
}
