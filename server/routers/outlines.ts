import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getUserOutlines,
  getOutlineById,
  createOutline,
  updateOutline,
  getChaptersByOutlineId,
  createChapter,
  updateChapter,
  getScenesByChapterId,
  createScene,
  updateScene,
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
    .query(async ({ input }) => {
      const outline = await getOutlineById(input.id);
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
    .mutation(async ({ input }) => {
      return updateOutline(input.id, {
        title: input.title,
        description: input.description,
        status: input.status,
        wordCount: input.wordCount,
      });
    }),

  // Chapter Procedures
  chapters: protectedProcedure
    .input(z.object({ outlineId: z.number() }))
    .query(async ({ input }) => {
      return getChaptersByOutlineId(input.outlineId);
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
    .mutation(async ({ input }) => {
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
    .mutation(async ({ input }) => {
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
    .query(async ({ input }) => {
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
    .mutation(async ({ input }) => {
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
    .mutation(async ({ input }) => {
      return updateScene(input.id, {
        title: input.title,
        description: input.description,
        status: input.status,
        wordCount: input.wordCount,
      });
    }),

  // Story Overview
  storyOverview: protectedProcedure
    .input(z.object({ outlineId: z.number() }))
    .query(async ({ input }) => {
      // ⚡ Bolt: Fetch outline, chapters, and characters concurrently using Promise.all
      // Impact: Reduces overall response latency from (outline time + chapters time + characters time) to max(outline time, chapters time, characters time).
      const [outline, chapters, characters] = await Promise.all([
        getOutlineById(input.outlineId),
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
