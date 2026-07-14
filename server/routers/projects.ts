import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { protectedProcedure, router } from '../_core/trpc';
import {
  getUserProjects,
  getProjectById,
  createProject,
  updateProject,
} from '../db';

export const projectsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return getUserProjects(ctx.user.id);
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const project = await getProjectById(input.id, ctx.user.id);
      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'ไม่พบโปรเจกต์นี้ (30001)',
        });
      }
      return project;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(['active', 'completed', 'archived']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createProject({
        userId: ctx.user.id,
        name: input.name,
        description: input.description,
        status: input.status || 'active',
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(['active', 'completed', 'archived']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return updateProject(input.id, ctx.user.id, {
        name: input.name,
        description: input.description,
        status: input.status,
      });
    }),
});
