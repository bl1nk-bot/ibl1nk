import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import {
  getLoreByProject,
  createLoreEntry,
  updateLoreEntry,
  deleteLoreEntry,
} from '../db';

export const loreRouter = router({
  listByProject: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      return getLoreByProject(input.projectId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.number().optional(),
        title: z.string().min(1),
        content: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(), // JSON string
        relatedLoreIds: z.string().optional(), // JSON string
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createLoreEntry({
        userId: ctx.user.id,
        projectId: input.projectId,
        title: input.title,
        content: input.content,
        category: input.category,
        tags: input.tags,
        relatedLoreIds: input.relatedLoreIds,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        relatedLoreIds: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return updateLoreEntry(input.id, {
        title: input.title,
        content: input.content,
        category: input.category,
        tags: input.tags,
        relatedLoreIds: input.relatedLoreIds,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteLoreEntry(input.id);
    }),
});
