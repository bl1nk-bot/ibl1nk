import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import {
  getTasksByProject,
  getTasksByOutline,
  createTask,
  updateTask,
  deleteTask,
} from '../db';

export const tasksRouter = router({
  listByProject: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      return getTasksByProject(input.projectId);
    }),

  listByOutline: protectedProcedure
    .input(z.object({ outlineId: z.number() }))
    .query(async ({ input }) => {
      return getTasksByOutline(input.outlineId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.number().optional(),
        outlineId: z.number().optional(),
        title: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(['todo', 'in_progress', 'done', 'cancelled']).optional(),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
        dueDate: z.string().optional(), // ISO string
        parentTaskId: z.number().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createTask({
        userId: ctx.user.id,
        projectId: input.projectId,
        outlineId: input.outlineId,
        title: input.title,
        description: input.description,
        status: input.status || 'todo',
        priority: input.priority || 'medium',
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        parentTaskId: input.parentTaskId,
        order: input.order || 0,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(['todo', 'in_progress', 'done', 'cancelled']).optional(),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
        dueDate: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return updateTask(input.id, {
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        order: input.order,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteTask(input.id);
    }),
});
