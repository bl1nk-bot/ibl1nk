import { describe, it, expect } from "vitest";
import { appRouter } from "../routers";

describe("Analytics & Integrations Router Test Suite", () => {
  const mockUser = {
    id: 1,
    openId: "test-user-1",
    name: "Test Writer",
    email: "writer@ibl1nk.dev",
    role: "user" as const,
  };

  const caller = appRouter.createCaller({
    user: mockUser,
    req: {} as any,
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as any,
  });

  it("should retrieve writer analytics overview", async () => {
    const overview = await caller.analytics.overview();
    expect(overview).toBeDefined();
    expect(overview.totalWords).toBeGreaterThanOrEqual(0);
    expect(overview.totalStories).toBeGreaterThanOrEqual(0);
    expect(overview.totalCharacters).toBeGreaterThanOrEqual(0);
    expect(overview.activeStreak).toBeGreaterThanOrEqual(0);
  });

  it("should log daily writing progress with Zod validation and query progress stats", async () => {
    const logRes = await caller.analytics.logProgress({
      wordsWritten: 500,
      notes: "Drafted exciting fight scene in Chapter 2",
    });
    expect(logRes.success).toBe(true);

    const progress = await caller.analytics.progress();
    expect(Array.isArray(progress)).toBe(true);
  });

  it("should retrieve integrations status and update configurations", async () => {
    const status = await caller.integrations.status();
    expect(status).toBeDefined();
    expect(status.craft).toBeDefined();
    expect(status.obsidian).toBeDefined();
    expect(status.slack).toBeDefined();

    const craftUpdate = await caller.integrations.updateCraft({
      apiKey: "craft-test-key-12345",
      spaceId: "space-abc",
    });
    expect(craftUpdate.success).toBe(true);

    const obsidianUpdate = await caller.integrations.updateObsidian({
      vaultPath: "/Users/writer/Documents/MyNovelVault",
    });
    expect(obsidianUpdate.success).toBe(true);

    const slackUpdate = await caller.integrations.updateSlack({
      webhookUrl: "https://hooks.slack.com/services/T00/B00/XXXX",
      channel: "#writing-sprint",
    });
    expect(slackUpdate.success).toBe(true);
  });
});
