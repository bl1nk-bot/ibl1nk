import { describe, expect, it, vi, beforeEach } from "vitest";
import { projectsRouter } from "../routers/projects";
import * as dbFunctions from "../db";
import { TRPCError } from "@trpc/server";

// Mock db functions
vi.mock("../db", () => ({
  getUserProjects: vi.fn(),
  getProjectById: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
}));

const mockUser = { id: 1, openId: "test-user" };
const mockCtx = { user: mockUser } as any;

describe("Projects Router Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("returns projects for authenticated user", async () => {
      const mockProjects = [{ id: 1, name: "Project 1", userId: 1 }];
      (dbFunctions.getUserProjects as any).mockResolvedValue(mockProjects);

      const caller = projectsRouter.createCaller(mockCtx);
      const result = await caller.list();

      expect(result).toEqual(mockProjects);
      expect(dbFunctions.getUserProjects).toHaveBeenCalledWith(1);
    });
  });

  describe("get", () => {
    it("returns project if found and owned by user", async () => {
      const mockProject = { id: 1, name: "Project 1", userId: 1 };
      (dbFunctions.getProjectById as any).mockResolvedValue(mockProject);

      const caller = projectsRouter.createCaller(mockCtx);
      const result = await caller.get({ id: 1 });

      expect(result).toEqual(mockProject);
      expect(dbFunctions.getProjectById).toHaveBeenCalledWith(1, 1);
    });

    it("throws NOT_FOUND if project doesn't exist or not owned", async () => {
      (dbFunctions.getProjectById as any).mockResolvedValue(undefined);

      const caller = projectsRouter.createCaller(mockCtx);
      
      await expect(caller.get({ id: 999 })).rejects.toThrow(TRPCError);
    });
  });

  describe("create", () => {
    it("creates a new project for the user", async () => {
      (dbFunctions.createProject as any).mockResolvedValue({ id: 2 });

      const caller = projectsRouter.createCaller(mockCtx);
      await caller.create({ name: "New Project", description: "Desc" });

      expect(dbFunctions.createProject).toHaveBeenCalledWith({
        userId: 1,
        name: "New Project",
        description: "Desc",
        status: "active",
      });
    });
  });

  describe("update", () => {
    it("updates an existing project", async () => {
      (dbFunctions.updateProject as any).mockResolvedValue({ id: 1 });

      const caller = projectsRouter.createCaller(mockCtx);
      await caller.update({ id: 1, name: "Updated Name" });

      expect(dbFunctions.updateProject).toHaveBeenCalledWith(1, 1, {
        name: "Updated Name",
        description: undefined,
        status: undefined,
      });
    });
  });
});
