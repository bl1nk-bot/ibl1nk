/**
 * @module v1/projects
 * @description REST API endpoints for Project (Workspace) management.
 * @done 2026-04-10 — Initial CRUD implementation with User-level isolation.
 * @tested @todo tests/v1/projects.test.ts
 * @status partial
 */

import { Router, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../v1_router";
import { 
  getUserProjects, 
  getProjectById, 
  createProject, 
  updateProject 
} from "../db";

const projectsRouter = Router();

// ── Validation Schemas ────────────────────────────────────────

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
});

const updateProjectSchema = createProjectSchema.partial();

// ── Endpoints ────────────────────────────────────────────────

/**
 * List all projects for the authenticated user.
 * @param {AuthenticatedRequest} req - Authenticated request.
 * @param {Response} res - List of projects.
 * @returns {Promise<Response>}
 */
projectsRouter.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const projects = await getUserProjects(userId);
    return res.json({ data: projects });
  } catch (error) {
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch projects" } });
  }
});

/**
 * Get a specific project by ID with ownership check.
 * @param {AuthenticatedRequest} req - Authenticated request.
 * @param {Response} res - Project details.
 * @returns {Promise<Response>}
 */
projectsRouter.get("/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const projectId = parseInt(req.params.id, 10);
    
    if (isNaN(projectId)) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "Invalid project ID" } });
    }

    const project = await getProjectById(projectId, userId);
    if (!project) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Project not found or access denied" } });
    }

    return res.json({ data: project });
  } catch (error) {
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch project" } });
  }
});

/**
 * Create a new project.
 * @param {AuthenticatedRequest} req - Request with name and description.
 * @param {Response} res - Created project.
 * @returns {Promise<Response>}
 */
projectsRouter.post("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = createProjectSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(422).json({ error: { code: "VALIDATION_ERROR", details: result.error.format() } });
    }

    const project = await createProject({
      userId,
      name: result.data.name,
      description: result.data.description,
      status: result.data.status || 'active',
    });

    return res.status(201).json({ data: project });
  } catch (error) {
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to create project" } });
  }
});

/**
 * Update a project with ownership check.
 * @param {AuthenticatedRequest} req - Partial project data.
 * @param {Response} res - Updated project.
 * @returns {Promise<Response>}
 */
projectsRouter.patch("/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const projectId = parseInt(req.params.id, 10);
    
    if (isNaN(projectId)) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "Invalid project ID" } });
    }

    const result = updateProjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({ error: { code: "VALIDATION_ERROR", details: result.error.format() } });
    }

    // Verify ownership before update
    const existing = await getProjectById(projectId, userId);
    if (!existing) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Project not found or access denied" } });
    }

    const updated = await updateProject(projectId, userId, result.data);
    return res.json({ data: updated });
  } catch (error) {
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to update project" } });
  }
});

export default projectsRouter;
