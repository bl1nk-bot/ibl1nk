import { describe, expect, it, vi } from "vitest";

// Mocking drizzle-orm/mysql2
vi.mock("drizzle-orm/mysql2", () => ({
  drizzle: vi.fn(() => ({
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([])),
        })),
      })),
    })),
  })),
}));

describe("Mocking Infrastructure", () => {
  it("can mock drizzle-orm/mysql2", async () => {
    const { drizzle } = await import("drizzle-orm/mysql2");
    const db = drizzle("dummy-url");
    const result = await db.select().from({} as any).where({} as any).limit(1);
    expect(result).toEqual([]);
    expect(drizzle).toHaveBeenCalledWith("dummy-url");
  });
});
