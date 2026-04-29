/**
 * @module v1/router
 * @description Entry point for ibl1nk RESTful API v1.
 * @done 2026-04-10 — Integrated projectsRouter for workspace management.
 * @tested @todo tests/v1/router.test.ts
 * @status partial
 */

import { Router, Request, Response, NextFunction } from "express";
import { ENV } from "./_core/env";
import { sdk } from "./_core/sdk";
import { User } from "../drizzle/schema";
import projectsRouter from "./v1/projects";

// Extend Express Request to include authenticated user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

const v1Router = Router();

// ── Auth Middleware ───────────────────────────────────────────

/**
 * Middleware to authenticate requests via Session (Cookie) or X-API-Key.
 * @param {AuthenticatedRequest} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void | Response>} - Proceeds to next or returns 401.
 */
export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];

  // 1. Check for API Key (Tools/Plugins Priority)
  if (apiKey === ENV.apiAuthSecret) {
    // For now, API Key bypasses session and acts as owner
    // TODO: Link API Key to specific User in Phase 1.3
    return next();
  }

  // 2. Check for Session via SDK (User identity from Cookie)
  try {
    const user = await sdk.authenticateRequest(req);
    if (user) {
      req.user = user;
      return next();
    }
  } catch (error) {
    // Auth failed
  }

  // 3. Unauthorized
  return res.status(401).json({
    error: {
      code: "UNAUTHORIZED",
      message: "Missing or invalid authentication credentials",
      request_id: "v1-" + Date.now()
    }
  });
};

// ── Root Endpoints ────────────────────────────────────────────

v1Router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Protect all other routes
v1Router.use(authMiddleware);

v1Router.get("/auth/check", (req, res) => {
  res.json({
    authenticated: true,
    message: "Auth successful"
  });
});

// ── Resource Routes ───────────────────────────────────────────

v1Router.use("/projects", projectsRouter);

export default v1Router;
