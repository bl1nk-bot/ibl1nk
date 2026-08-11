import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getWritingProgressForUser,
  createWritingProgress,
  getUserOutlines,
  getCharactersByUserId,
} from "../db";

export const analyticsRouter = router({
  progress: protectedProcedure.query(async ({ ctx }) => {
    return getWritingProgressForUser(ctx.user.id);
  }),

  logProgress: protectedProcedure
    .input(
      z.object({
        outlineId: z.number().optional(),
        wordsWritten: z.number().min(0),
        sessionsCompleted: z.number().default(1),
        notes: z.string().optional(),
        date: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const today = input.date || new Date().toISOString().split("T")[0];
      const res = await createWritingProgress({
        userId: ctx.user.id,
        outlineId: input.outlineId,
        wordsWritten: input.wordsWritten,
        sessionsCompleted: input.sessionsCompleted,
        notes: input.notes,
        date: today,
      });
      return { success: true, insertId: res[0]?.insertId };
    }),

  overview: protectedProcedure.query(async ({ ctx }) => {
    const [outlines, characters, progressList] = await Promise.all([
      getUserOutlines(ctx.user.id),
      getCharactersByUserId(ctx.user.id),
      getWritingProgressForUser(ctx.user.id),
    ]);

    const totalWords = outlines.reduce(
      (sum, item) => sum + (item.wordCount ?? 0),
      0
    );
    const activeStories = outlines.filter(
      o => o.status === "in_progress" || o.status === "draft"
    ).length;

    const weeklyWords = progressList
      .slice(-7)
      .reduce((sum, p) => sum + (p.wordsWritten || 0), 0);

    return {
      totalWords,
      activeStories,
      totalStories: outlines.length,
      totalCharacters: characters.length,
      weeklyWords,
      streakDays: Math.min(progressList.length || 7, 7),
      activeStreak: Math.min(progressList.length || 7, 7),
      progressHistory: progressList,
    };
  }),
});
