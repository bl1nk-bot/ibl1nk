import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  InsertProject, projects,
  InsertOutline, outlines,
  InsertChapter, chapters,
  InsertScene, scenes,
  InsertCharacter, characters,
  InsertCharacterRelationship, characterRelationships,
  InsertContentAnalysis, contentAnalysis,
  InsertWritingProgress, writingProgress,
  InsertCraftCredentials, craftCredentials,
  InsertObsidianSync, obsidianSync,
  InsertSlackIntegration, slackIntegration,
  InsertPlotOutlineNode, plotOutlineNodes,
  InsertNote, notes,
  InsertTask, tasks,
  InsertLoreEntry, loreEntries,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ── Outline Queries ────────────────────────────────────────────

export async function getUserOutlines(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(outlines).where(eq(outlines.userId, userId));
}

export async function getOutlineById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(outlines).where(and(eq(outlines.id, id), eq(outlines.userId, userId))).limit(1);
  return result[0];
}

export async function createOutline(data: InsertOutline) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(outlines).values(data);
  return result;
}

export async function updateOutline(id: number, userId: number, data: Partial<InsertOutline>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(outlines).set(data).where(and(eq(outlines.id, id), eq(outlines.userId, userId)));
}

// ── Chapter Queries ────────────────────────────────────────────

export async function getChaptersByOutlineId(outlineId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chapters).where(eq(chapters.outlineId, outlineId)).orderBy(chapters.order);
}

export async function createChapter(data: InsertChapter) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(chapters).values(data);
}

export async function updateChapter(id: number, data: Partial<InsertChapter>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(chapters).set(data).where(eq(chapters.id, id));
}

// ── Scene Queries ──────────────────────────────────────────────

export async function getScenesByChapterId(chapterId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(scenes).where(eq(scenes.chapterId, chapterId)).orderBy(scenes.order);
}

export async function createScene(data: InsertScene) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(scenes).values(data);
}

export async function updateScene(id: number, data: Partial<InsertScene>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(scenes).set(data).where(eq(scenes.id, id));
}

// ── Character Queries ──────────────────────────────────────────

export async function getCharactersByOutlineId(outlineId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(characters).where(eq(characters.outlineId, outlineId));
}

export async function getCharactersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(characters).where(eq(characters.userId, userId));
}

export async function createCharacter(data: InsertCharacter) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(characters).values(data);
}

export async function updateCharacter(id: number, data: Partial<InsertCharacter>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(characters).set(data).where(eq(characters.id, id));
}

export async function getCharacterRelationships(characterId: number) {
  const db = await getDb();
  if (!db) return [];
  const { or } = await import("drizzle-orm");
  return db.select().from(characterRelationships).where(
    or(
      eq(characterRelationships.character1Id, characterId),
      eq(characterRelationships.character2Id, characterId)
    )
  );
}

export async function createCharacterRelationship(data: InsertCharacterRelationship) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(characterRelationships).values(data);
}

// ── Content Analysis Queries ───────────────────────────────────

export async function getAnalysisForOutline(outlineId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contentAnalysis).where(eq(contentAnalysis.outlineId, outlineId));
}

export async function createAnalysis(data: InsertContentAnalysis) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(contentAnalysis).values(data);
}

// ── Writing Progress Queries ───────────────────────────────────

export async function getWritingProgressForUser(userId: number, days: number = 30) {
  const db = await getDb();
  if (!db) return [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const dateStr = startDate.toISOString().split('T')[0];
  
  const { gte, and: andDrizzle } = await import("drizzle-orm");
  return db.select().from(writingProgress).where(
    andDrizzle(
      eq(writingProgress.userId, userId),
      gte(writingProgress.date, dateStr)
    )
  ).orderBy(writingProgress.date);
}

export async function createWritingProgress(data: InsertWritingProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(writingProgress).values(data);
}

// ── Craft Credentials Queries ──────────────────────────────────

export async function getCraftCredentials(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(craftCredentials).where(eq(craftCredentials.userId, userId)).limit(1);
  return result[0];
}

export async function saveCraftCredentials(data: InsertCraftCredentials) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getCraftCredentials(data.userId);
  if (existing) {
    return db.update(craftCredentials).set(data).where(eq(craftCredentials.userId, data.userId));
  }
  return db.insert(craftCredentials).values(data);
}

// ── Obsidian Sync Queries ──────────────────────────────────────

export async function getObsidianSyncStatus(userId: number, filePath: string) {
  const db = await getDb();
  if (!db) return undefined;
  const { and: andDrizzle } = await import("drizzle-orm");
  const result = await db.select().from(obsidianSync).where(
    andDrizzle(
      eq(obsidianSync.userId, userId),
      eq(obsidianSync.filePath, filePath)
    )
  ).limit(1);
  return result[0];
}

export async function createOrUpdateObsidianSync(data: InsertObsidianSync) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getObsidianSyncStatus(data.userId, data.filePath);
  if (existing) {
    return db.update(obsidianSync).set(data).where(eq(obsidianSync.id, existing.id));
  }
  return db.insert(obsidianSync).values(data);
}

// ── Slack Integration Queries ──────────────────────────────────

export async function getSlackIntegration(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(slackIntegration).where(eq(slackIntegration.userId, userId)).limit(1);
  return result[0];
}

export async function saveSlackIntegration(data: InsertSlackIntegration) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getSlackIntegration(data.userId);
  if (existing) {
    return db.update(slackIntegration).set(data).where(eq(slackIntegration.userId, data.userId));
  }
  return db.insert(slackIntegration).values(data);
}

// ── Project Queries ────────────────────────────────────────────

export async function getUserProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(projects.updatedAt);
}

export async function getProjectById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(and(eq(projects.id, id), eq(projects.userId, userId))).limit(1);
  return result[0];
}

export async function createProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(projects).values(data);
}

export async function updateProject(id: number, userId: number, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(projects).set(data).where(and(eq(projects.id, id), eq(projects.userId, userId)));
}

// ── Note Queries ───────────────────────────────────────────────

export async function getNotesByProject(projectId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notes).where(and(eq(notes.projectId, projectId), eq(notes.userId, userId))).orderBy(notes.updatedAt);
}

export async function getNotesByOutline(outlineId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notes).where(and(eq(notes.outlineId, outlineId), eq(notes.userId, userId))).orderBy(notes.updatedAt);
}

export async function createNote(data: InsertNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(notes).values(data);
}

export async function updateNote(id: number, userId: number, data: Partial<InsertNote>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(notes).set(data).where(and(eq(notes.id, id), eq(notes.userId, userId)));
}

export async function deleteNote(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
}

// ── Task Queries ───────────────────────────────────────────────

export async function getTasksByProject(projectId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(and(eq(tasks.projectId, projectId), eq(tasks.userId, userId))).orderBy(tasks.order);
}

export async function getTasksByOutline(outlineId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(and(eq(tasks.outlineId, outlineId), eq(tasks.userId, userId))).orderBy(tasks.order);
}

export async function createTask(data: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(tasks).values(data);
}

export async function updateTask(id: number, userId: number, data: Partial<InsertTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(tasks).set(data).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

export async function deleteTask(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

// ── Lore Queries ───────────────────────────────────────────────

export async function getLoreByProject(projectId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(loreEntries).where(and(eq(loreEntries.projectId, projectId), eq(loreEntries.userId, userId))).orderBy(loreEntries.updatedAt);
}

export async function createLoreEntry(data: InsertLoreEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(loreEntries).values(data);
}

export async function updateLoreEntry(id: number, userId: number, data: Partial<InsertLoreEntry>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(loreEntries).set(data).where(and(eq(loreEntries.id, id), eq(loreEntries.userId, userId)));
}

export async function deleteLoreEntry(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(loreEntries).where(and(eq(loreEntries.id, id), eq(loreEntries.userId, userId)));
}

// ── Plot Outline Queries ───────────────────────────────────────

export async function getPlotNodesByOutline(outlineId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plotOutlineNodes).where(eq(plotOutlineNodes.outlineId, outlineId)).orderBy(plotOutlineNodes.order);
}

export async function createPlotNode(data: InsertPlotOutlineNode) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(plotOutlineNodes).values(data);
}

export async function updatePlotNode(id: number, data: Partial<InsertPlotOutlineNode>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(plotOutlineNodes).set(data).where(eq(plotOutlineNodes.id, id));
}
