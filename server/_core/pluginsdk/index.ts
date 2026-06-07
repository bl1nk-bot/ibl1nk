// @ibl1nk/plugin-sdk
// SDK for reading and validating bl1nk.jsonc plugin configuration

export { loadPlugin, listPlugins, loadAllPlugins } from './config.js';
export { validateConfig } from './validate.js';
export { resolvePaths, resolveContextPath } from './paths.js';
export { substituteEnv, checkEnv } from './env.js';
export {
  PluginConfigError,
  PathResolutionError,
  ConfigValidationError,
} from './errors.js';
export type {
  Bl1nkConfig,
  ResolvedConfig,
  ValidationResult,
  ValidationFieldError,
  ValidationWarning,
} from './types.js';
