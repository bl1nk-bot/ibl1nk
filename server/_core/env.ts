/**
 * @module core/env
 * @description Centralized environment variables and system configuration.
 * @done 2026-04-10 — Added API v1, Memory Tool, and Sandbox configuration.
 * @tested @todo tests/core/env.test.ts
 * @status completed
 */

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
  telegramChatId: process.env.TELEGRAM_CHAT_ID ?? "",

  /* API v1 & Advanced Tooling Configuration */
  apiAuthSecret: process.env.API_AUTH_SECRET ?? process.env.JWT_SECRET ?? "dev_api_secret",
  memoryRoot: process.env.MEMORY_ROOT ?? "/memories",
  sandboxTimeout: parseInt(process.env.SANDBOX_TIMEOUT ?? "30000", 10),
  sandboxMemoryLimit: parseInt(process.env.SANDBOX_MEMORY_LIMIT ?? "128", 10), // MB

  /* Modal.com Credentials */
  modalTokenId: process.env.MODAL_TOKEN_ID ?? "",
  modalTokenSecret: process.env.MODAL_TOKEN_SECRET ?? "",
};
