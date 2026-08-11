import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getCodexAuthStatus,
  logoutCodex,
  startCodexLogin,
} from "../lib/agent-auth";

export const agentAuthRouter = router({
  codexStatus: protectedProcedure.query(({ ctx }) =>
    getCodexAuthStatus(ctx.user.id)
  ),

  startCodexLogin: protectedProcedure
    .input(z.object({ mode: z.enum(["browser", "device"]).default("device") }))
    .mutation(({ ctx, input }) => startCodexLogin(ctx.user.id, input.mode)),

  logoutCodex: protectedProcedure.mutation(({ ctx }) =>
    logoutCodex(ctx.user.id)
  ),
});
