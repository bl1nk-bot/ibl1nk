import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Outline & Story Structure ──────────────────────────────────

export const outlines = mysqlTable("outlines", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  craftDocumentId: varchar("craftDocumentId", { length: 255 }),
  craftCollectionId: varchar("craftCollectionId", { length: 255 }),
  status: mysqlEnum("status", [
    "draft",
    "in_progress",
    "completed",
    "archived",
  ]).default("draft"),
  wordCount: int("wordCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Outline = typeof outlines.$inferSelect;
export type InsertOutline = typeof outlines.$inferInsert;

// ── Chapters & Scenes ───────────────────────────────────────────

export const chapters = mysqlTable("chapters", {
  id: int("id").autoincrement().primaryKey(),
  outlineId: int("outlineId")
    .notNull()
    .references(() => outlines.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  chapterNumber: int("chapterNumber"),
  craftBlockId: varchar("craftBlockId", { length: 255 }),
  status: mysqlEnum("status", [
    "planning",
    "writing",
    "reviewing",
    "completed",
  ]).default("planning"),
  wordCount: int("wordCount").default(0),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = typeof chapters.$inferInsert;

export const scenes = mysqlTable("scenes", {
  id: int("id").autoincrement().primaryKey(),
  chapterId: int("chapterId")
    .notNull()
    .references(() => chapters.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sceneNumber: int("sceneNumber"),
  craftBlockId: varchar("craftBlockId", { length: 255 }),
  status: mysqlEnum("status", [
    "planning",
    "writing",
    "reviewing",
    "completed",
  ]).default("planning"),
  wordCount: int("wordCount").default(0),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Scene = typeof scenes.$inferSelect;
export type InsertScene = typeof scenes.$inferInsert;

// ── Characters ──────────────────────────────────────────────────

export const characters = mysqlTable("characters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId")
    .notNull()
    .references(() => users.id),
  outlineId: int("outlineId").references(() => outlines.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  traits: text("traits"), // JSON array of traits
  role: varchar("role", { length: 100 }), // protagonist, antagonist, supporting, etc.
  craftCollectionItemId: varchar("craftCollectionItemId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Character = typeof characters.$inferSelect;
export type InsertCharacter = typeof characters.$inferInsert;

export const characterRelationships = mysqlTable("characterRelationships", {
  id: int("id").autoincrement().primaryKey(),
  character1Id: int("character1Id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  character2Id: int("character2Id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  relationshipType: varchar("relationshipType", { length: 100 }), // friend, enemy, family, romantic, etc.
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CharacterRelationship = typeof characterRelationships.$inferSelect;
export type InsertCharacterRelationship =
  typeof characterRelationships.$inferInsert;

// ── Content Analysis ────────────────────────────────────────────

export const contentAnalysis = mysqlTable("contentAnalysis", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId")
    .notNull()
    .references(() => users.id),
  outlineId: int("outlineId").references(() => outlines.id, {
    onDelete: "cascade",
  }),
  chapterId: int("chapterId").references(() => chapters.id, {
    onDelete: "cascade",
  }),
  sceneId: int("sceneId").references(() => scenes.id, { onDelete: "cascade" }),
  analysisType: varchar("analysisType", { length: 100 }), // themes, conflicts, significance, sentiment, etc.
  content: text("content"), // JSON result of analysis
  sentimentScore: varchar("sentimentScore", { length: 50 }), // positive, negative, neutral, mixed
  keywordDensity: text("keywordDensity"), // JSON object of keyword frequencies
  highlights: text("highlights"), // JSON array of important passages
  suggestions: text("suggestions"), // JSON array of improvement suggestions
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContentAnalysis = typeof contentAnalysis.$inferSelect;
export type InsertContentAnalysis = typeof contentAnalysis.$inferInsert;

// ── Obsidian Sync Metadata ──────────────────────────────────────

export const obsidianSync = mysqlTable("obsidianSync", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId")
    .notNull()
    .references(() => users.id),
  vaultPath: varchar("vaultPath", { length: 512 }).notNull(),
  filePath: varchar("filePath", { length: 512 }).notNull(),
  craftDocumentId: varchar("craftDocumentId", { length: 255 }),
  lastSyncedAt: timestamp("lastSyncedAt"),
  fileHash: varchar("fileHash", { length: 64 }), // SHA256 hash for change detection
  syncStatus: mysqlEnum("syncStatus", [
    "pending",
    "synced",
    "failed",
    "conflict",
  ]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ObsidianSync = typeof obsidianSync.$inferSelect;
export type InsertObsidianSync = typeof obsidianSync.$inferInsert;

// ── Writing Progress ────────────────────────────────────────────

export const writingProgress = mysqlTable("writingProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId")
    .notNull()
    .references(() => users.id),
  outlineId: int("outlineId").references(() => outlines.id, {
    onDelete: "cascade",
  }),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  wordsWritten: int("wordsWritten").default(0),
  sessionsCompleted: int("sessionsCompleted").default(0),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WritingProgress = typeof writingProgress.$inferSelect;
export type InsertWritingProgress = typeof writingProgress.$inferInsert;

// ── Slack Integration ────────────────────────────────────────────

export const slackIntegration = mysqlTable("slackIntegration", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId")
    .notNull()
    .references(() => users.id),
  slackUserId: varchar("slackUserId", { length: 255 }).notNull(),
  slackTeamId: varchar("slackTeamId", { length: 255 }).notNull(),
  accessToken: text("accessToken"), // Encrypted
  refreshToken: text("refreshToken"), // Encrypted
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  isActive: int("isActive").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SlackIntegration = typeof slackIntegration.$inferSelect;
export type InsertSlackIntegration = typeof slackIntegration.$inferInsert;

// ── Craft API Credentials ────────────────────────────────────────

export const craftCredentials = mysqlTable("craftCredentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId")
    .notNull()
    .references(() => users.id),
  accessToken: text("accessToken").notNull(), // Encrypted
  refreshToken: text("refreshToken"), // Encrypted
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  spaceId: varchar("spaceId", { length: 255 }),
  isActive: int("isActive").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CraftCredentials = typeof craftCredentials.$inferSelect;
export type InsertCraftCredentials = typeof craftCredentials.$inferInsert;
