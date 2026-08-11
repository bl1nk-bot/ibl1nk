import { describe, it, expect } from "vitest";
import { appRouter } from "../routers";

describe("Story Studio Full CRUD & IDOR Protection Suite", () => {
  const user1 = {
    id: 101,
    openId: "user-101",
    name: "Alice",
    role: "user" as const,
  };
  const user2 = {
    id: 102,
    openId: "user-102",
    name: "Bob (Attacker)",
    role: "user" as const,
  };

  const caller1 = appRouter.createCaller({
    user: user1,
    req: {} as any,
    res: { clearCookie: () => {}, cookie: () => {} } as any,
  });

  const caller2 = appRouter.createCaller({
    user: user2,
    req: {} as any,
    res: { clearCookie: () => {}, cookie: () => {} } as any,
  });

  it("should perform full CRUD on outlines, chapters, and scenes for authorized user", async () => {
    // 1. Create Outline
    const outline = await caller1.outlines.create({
      title: "The Quantum Enigma",
      description: "Sci-fi thriller about parallel timelines.",
    });
    expect(outline).toBeDefined();

    const outlines = await caller1.outlines.list();
    const myOutline = outlines.find(o => o.title === "The Quantum Enigma");
    expect(myOutline).toBeDefined();
    const outlineId = myOutline!.id;

    // 2. Create Chapter
    const chapter = await caller1.outlines.createChapter({
      outlineId,
      title: "The Split Reality",
      chapterNumber: 1,
      description: "Discovery of the anomaly.",
    });
    expect(chapter).toBeDefined();

    const chapters = await caller1.outlines.chapters({ outlineId });
    expect(chapters.length).toBeGreaterThan(0);
    const chapterId = chapters[0].id;

    // 3. Create Scene
    const scene = await caller1.outlines.createScene({
      chapterId,
      title: "The Quantum Lab Breach",
      sceneNumber: 1,
      description: "Alarm sounds as experiment breaches containment.",
      wordCount: 1500,
    });
    expect(scene).toBeDefined();

    const scenes = await caller1.outlines.scenes({ chapterId });
    expect(scenes.length).toBeGreaterThan(0);
    const sceneId = scenes[0].id;

    // 4. Update Scene
    const updatedScene = await caller1.outlines.updateScene({
      id: sceneId,
      status: "completed",
      wordCount: 1800,
    });
    expect(updatedScene).toBeDefined();

    // 5. Create Characters and Link Relationship
    const char1 = await caller1.characters.create({
      outlineId,
      name: "Dr. Evelyn Reed",
      role: "Lead Physicist",
    });
    const char2 = await caller1.characters.create({
      outlineId,
      name: "Director Harris",
      role: "Department Chief",
    });

    const userCharacters = await caller1.characters.listByUser();
    const evelyn = userCharacters.find(c => c.name === "Dr. Evelyn Reed");
    const harris = userCharacters.find(c => c.name === "Director Harris");

    if (evelyn && harris) {
      const rel = await caller1.characters.addRelationship({
        character1Id: evelyn.id,
        character2Id: harris.id,
        relationshipType: "rival",
        description: "Clashing over ethics vs project funding.",
      });
      expect(rel).toBeDefined();
    }
  });

  it("should prevent User 2 from accessing or modifying User 1's story assets (IDOR Protection)", async () => {
    // User 1 creates an outline
    await caller1.outlines.create({
      title: "Alice's Secret Manuscript",
      description: "Confidential story.",
    });
    const user1Outlines = await caller1.outlines.list();
    const target = user1Outlines.find(
      o => o.title === "Alice's Secret Manuscript"
    );
    expect(target).toBeDefined();
    const targetId = target!.id;

    // User 2 tries to read User 1's outline -> must throw
    await expect(caller2.outlines.get({ id: targetId })).rejects.toThrow();

    // User 2 tries to delete User 1's outline -> must throw
    await expect(caller2.outlines.delete({ id: targetId })).rejects.toThrow();
  });
});
