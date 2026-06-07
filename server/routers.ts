import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { outlinesRouter } from "./routers/outlines";
import { charactersRouter } from "./routers/characters";
import { projectsRouter } from "./routers/projects";
import { notesRouter } from "./routers/notes";
import { tasksRouter } from "./routers/tasks";
import { loreRouter } from "./routers/lore";
import { aiRouter } from "./routers/ai";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  outlines: outlinesRouter,
  characters: charactersRouter,
  projects: projectsRouter,
  notes: notesRouter,
  tasks: tasksRouter,
  lore: loreRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
