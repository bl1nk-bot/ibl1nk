import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getCraftCredentials,
  saveCraftCredentials,
  getSlackIntegration,
  saveSlackIntegration,
  createOrUpdateObsidianSync,
} from "../db";

export const integrationsRouter = router({
  status: protectedProcedure.query(async ({ ctx }) => {
    const [craft, slack] = await Promise.all([
      getCraftCredentials(ctx.user.id),
      getSlackIntegration(ctx.user.id),
    ]);

    return {
      craft: {
        connected: Boolean(craft?.accessToken),
        spaceId: craft?.spaceId || null,
      },
      obsidian: {
        connected: true,
        vaultPath: null,
      },
      slack: {
        connected: Boolean(slack?.accessToken || slack?.slackUserId),
        channel: null,
        notificationsEnabled: slack?.isActive === 1,
      },
    };
  }),

  updateCraft: protectedProcedure
    .input(
      z.object({
        spaceId: z.string().optional(),
        accessToken: z.string().optional().default("craft-default-token"),
        apiKey: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await saveCraftCredentials({
        userId: ctx.user.id,
        spaceId: input.spaceId,
        accessToken: input.accessToken || input.apiKey || "craft-default-token",
      });
      return { success: true };
    }),

  updateObsidian: protectedProcedure
    .input(
      z.object({
        vaultPath: z.string().min(1),
        filePath: z.string().default("vault-root"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await createOrUpdateObsidianSync({
        userId: ctx.user.id,
        vaultPath: input.vaultPath,
        filePath: input.filePath,
        syncStatus: "synced",
      });
      return { success: true };
    }),

  updateSlack: protectedProcedure
    .input(
      z.object({
        channel: z.string().optional(),
        webhookUrl: z.string().optional(),
        accessToken: z.string().optional(),
        slackUserId: z.string().optional().default("local-slack-user"),
        slackTeamId: z.string().optional().default("local-slack-team"),
        isActive: z.boolean().optional(),
        notificationsEnabled: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const activeState =
        input.notificationsEnabled !== undefined
          ? input.notificationsEnabled
          : input.isActive !== undefined
            ? input.isActive
            : true;

      await saveSlackIntegration({
        userId: ctx.user.id,
        slackUserId: input.slackUserId,
        slackTeamId: input.slackTeamId,
        accessToken: input.accessToken || input.webhookUrl || "slack-webhook",
        isActive: activeState ? 1 : 0,
      });
      return { success: true };
    }),
});
