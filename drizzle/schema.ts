import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * SQLite compatible version.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role").default("user").notNull(), // role: "user" | "admin"
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Projects ───────────────────────────────────────────────────

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("active"), // status: "active" | "completed" | "archived"
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// ── Outline & Story Structure ──────────────────────────────────

export const outlines = sqliteTable("outlines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  projectId: integer("projectId").references(() => projects.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  craftDocumentId: text("craftDocumentId"),
  craftCollectionId: text("craftCollectionId"),
  status: text("status").default("draft"), // status: "draft" | "in_progress" | "completed" | "archived"
  wordCount: integer("wordCount").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type Outline = typeof outlines.$inferSelect;
export type InsertOutline = typeof outlines.$inferInsert;

// ── Chapters & Scenes ───────────────────────────────────────────

export const chapters = sqliteTable("chapters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  outlineId: integer("outlineId").notNull().references(() => outlines.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  chapterNumber: integer("chapterNumber"),
  craftBlockId: text("craftBlockId"),
  status: text("status").default("planning"), // status: "planning" | "writing" | "reviewing" | "completed"
  wordCount: integer("wordCount").default(0),
  order: integer("order").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = typeof chapters.$inferInsert;

export const scenes = sqliteTable("scenes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chapterId: integer("chapterId").notNull().references(() => chapters.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  sceneNumber: integer("sceneNumber"),
  craftBlockId: text("craftBlockId"),
  status: text("status").default("planning"), // status: "planning" | "writing" | "reviewing" | "completed"
  wordCount: integer("wordCount").default(0),
  order: integer("order").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type Scene = typeof scenes.$inferSelect;
export type InsertScene = typeof scenes.$inferInsert;

// ── Characters ──────────────────────────────────────────────────

export const characters = sqliteTable("characters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  outlineId: integer("outlineId").references(() => outlines.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  traits: text("traits"), // JSON array of traits
  role: text("role"), // protagonist, antagonist, supporting, etc.
  craftCollectionItemId: text("craftCollectionItemId"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type Character = typeof characters.$inferSelect;
export type InsertCharacter = typeof characters.$inferInsert;

export const characterRelationships = sqliteTable("characterRelationships", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  character1Id: integer("character1Id").notNull().references(() => characters.id, { onDelete: "cascade" }),
  character2Id: integer("character2Id").notNull().references(() => characters.id, { onDelete: "cascade" }),
  relationshipType: text("relationshipType"), // friend, enemy, family, romantic, etc.
  description: text("description"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type CharacterRelationship = typeof characterRelationships.$inferSelect;
export type InsertCharacterRelationship = typeof characterRelationships.$inferInsert;

// ── Content Analysis ────────────────────────────────────────────

export const contentAnalysis = sqliteTable("contentAnalysis", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  outlineId: integer("outlineId").references(() => outlines.id, { onDelete: "cascade" }),
  chapterId: integer("chapterId").references(() => chapters.id, { onDelete: "cascade" }),
  sceneId: integer("sceneId").references(() => scenes.id, { onDelete: "cascade" }),
  analysisType: text("analysisType"), // themes, conflicts, significance, sentiment, etc.
  content: text("content"), // JSON result of analysis
  sentimentScore: text("sentimentScore"), // positive, negative, neutral, mixed
  keywordDensity: text("keywordDensity"), // JSON object of keyword frequencies
  highlights: text("highlights"), // JSON array of important passages
  suggestions: text("suggestions"), // JSON array of improvement suggestions
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type ContentAnalysis = typeof contentAnalysis.$inferSelect;
export type InsertContentAnalysis = typeof contentAnalysis.$inferInsert;

// ── Obsidian Sync Metadata ──────────────────────────────────────

export const obsidianSync = sqliteTable("obsidianSync", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  vaultPath: text("vaultPath").notNull(),
  filePath: text("filePath").notNull(),
  craftDocumentId: text("craftDocumentId"),
  lastSyncedAt: integer("lastSyncedAt", { mode: "timestamp" }),
  fileHash: text("fileHash"), // SHA256 hash for change detection
  syncStatus: text("syncStatus").default("pending"), // syncStatus: "pending" | "synced" | "failed" | "conflict"
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type ObsidianSync = typeof obsidianSync.$inferSelect;
export type InsertObsidianSync = typeof obsidianSync.$inferInsert;

// ── Writing Progress ────────────────────────────────────────────

export const writingProgress = sqliteTable("writingProgress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  outlineId: integer("outlineId").references(() => outlines.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // YYYY-MM-DD
  wordsWritten: integer("wordsWritten").default(0),
  sessionsCompleted: integer("sessionsCompleted").default(0),
  notes: text("notes"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type WritingProgress = typeof writingProgress.$inferSelect;
export type InsertWritingProgress = typeof writingProgress.$inferInsert;

// ── Slack Integration ────────────────────────────────────────────

export const slackIntegration = sqliteTable("slackIntegration", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  slackUserId: text("slackUserId").notNull(),
  slackTeamId: text("slackTeamId").notNull(),
  accessToken: text("accessToken"), // Encrypted
  refreshToken: text("refreshToken"), // Encrypted
  tokenExpiresAt: integer("tokenExpiresAt", { mode: "timestamp" }),
  isActive: integer("isActive").default(1),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type SlackIntegration = typeof slackIntegration.$inferSelect;
export type InsertSlackIntegration = typeof slackIntegration.$inferInsert;

// ── Craft API Credentials ────────────────────────────────────────

export const craftCredentials = sqliteTable("craftCredentials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  accessToken: text("accessToken").notNull(), // Encrypted
  refreshToken: text("refreshToken"), // Encrypted
  tokenExpiresAt: integer("tokenExpiresAt", { mode: "timestamp" }),
  spaceId: text("spaceId"),
  isActive: integer("isActive").default(1),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type CraftCredentials = typeof craftCredentials.$inferSelect;
export type InsertCraftCredentials = typeof craftCredentials.$inferInsert;

// ── Plot Outline Nodes ──────────────────────────────────────────

export const plotOutlineNodes = sqliteTable("plotOutlineNodes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  outlineId: integer("outlineId").notNull().references(() => outlines.id, { onDelete: "cascade" }),
  parentId: integer("parentId"), // For hierarchical plot structure
  title: text("title").notNull(),
  content: text("content"),
  type: text("type").default("beat"), // beat, plot_point, pinch_point, etc.
  order: integer("order").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type PlotOutlineNode = typeof plotOutlineNodes.$inferSelect;
export type InsertPlotOutlineNode = typeof plotOutlineNodes.$inferInsert;

// ── Notes ───────────────────────────────────────────────────────

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  projectId: integer("projectId").references(() => projects.id, { onDelete: "set null" }),
  outlineId: integer("outlineId").references(() => outlines.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  content: text("content"),
  tags: text("tags"), // JSON array
  isPinned: integer("isPinned").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

// ── Tasks ───────────────────────────────────────────────────────

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  projectId: integer("projectId").references(() => projects.id, { onDelete: "set null" }),
  outlineId: integer("outlineId").references(() => outlines.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("todo"), // status: "todo" | "in_progress" | "done" | "cancelled"
  priority: text("priority").default("medium"), // priority: "low" | "medium" | "high" | "urgent"
  dueDate: integer("dueDate", { mode: "timestamp" }),
  parentTaskId: integer("parentTaskId"), // For subtasks
  order: integer("order").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// ── Lore Entries ────────────────────────────────────────────────

export const loreEntries = sqliteTable("loreEntries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  projectId: integer("projectId").references(() => projects.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  content: text("content"),
  category: text("category"), // world, magic_system, history, etc.
  tags: text("tags"), // JSON array
  relatedLoreIds: text("relatedLoreIds"), // JSON array of IDs
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type LoreEntry = typeof loreEntries.$inferSelect;
export type InsertLoreEntry = typeof loreEntries.$inferInsert;