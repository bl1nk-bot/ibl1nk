// TypeScript types for plugin configuration

export interface Bl1nkConfig {
  name: string;
  version: string;
  description: string;
  contextFile: string;
  displayName?: string;
  components?: {
    agents?: string[];
    commands?: string[];
    skills?: string[];
    tools?: string[];
    hooks?: string[];
    themes?: string[];
  };
  dependencies?: string[];
  env?: {
    required?: string[];
    optional?: string[];
  };
}

export interface ResolvedConfig {
  pluginDir: string;
  config: Bl1nkConfig;
  contextFilePath: string;
  components: {
    agents: string[];
    commands: string[];
    skills: string[];
    tools: string[];
    hooks: string[];
    themes: string[];
  };
}

export interface ValidationFieldError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationFieldError[];
  warnings: ValidationWarning[];
}

export class PluginConfigError extends Error {
  constructor(message: string, public pluginName: string) {
    super(message);
    this.name = 'PluginConfigError';
  }
}

export class PathResolutionError extends PluginConfigError {
  constructor(message: string, pluginName: string, public path: string) {
    super(message, pluginName);
    this.name = 'PathResolutionError';
  }
}

export class ConfigValidationError extends PluginConfigError {
  constructor(message: string, pluginName: string, public errors: ValidationFieldError[]) {
    super(message, pluginName);
    this.name = 'ConfigValidationError';
  }
}
