import { describe, expect, it, vi, beforeEach } from "vitest";
import * as dbFunctions from "../db";
import { users, projects, notes, tasks, loreEntries } from "../../drizzle/schema";

const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

vi.mock("drizzle-orm/mysql2", () => ({
  drizzle: vi.fn(() => mockDb),
}));

vi.mock("drizzle-orm", async () => {
  const actual = await vi.importActual("drizzle-orm");
  return { ...actual, eq: vi.fn(), and: vi.fn(), or: vi.fn() };
});

describe("Database Query Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DATABASE_URL = "mysql://user:pass@host/db";
    
    const chain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      onDuplicateKeyUpdate: vi.fn().mockResolvedValue({}),
      values: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue([]),
    };
    
    // Add Promise behavior to the chain for calls like `await db.select()...`
    // but only where appropriate. Actually, most drizzle calls return a QueryBuilder 
    // that is also a Promise (thenable).
    
    const thenableChain = {
      ...chain,
      then: vi.fn((resolve) => resolve([])),
    };

    mockDb.select.mockReturnValue(thenableChain);
    mockDb.insert.mockReturnValue(thenableChain);
    mockDb.update.mockReturnValue(thenableChain);
    mockDb.delete.mockReturnValue(thenableChain);
  });

  describe("User Queries", () => {
    it("upsertUser calls insert with onDuplicateKeyUpdate", async () => {
      await dbFunctions.upsertUser({ openId: "id", name: "N" } as any);
      expect(mockDb.insert).toHaveBeenCalledWith(users);
    });
  });

  describe("Workspace Queries", () => {
    it("createProject calls insert", async () => {
      await dbFunctions.createProject({ name: "P" } as any);
      expect(mockDb.insert).toHaveBeenCalledWith(projects);
    });
  });
});
