import { describe, it, expect } from "vitest";
import { appRouter } from "../routers";

describe("ibl1nk Agents Router & Zod Validation Suite", () => {
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

  it("should list all available ibl1nk agents including base-deep orchestrator", async () => {
    const agents = await caller.agents.list();
    expect(Array.isArray(agents)).toBe(true);
    expect(agents.length).toBeGreaterThanOrEqual(6);

    const baseDeep = agents.find(a => a.id === "base-deep");
    expect(baseDeep).toBeDefined();
    expect(baseDeep?.displayName).toBe("ibl1nk Deep Orchestrator");
    expect(baseDeep?.publisher).toBe("ibl1nk");

    const storyArchitect = agents.find(a => a.id === "story-architect");
    expect(storyArchitect).toBeDefined();
    expect(storyArchitect?.publisher).toBe("ibl1nk");
  });

  it("should get specific agent details by valid ID", async () => {
    const agent = await caller.agents.get({ id: "story-architect" });
    expect(agent.id).toBe("story-architect");
    expect(agent.displayName).toContain("Story Architect");
    expect(agent.toolNames).toBeDefined();
  });

  it("should throw error for non-existent agent ID", async () => {
    await expect(
      caller.agents.get({ id: "non-existent-agent-xyz" })
    ).rejects.toThrow();
  });

  it("should execute agent run with valid Zod input schema", async () => {
    const result = await caller.agents.run({
      agentId: "story-architect",
      prompt: "Help me brainstorm the midpoint twist for a mystery novel",
      provider: "openai",
    });

    expect(result.agentId).toBe("story-architect");
    expect(result.result).toBeDefined();
    expect(result.result.length).toBeGreaterThan(20);
  });

  it("should reject invalid agent run requests missing required prompt", async () => {
    // @ts-expect-error Testing invalid empty prompt
    await expect(
      caller.agents.run({ agentId: "story-architect", prompt: "" })
    ).rejects.toThrow();
  });
});
