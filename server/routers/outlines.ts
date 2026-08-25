/**
 * ============================================================================
 * Outlines, Chapters & Scenes Router (Human-First Story Studio)
 * ============================================================================
 *
 * 🔄 Data Flow Pathway:
 * 1. UI Request: Outlines.tsx Dual-Pane Scene Manager triggers tRPC query/mutation
 * 2. Auth & Ownership Guard: protectedProcedure verifies ctx.user.id session
 * 3. IDOR Authorization: getOutlineByIdForUser / getChapterByIdForUser validates resource ownership
 * 4. Storage Engine: Writes to MySQL/TiDB (or MemoryStore fallback) via server/db.ts
 * 5. State Synchronization: Returns verified result to React Query cache & UI
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getUserOutlines,
  getOutlineById,
  getOutlineByIdForUser,
  createOutline,
  updateOutline,
  updateOutlineForUser,
  deleteOutlineForUser,
  getChaptersByOutlineId,
  createChapter,
  updateChapter,
  deleteChapterForUser,
  getChapterByIdForUser,
  getScenesByChapterId,
  createScene,
  updateScene,
  deleteSceneForUser,
  getSceneByIdForUser,
  getCharactersByOutlineId,
  getCharacterRelationships,
} from "../db";

export const outlinesRouter = router({
  // Outline Procedures
  list: protectedProcedure.query(async ({ ctx }) => {
    return getUserOutlines(ctx.user.id);
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const outline = await getOutlineByIdForUser(input.id, ctx.user.id);
      if (!outline) throw new Error("Outline not found");
      return outline;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        craftDocumentId: z.string().optional(),
        craftCollectionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createOutline({
        userId: ctx.user.id,
        title: input.title,
        description: input.description,
        craftDocumentId: input.craftDocumentId,
        craftCollectionId: input.craftCollectionId,
        status: "draft",
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z
          .enum(["draft", "in_progress", "completed", "archived"])
          .optional(),
        wordCount: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const outline = await getOutlineByIdForUser(input.id, ctx.user.id);
      if (!outline) throw new Error("Outline not found");
      return updateOutlineForUser(input.id, ctx.user.id, {
        title: input.title,
        description: input.description,
        status: input.status,
        wordCount: input.wordCount,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const outline = await getOutlineByIdForUser(input.id, ctx.user.id);
      if (!outline) throw new Error("Outline not found");
      return deleteOutlineForUser(input.id, ctx.user.id);
    }),

  // Chapter Procedures
  chapters: protectedProcedure
    .input(z.object({ outlineId: z.number() }))
    .query(async ({ ctx, input }) => {
      const outline = await getOutlineByIdForUser(input.outlineId, ctx.user.id);
      if (!outline) throw new Error("Outline not found");
      return getChaptersByOutlineId(input.outlineId);
    }),

  deleteChapter: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const chapter = await getChapterByIdForUser(input.id, ctx.user.id);
      if (!chapter) throw new Error("Chapter not found");
      return deleteChapterForUser(input.id, ctx.user.id);
    }),

  createChapter: protectedProcedure
    .input(
      z.object({
        outlineId: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
        chapterNumber: z.number().optional(),
        status: z
          .enum(["planning", "writing", "reviewing", "completed"])
          .optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const outline = await getOutlineByIdForUser(input.outlineId, ctx.user.id);
      if (!outline) throw new Error("Outline not found");
      return createChapter({
        outlineId: input.outlineId,
        title: input.title,
        description: input.description,
        chapterNumber: input.chapterNumber,
        status: (input.status as any) || "planning",
        order: input.order || 0,
      });
    }),

  updateChapter: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z
          .enum(["planning", "writing", "reviewing", "completed"])
          .optional(),
        wordCount: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const chapter = await getChapterByIdForUser(input.id, ctx.user.id);
      if (!chapter) throw new Error("Chapter not found");
      return updateChapter(input.id, {
        title: input.title,
        description: input.description,
        status: input.status,
        wordCount: input.wordCount,
      });
    }),

  // Scene Procedures
  scenes: protectedProcedure
    .input(z.object({ chapterId: z.number() }))
    .query(async ({ ctx, input }) => {
      const chapter = await getChapterByIdForUser(input.chapterId, ctx.user.id);
      if (!chapter) throw new Error("Chapter not found");
      return getScenesByChapterId(input.chapterId);
    }),

  createScene: protectedProcedure
    .input(
      z.object({
        chapterId: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
        sceneNumber: z.number().optional(),
        status: z
          .enum(["planning", "writing", "reviewing", "completed"])
          .optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const chapter = await getChapterByIdForUser(input.chapterId, ctx.user.id);
      if (!chapter) throw new Error("Chapter not found");
      return createScene({
        chapterId: input.chapterId,
        title: input.title,
        description: input.description,
        sceneNumber: input.sceneNumber,
        status: (input.status as any) || "planning",
        order: input.order || 0,
      });
    }),

  updateScene: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z
          .enum(["planning", "writing", "reviewing", "completed"])
          .optional(),
        wordCount: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const scene = await getSceneByIdForUser(input.id, ctx.user.id);
      if (!scene) throw new Error("Scene not found");
      return updateScene(input.id, {
        title: input.title,
        description: input.description,
        status: input.status,
        wordCount: input.wordCount,
      });
    }),

  deleteScene: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const scene = await getSceneByIdForUser(input.id, ctx.user.id);
      if (!scene) throw new Error("Scene not found");
      return deleteSceneForUser(input.id, ctx.user.id);
    }),

  // Story Overview
  storyOverview: protectedProcedure
    .input(z.object({ outlineId: z.number() }))
    .query(async ({ ctx, input }) => {
      const outline = await getOutlineByIdForUser(input.outlineId, ctx.user.id);
      if (!outline) throw new Error("Outline not found");

      // ⚡ Bolt: Parallelize independent DB queries to reduce request latency
      const [chapters, characters] = await Promise.all([
        getChaptersByOutlineId(input.outlineId),
        getCharactersByOutlineId(input.outlineId),
      ]);

      return {
        outline,
        chapters,
        characters,
        stats: {
          totalChapters: chapters.length,
          totalCharacters: characters.length,
          totalWordCount: chapters.reduce(
            (sum, ch) => sum + (ch.wordCount || 0),
            0
          ),
        },
      };
    }),
});
