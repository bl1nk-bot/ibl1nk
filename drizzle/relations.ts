import { relations } from "drizzle-orm/relations";
import {
  users,
  projects,
  outlines,
  chapters,
  scenes,
  characters,
  characterRelationships,
  contentAnalysis,
  obsidianSync,
  writingProgress,
  slackIntegration,
  craftCredentials,
  plotOutlineNodes,
  notes,
  tasks,
  loreEntries,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  outlines: many(outlines),
  characters: many(characters),
  contentAnalysis: many(contentAnalysis),
  obsidianSync: many(obsidianSync),
  writingProgress: many(writingProgress),
  slackIntegration: many(slackIntegration),
  craftCredentials: many(craftCredentials),
  notes: many(notes),
  tasks: many(tasks),
  loreEntries: many(loreEntries),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  outlines: many(outlines),
  notes: many(notes),
  tasks: many(tasks),
  loreEntries: many(loreEntries),
}));

export const outlinesRelations = relations(outlines, ({ one, many }) => ({
  user: one(users, {
    fields: [outlines.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [outlines.projectId],
    references: [projects.id],
  }),
  chapters: many(chapters),
  characters: many(characters),
  contentAnalysis: many(contentAnalysis),
  writingProgress: many(writingProgress),
  plotOutlineNodes: many(plotOutlineNodes),
  notes: many(notes),
  tasks: many(tasks),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  outline: one(outlines, {
    fields: [chapters.outlineId],
    references: [outlines.id],
  }),
  scenes: many(scenes),
  contentAnalysis: many(contentAnalysis),
}));

export const scenesRelations = relations(scenes, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [scenes.chapterId],
    references: [chapters.id],
  }),
  contentAnalysis: many(contentAnalysis),
}));

export const charactersRelations = relations(characters, ({ one, many }) => ({
  user: one(users, {
    fields: [characters.userId],
    references: [users.id],
  }),
  outline: one(outlines, {
    fields: [characters.outlineId],
    references: [outlines.id],
  }),
  relationships: many(characterRelationships, { relationName: "character1" }),
  relationshipsAsTarget: many(characterRelationships, { relationName: "character2" }),
}));

export const characterRelationshipsRelations = relations(characterRelationships, ({ one }) => ({
  character1: one(characters, {
    fields: [characterRelationships.character1Id],
    references: [characters.id],
    relationName: "character1",
  }),
  character2: one(characters, {
    fields: [characterRelationships.character2Id],
    references: [characters.id],
    relationName: "character2",
  }),
}));

export const contentAnalysisRelations = relations(contentAnalysis, ({ one }) => ({
  user: one(users, {
    fields: [contentAnalysis.userId],
    references: [users.id],
  }),
  outline: one(outlines, {
    fields: [contentAnalysis.outlineId],
    references: [outlines.id],
  }),
  chapter: one(chapters, {
    fields: [contentAnalysis.chapterId],
    references: [chapters.id],
  }),
  scene: one(scenes, {
    fields: [contentAnalysis.sceneId],
    references: [scenes.id],
  }),
}));

export const obsidianSyncRelations = relations(obsidianSync, ({ one }) => ({
  user: one(users, {
    fields: [obsidianSync.userId],
    references: [users.id],
  }),
}));

export const writingProgressRelations = relations(writingProgress, ({ one }) => ({
  user: one(users, {
    fields: [writingProgress.userId],
    references: [users.id],
  }),
  outline: one(outlines, {
    fields: [writingProgress.outlineId],
    references: [outlines.id],
  }),
}));

export const slackIntegrationRelations = relations(slackIntegration, ({ one }) => ({
  user: one(users, {
    fields: [slackIntegration.userId],
    references: [users.id],
  }),
}));

export const craftCredentialsRelations = relations(craftCredentials, ({ one }) => ({
  user: one(users, {
    fields: [craftCredentials.userId],
    references: [users.id],
  }),
}));

export const plotOutlineNodesRelations = relations(plotOutlineNodes, ({ one, many }) => ({
  outline: one(outlines, {
    fields: [plotOutlineNodes.outlineId],
    references: [outlines.id],
  }),
  parent: one(plotOutlineNodes, {
    fields: [plotOutlineNodes.parentId],
    references: [plotOutlineNodes.id],
    relationName: "plotHierarchy",
  }),
  children: many(plotOutlineNodes, { relationName: "plotHierarchy" }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [notes.projectId],
    references: [projects.id],
  }),
  outline: one(outlines, {
    fields: [notes.outlineId],
    references: [outlines.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  outline: one(outlines, {
    fields: [tasks.outlineId],
    references: [outlines.id],
  }),
  parentTask: one(tasks, {
    fields: [tasks.parentTaskId],
    references: [tasks.id],
    relationName: "taskHierarchy",
  }),
  subtasks: many(tasks, { relationName: "taskHierarchy" }),
}));

export const loreEntriesRelations = relations(loreEntries, ({ one }) => ({
  user: one(users, {
    fields: [loreEntries.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [loreEntries.projectId],
    references: [projects.id],
  }),
}));
