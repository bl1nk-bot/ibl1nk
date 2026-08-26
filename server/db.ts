import { and, eq, or, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  InsertOutline,
  outlines,
  InsertChapter,
  chapters,
  InsertScene,
  scenes,
  InsertCharacter,
  characters,
  InsertCharacterRelationship,
  characterRelationships,
  InsertContentAnalysis,
  contentAnalysis,
  InsertWritingProgress,
  writingProgress,
  InsertCraftCredentials,
  craftCredentials,
  InsertObsidianSync,
  obsidianSync,
  InsertSlackIntegration,
  slackIntegration,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

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
      values.role = "admin";
      updateSet.role = "admin";
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

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ── In-Memory Fallback Store for Local Development ─────────────
type MemoryStore = {
  users: any[];
  outlines: any[];
  chapters: any[];
  scenes: any[];
  characters: any[];
  characterRelationships: any[];
  contentAnalysis: any[];
  writingProgress: any[];
  craftCredentials: any[];
  obsidianSync: any[];
  slackIntegration: any[];
};

const memoryStore: MemoryStore = {
  users: [
    {
      id: 1,
      openId: "local-dev-writer",
      name: "Local Writer",
      email: "writer@local.dev",
      loginMethod: "local",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
  ],
  outlines: [
    {
      id: 1,
      userId: 1,
      title: "The Lost Kingdom",
      description: "A fantasy epic about rediscovering a hidden realm",
      status: "in_progress",
      wordCount: 45230,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      userId: 1,
      title: "Whispers of Change",
      description: "A contemporary drama about personal transformation",
      status: "in_progress",
      wordCount: 28500,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      userId: 1,
      title: "Coastal Mystery",
      description: "A mystery novel set in a small coastal town",
      status: "draft",
      wordCount: 5200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  chapters: [
    {
      id: 1,
      outlineId: 1,
      title: "The Awakening",
      description: "Aria discovers an ancient artifact",
      chapterNumber: 1,
      status: "completed",
      wordCount: 4250,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      outlineId: 1,
      title: "The Departure",
      description: "Leaving the sanctuary behind",
      chapterNumber: 2,
      status: "completed",
      wordCount: 3800,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      outlineId: 1,
      title: "Into the Mist",
      description: "First encounter with the guardians",
      chapterNumber: 3,
      status: "writing",
      wordCount: 2900,
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  scenes: [
    {
      id: 1,
      chapterId: 1,
      title: "Morning Routine in the Archives",
      description: "Setting the scene and introducing Aria's passion",
      sceneNumber: 1,
      status: "completed",
      wordCount: 1800,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      chapterId: 1,
      title: "The Broken Seal",
      description: "A strange glow emits from the stone pedestal",
      sceneNumber: 2,
      status: "completed",
      wordCount: 2450,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  characters: [
    {
      id: 1,
      userId: 1,
      outlineId: 1,
      name: "Aria",
      role: "protagonist",
      traits: "brave, curious, determined",
      description: "A 32-year-old scholar searching for her lost past",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      userId: 1,
      outlineId: 1,
      name: "Marcus",
      role: "mentor",
      traits: "wise, mysterious, protective",
      description: "An old guardian who returns with secrets",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      userId: 1,
      outlineId: 1,
      name: "Elena",
      role: "antagonist",
      traits: "ambitious, ruthless, intelligent",
      description: "A powerful leader with hidden motives",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      userId: 1,
      outlineId: 1,
      name: "James",
      role: "supporting",
      traits: "loyal, humorous, reliable",
      description: "Aria's closest companion and confidant",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  characterRelationships: [
    {
      id: 1,
      character1Id: 1,
      character2Id: 2,
      relationshipType: "mentor",
      description: "Marcus guides Aria in ancient history",
      createdAt: new Date(),
    },
    {
      id: 2,
      character1Id: 1,
      character2Id: 4,
      relationshipType: "friend",
      description: "Childhood friends who trust each other implicitly",
      createdAt: new Date(),
    },
  ],
  contentAnalysis: [],
  writingProgress: [
    {
      id: 1,
      userId: 1,
      outlineId: 1,
      date: "2026-08-05",
      wordsWritten: 2500,
      sessionsCompleted: 2,
      notes: "Chapter 1 start",
      createdAt: new Date(),
    },
    {
      id: 2,
      userId: 1,
      outlineId: 1,
      date: "2026-08-06",
      wordsWritten: 3200,
      sessionsCompleted: 3,
      notes: "Chapter 1 finish",
      createdAt: new Date(),
    },
    {
      id: 3,
      userId: 1,
      outlineId: 1,
      date: "2026-08-07",
      wordsWritten: 2800,
      sessionsCompleted: 2,
      notes: "Chapter 2 draft",
      createdAt: new Date(),
    },
    {
      id: 4,
      userId: 1,
      outlineId: 1,
      date: "2026-08-08",
      wordsWritten: 4100,
      sessionsCompleted: 4,
      notes: "Scene 2 rewrite",
      createdAt: new Date(),
    },
    {
      id: 5,
      userId: 1,
      outlineId: 1,
      date: "2026-08-09",
      wordsWritten: 5300,
      sessionsCompleted: 5,
      notes: "Chapter 3 start",
      createdAt: new Date(),
    },
    {
      id: 6,
      userId: 1,
      outlineId: 1,
      date: "2026-08-10",
      wordsWritten: 6680,
      sessionsCompleted: 6,
      notes: "Intense writing day",
      createdAt: new Date(),
    },
  ],
  craftCredentials: [],
  obsidianSync: [],
  slackIntegration: [],
};

let nextId = 100;

// ── Outline Queries ────────────────────────────────────────────

export async function getUserOutlines(userId: number) {
  const db = await getDb();
  if (!db) return memoryStore.outlines.filter(o => o.userId === userId);
  return db.select().from(outlines).where(eq(outlines.userId, userId));
}

export async function getOutlineById(id: number) {
  const db = await getDb();
  if (!db) return memoryStore.outlines.find(o => o.id === id);
  const result = await db
    .select()
    .from(outlines)
    .where(eq(outlines.id, id))
    .limit(1);
  return result[0];
}

export async function getOutlineByIdForUser(id: number, userId: number) {
  const db = await getDb();
  if (!db)
    return memoryStore.outlines.find(o => o.id === id && o.userId === userId);
  const result = await db
    .select()
    .from(outlines)
    .where(and(eq(outlines.id, id), eq(outlines.userId, userId)))
    .limit(1);
  return result[0];
}

export async function createOutline(data: InsertOutline) {
  const db = await getDb();
  if (!db) {
    const newOutline = {
      id: nextId++,
      userId: data.userId,
      title: data.title,
      description: data.description ?? null,
      craftDocumentId: data.craftDocumentId ?? null,
      craftCollectionId: data.craftCollectionId ?? null,
      status: data.status ?? "draft",
      wordCount: data.wordCount ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.outlines.push(newOutline);
    return [{ insertId: newOutline.id }];
  }
  return db.insert(outlines).values(data);
}

export async function updateOutline(id: number, data: Partial<InsertOutline>) {
  const db = await getDb();
  if (!db) {
    const item = memoryStore.outlines.find(o => o.id === id);
    if (item) {
      Object.assign(item, data, { updatedAt: new Date() });
    }
    return [{ affectedRows: 1 }];
  }
  return db.update(outlines).set(data).where(eq(outlines.id, id));
}

export async function updateOutlineForUser(
  id: number,
  userId: number,
  data: Partial<InsertOutline>
) {
  const db = await getDb();
  if (!db) {
    const item = memoryStore.outlines.find(
      o => o.id === id && o.userId === userId
    );
    if (item) {
      Object.assign(item, data, { updatedAt: new Date() });
    }
    return [{ affectedRows: 1 }];
  }
  return db
    .update(outlines)
    .set(data)
    .where(and(eq(outlines.id, id), eq(outlines.userId, userId)));
}

export async function deleteOutlineForUser(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    const idx = memoryStore.outlines.findIndex(
      o => o.id === id && o.userId === userId
    );
    if (idx !== -1) {
      memoryStore.outlines.splice(idx, 1);
    }
    return [{ affectedRows: 1 }];
  }
  return db
    .delete(outlines)
    .where(and(eq(outlines.id, id), eq(outlines.userId, userId)));
}

// ── Chapter Queries ────────────────────────────────────────────

export async function getChaptersByOutlineId(outlineId: number) {
  const db = await getDb();
  if (!db)
    return memoryStore.chapters
      .filter(c => c.outlineId === outlineId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  return db
    .select()
    .from(chapters)
    .where(eq(chapters.outlineId, outlineId))
    .orderBy(chapters.order);
}

export async function createChapter(data: InsertChapter) {
  const db = await getDb();
  if (!db) {
    const newChapter = {
      id: nextId++,
      outlineId: data.outlineId,
      title: data.title,
      description: data.description ?? null,
      chapterNumber: data.chapterNumber ?? null,
      craftBlockId: data.craftBlockId ?? null,
      status: data.status ?? "planning",
      wordCount: data.wordCount ?? 0,
      order: data.order ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.chapters.push(newChapter);
    return [{ insertId: newChapter.id }];
  }
  return db.insert(chapters).values(data);
}

export async function updateChapter(id: number, data: Partial<InsertChapter>) {
  const db = await getDb();
  if (!db) {
    const item = memoryStore.chapters.find(c => c.id === id);
    if (item) {
      Object.assign(item, data, { updatedAt: new Date() });
    }
    return [{ affectedRows: 1 }];
  }
  return db.update(chapters).set(data).where(eq(chapters.id, id));
}

export async function getChapterByIdForUser(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    const ch = memoryStore.chapters.find(c => c.id === id);
    if (!ch) return undefined;
    const outline = memoryStore.outlines.find(
      o => o.id === ch.outlineId && o.userId === userId
    );
    return outline ? { id: ch.id } : undefined;
  }
  const result = await db
    .select({ id: chapters.id })
    .from(chapters)
    .innerJoin(outlines, eq(chapters.outlineId, outlines.id))
    .where(and(eq(chapters.id, id), eq(outlines.userId, userId)))
    .limit(1);
  return result[0];
}

export async function deleteChapterForUser(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    const idx = memoryStore.chapters.findIndex(c => c.id === id);
    if (idx !== -1) {
      memoryStore.chapters.splice(idx, 1);
    }
    return [{ affectedRows: 1 }];
  }
  return db.delete(chapters).where(eq(chapters.id, id));
}

// ── Scene Queries ──────────────────────────────────────────────

export async function getScenesByChapterId(chapterId: number) {
  const db = await getDb();
  if (!db)
    return memoryStore.scenes
      .filter(s => s.chapterId === chapterId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  return db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapterId))
    .orderBy(scenes.order);
}

export async function createScene(data: InsertScene) {
  const db = await getDb();
  if (!db) {
    const newScene = {
      id: nextId++,
      chapterId: data.chapterId,
      title: data.title,
      description: data.description ?? null,
      sceneNumber: data.sceneNumber ?? null,
      craftBlockId: data.craftBlockId ?? null,
      status: data.status ?? "planning",
      wordCount: data.wordCount ?? 0,
      order: data.order ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.scenes.push(newScene);
    return [{ insertId: newScene.id }];
  }
  return db.insert(scenes).values(data);
}

export async function updateScene(id: number, data: Partial<InsertScene>) {
  const db = await getDb();
  if (!db) {
    const item = memoryStore.scenes.find(s => s.id === id);
    if (item) {
      Object.assign(item, data, { updatedAt: new Date() });
    }
    return [{ affectedRows: 1 }];
  }
  return db.update(scenes).set(data).where(eq(scenes.id, id));
}

export async function getSceneByIdForUser(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    const sc = memoryStore.scenes.find(s => s.id === id);
    if (!sc) return undefined;
    const ch = memoryStore.chapters.find(c => c.id === sc.chapterId);
    if (!ch) return undefined;
    const outline = memoryStore.outlines.find(
      o => o.id === ch.outlineId && o.userId === userId
    );
    return outline ? { id: sc.id } : undefined;
  }
  const result = await db
    .select({ id: scenes.id })
    .from(scenes)
    .innerJoin(chapters, eq(scenes.chapterId, chapters.id))
    .innerJoin(outlines, eq(chapters.outlineId, outlines.id))
    .where(and(eq(scenes.id, id), eq(outlines.userId, userId)))
    .limit(1);
  return result[0];
}

export async function deleteSceneForUser(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    const idx = memoryStore.scenes.findIndex(s => s.id === id);
    if (idx !== -1) {
      memoryStore.scenes.splice(idx, 1);
    }
    return [{ affectedRows: 1 }];
  }
  return db.delete(scenes).where(eq(scenes.id, id));
}

// ── Character Queries ──────────────────────────────────────────

export async function getCharactersByOutlineId(outlineId: number) {
  const db = await getDb();
  if (!db) return memoryStore.characters.filter(c => c.outlineId === outlineId);
  return db
    .select()
    .from(characters)
    .where(eq(characters.outlineId, outlineId));
}

export async function getCharactersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return memoryStore.characters.filter(c => c.userId === userId);
  return db.select().from(characters).where(eq(characters.userId, userId));
}

export async function createCharacter(data: InsertCharacter) {
  const db = await getDb();
  if (!db) {
    const newChar = {
      id: nextId++,
      userId: data.userId,
      outlineId: data.outlineId ?? null,
      name: data.name,
      description: data.description ?? null,
      traits: data.traits ?? null,
      role: data.role ?? "supporting",
      craftCollectionItemId: data.craftCollectionItemId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.characters.push(newChar);
    return [{ insertId: newChar.id }];
  }
  return db.insert(characters).values(data);
}

export async function updateCharacter(
  id: number,
  data: Partial<InsertCharacter>
) {
  const db = await getDb();
  if (!db) {
    const item = memoryStore.characters.find(c => c.id === id);
    if (item) {
      Object.assign(item, data, { updatedAt: new Date() });
    }
    return [{ affectedRows: 1 }];
  }
  return db.update(characters).set(data).where(eq(characters.id, id));
}

export async function deleteCharacterForUser(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    const idx = memoryStore.characters.findIndex(
      c => c.id === id && c.userId === userId
    );
    if (idx !== -1) {
      memoryStore.characters.splice(idx, 1);
    }
    return [{ affectedRows: 1 }];
  }
  return db
    .delete(characters)
    .where(and(eq(characters.id, id), eq(characters.userId, userId)));
}

export async function getCharacterByIdForUser(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    const ch = memoryStore.characters.find(
      c => c.id === id && c.userId === userId
    );
    return ch ? { ...ch } : undefined;
  }
  const result = await db
    .select()
    .from(characters)
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))
    .limit(1);
  return result[0];
}

export async function getCharacterRelationships(characterId: number) {
  const db = await getDb();
  if (!db) {
    return memoryStore.characterRelationships.filter(
      r => r.character1Id === characterId || r.character2Id === characterId
    );
  }
  // Bolt ⚡: Avoided dynamic imports for drizzle-orm operators here to prevent performance bottlenecks and module resolution overhead.
  return db
    .select()
    .from(characterRelationships)
    .where(
      or(
        eq(characterRelationships.character1Id, characterId),
        eq(characterRelationships.character2Id, characterId)
      )
    );
}

export async function createCharacterRelationship(
  data: InsertCharacterRelationship
) {
  const db = await getDb();
  if (!db) {
    const newRel = {
      id: nextId++,
      character1Id: data.character1Id,
      character2Id: data.character2Id,
      relationshipType: data.relationshipType,
      description: data.description ?? null,
      createdAt: new Date(),
    };
    memoryStore.characterRelationships.push(newRel);
    return [{ insertId: newRel.id }];
  }
  return db.insert(characterRelationships).values(data);
}

export async function deleteCharacterRelationship(id: number) {
  const db = await getDb();
  if (!db) {
    const idx = memoryStore.characterRelationships.findIndex(r => r.id === id);
    if (idx !== -1) {
      memoryStore.characterRelationships.splice(idx, 1);
    }
    return [{ affectedRows: 1 }];
  }
  return db
    .delete(characterRelationships)
    .where(eq(characterRelationships.id, id));
}

export async function deleteCharacterRelationshipForUser(
  id: number,
  userId: number
) {
  const db = await getDb();
  if (!db) {
    const rel = memoryStore.characterRelationships.find(r => r.id === id);
    if (!rel) return [{ affectedRows: 0 }];
    const char1 = memoryStore.characters.find(
      c => c.id === rel.character1Id && c.userId === userId
    );
    const char2 = memoryStore.characters.find(
      c => c.id === rel.character2Id && c.userId === userId
    );
    if (!char1 && !char2) {
      return [{ affectedRows: 0 }];
    }
    const idx = memoryStore.characterRelationships.findIndex(r => r.id === id);
    if (idx !== -1) {
      memoryStore.characterRelationships.splice(idx, 1);
    }
    return [{ affectedRows: 1 }];
  }
  const char1 = await getCharacterByIdForUser(id, userId);
  return db
    .delete(characterRelationships)
    .where(eq(characterRelationships.id, id));
}

// ── Content Analysis Queries ───────────────────────────────────

export async function getAnalysisForOutline(outlineId: number) {
  const db = await getDb();
  if (!db)
    return memoryStore.contentAnalysis.filter(a => a.outlineId === outlineId);
  return db
    .select()
    .from(contentAnalysis)
    .where(eq(contentAnalysis.outlineId, outlineId));
}

export async function createAnalysis(data: InsertContentAnalysis) {
  const db = await getDb();
  if (!db) {
    const newAnalysis = {
      id: nextId++,
      userId: data.userId,
      outlineId: data.outlineId ?? null,
      chapterId: data.chapterId ?? null,
      sceneId: data.sceneId ?? null,
      analysisType: data.analysisType ?? "summary",
      content: data.content ?? null,
      sentimentScore: data.sentimentScore ?? null,
      keywordDensity: data.keywordDensity ?? null,
      highlights: data.highlights ?? null,
      suggestions: data.suggestions ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.contentAnalysis.push(newAnalysis);
    return [{ insertId: newAnalysis.id }];
  }
  return db.insert(contentAnalysis).values(data);
}

// ── Writing Progress Queries ───────────────────────────────────

export async function getWritingProgressForUser(
  userId: number,
  days: number = 30
) {
  const db = await getDb();
  if (!db) return memoryStore.writingProgress.filter(p => p.userId === userId);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const dateStr = startDate.toISOString().split("T")[0];

  return db
    .select()
    .from(writingProgress)
    .where(
      and(
        eq(writingProgress.userId, userId),
        gte(writingProgress.date, dateStr)
      )
    )
    .orderBy(writingProgress.date);
}

export async function createWritingProgress(data: InsertWritingProgress) {
  const db = await getDb();
  if (!db) {
    const newProg = {
      id: nextId++,
      userId: data.userId,
      outlineId: data.outlineId ?? null,
      date: data.date,
      wordsWritten: data.wordsWritten ?? 0,
      sessionsCompleted: data.sessionsCompleted ?? 0,
      notes: data.notes ?? null,
      createdAt: new Date(),
    };
    memoryStore.writingProgress.push(newProg);
    return [{ insertId: newProg.id }];
  }
  return db.insert(writingProgress).values(data);
}

// ── Craft Credentials Queries ──────────────────────────────────

export async function getCraftCredentials(userId: number) {
  const db = await getDb();
  if (!db) return memoryStore.craftCredentials.find(c => c.userId === userId);
  const result = await db
    .select()
    .from(craftCredentials)
    .where(eq(craftCredentials.userId, userId))
    .limit(1);
  return result[0];
}

export async function saveCraftCredentials(data: InsertCraftCredentials) {
  const db = await getDb();
  if (!db) {
    const existing = memoryStore.craftCredentials.find(
      c => c.userId === data.userId
    );
    if (existing) {
      Object.assign(existing, data, { updatedAt: new Date() });
      return [{ affectedRows: 1 }];
    }
    const newCred = {
      id: nextId++,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.craftCredentials.push(newCred);
    return [{ insertId: newCred.id }];
  }
  const existing = await getCraftCredentials(data.userId);
  if (existing) {
    return db
      .update(craftCredentials)
      .set(data)
      .where(eq(craftCredentials.userId, data.userId));
  }
  return db.insert(craftCredentials).values(data);
}

// ── Obsidian Sync Queries ──────────────────────────────────────

export async function getObsidianSyncStatus(userId: number, filePath: string) {
  const db = await getDb();
  if (!db)
    return memoryStore.obsidianSync.find(
      s => s.userId === userId && s.filePath === filePath
    );
  const result = await db
    .select()
    .from(obsidianSync)
    .where(
      and(eq(obsidianSync.userId, userId), eq(obsidianSync.filePath, filePath))
    )
    .limit(1);
  return result[0];
}

export async function createOrUpdateObsidianSync(data: InsertObsidianSync) {
  const db = await getDb();
  if (!db) {
    const existing = memoryStore.obsidianSync.find(
      s => s.userId === data.userId && s.filePath === data.filePath
    );
    if (existing) {
      Object.assign(existing, data, { updatedAt: new Date() });
      return [{ affectedRows: 1 }];
    }
    const newSync = {
      id: nextId++,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.obsidianSync.push(newSync);
    return [{ insertId: newSync.id }];
  }
  const existing = await getObsidianSyncStatus(data.userId, data.filePath);
  if (existing) {
    return db
      .update(obsidianSync)
      .set(data)
      .where(eq(obsidianSync.id, existing.id));
  }
  return db.insert(obsidianSync).values(data);
}

// ── Slack Integration Queries ──────────────────────────────────

export async function getSlackIntegration(userId: number) {
  const db = await getDb();
  if (!db) return memoryStore.slackIntegration.find(s => s.userId === userId);
  const result = await db
    .select()
    .from(slackIntegration)
    .where(eq(slackIntegration.userId, userId))
    .limit(1);
  return result[0];
}

export async function saveSlackIntegration(data: InsertSlackIntegration) {
  const db = await getDb();
  if (!db) {
    const existing = memoryStore.slackIntegration.find(
      s => s.userId === data.userId
    );
    if (existing) {
      Object.assign(existing, data, { updatedAt: new Date() });
      return [{ affectedRows: 1 }];
    }
    const newSlack = {
      id: nextId++,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.slackIntegration.push(newSlack);
    return [{ insertId: newSlack.id }];
  }
  const existing = await getSlackIntegration(data.userId);
  if (existing) {
    return db
      .update(slackIntegration)
      .set(data)
      .where(eq(slackIntegration.userId, data.userId));
  }
  return db.insert(slackIntegration).values(data);
}
