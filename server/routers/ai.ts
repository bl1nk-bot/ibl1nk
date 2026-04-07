import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { invokeLLM, Message } from '../_core/llm';

export const aiRouter = router({
  chat: protectedProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(['system', 'user', 'assistant']),
            content: z.string(),
          })
        ),
        projectId: z.number().optional(),
        outlineId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // In a real app, we would fetch context from the DB based on projectId/outlineId
      // and inject it into the system message.
      
      const response = await invokeLLM({
        messages: input.messages as Message[],
      });

      const assistantMessage = response.choices[0].message;
      const content = typeof assistantMessage.content === 'string' 
        ? assistantMessage.content 
        : JSON.stringify(assistantMessage.content);

      return {
        role: 'assistant' as const,
        content: content,
      };
    }),
});
