import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import {
  getNotesByProject,
  getNotesByOutline,
  createNote,
  updateNote,
  deleteNote,
} from '../db';

export const notesRouter = router({
  listByProject: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      return getNotesByProject(input.projectId);
    }),

  listByOutline: protectedProcedure
    .input(z.object({ outlineId: z.number() }))
    .query(async ({ input }) => {
      return getNotesByOutline(input.outlineId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.number().optional(),
        outlineId: z.number().optional(),
        title: z.string().min(1),
        content: z.string().optional(),
        tags: z.string().optional(), // JSON string for now
        isPinned: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createNote({
        userId: ctx.user.id,
        projectId: input.projectId,
        outlineId: input.outlineId,
        title: input.title,
        content: input.content,
        tags: input.tags,
        isPinned: input.isPinned ? 1 : 0,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        tags: z.string().optional(),
        isPinned: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return updateNote(input.id, {
        title: input.title,
        content: input.content,
        tags: input.tags,
        isPinned: input.isPinned !== undefined ? (input.isPinned ? 1 : 0) : undefined,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteNote(input.id);
    }),
});
