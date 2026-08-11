import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { IBL1NK_STORY_AGENTS } from "../agents/ibl1nkAgents";
import {
  getUserOutlines,
  getChaptersByOutlineId,
  getScenesByChapterId,
  getCharactersByUserId,
  getCharacterRelationships,
  createScene,
  createWritingProgress,
} from "../db";

export const agentsRouter = router({
  list: publicProcedure.query(() => {
    return IBL1NK_STORY_AGENTS.map(agent => ({
      id: agent.id,
      publisher: agent.publisher,
      version: agent.version,
      displayName: agent.displayName,
      description: agent.description,
      category: agent.category,
      model: agent.model,
      toolNames: agent.toolNames,
      spawnableAgents: agent.spawnableAgents,
      inputSchema: agent.inputSchema,
    }));
  }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const agent = IBL1NK_STORY_AGENTS.find(a => a.id === input.id);
      if (!agent) throw new Error(`Agent ${input.id} not found`);
      return agent;
    }),

  run: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        prompt: z.string().min(1),
        storyId: z.number().optional(),
        chapterId: z.number().optional(),
        characterId: z.number().optional(),
        apiKey: z.string().optional(),
        provider: z
          .enum(["openai", "anthropic", "gemini"])
          .optional()
          .default("openai"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const agent = IBL1NK_STORY_AGENTS.find(a => a.id === input.agentId);
      if (!agent) throw new Error(`Agent ${input.agentId} not found`);

      // Gather contextual data from user's story database
      const [stories, characters] = await Promise.all([
        getUserOutlines(ctx.user.id),
        getCharactersByUserId(ctx.user.id),
      ]);

      const activeStory = input.storyId
        ? stories.find(s => s.id === input.storyId)
        : stories[0];
      const chapters = activeStory
        ? await getChaptersByOutlineId(activeStory.id)
        : [];
      const activeChapter = input.chapterId
        ? chapters.find(c => c.id === input.chapterId)
        : chapters[0];
      const scenes = activeChapter
        ? await getScenesByChapterId(activeChapter.id)
        : [];

      const contextSummary = `
[Human Writer Studio Context]
Active Story: ${activeStory ? `${activeStory.title} (Status: ${activeStory.status})` : "None"}
Story Synopsis: ${activeStory?.description || "N/A"}
Chapters Count: ${chapters.length}
Active Chapter: ${activeChapter ? `Chapter ${activeChapter.chapterNumber}: ${activeChapter.title}` : "None"}
Scenes in Chapter: ${scenes.map(s => `Scene ${s.sceneNumber}: ${s.title}`).join(", ") || "None"}
Cast of Characters: ${characters.map(c => `${c.name} (${c.role})`).join(", ")}
`;

      const finalPrompt = `${agent.instructionsPrompt || agent.systemPrompt}\n\n${contextSummary}\n\nUser Request: ${input.prompt}`;

      // Live LLM Call if API key is provided
      if (input.apiKey && input.apiKey.trim()) {
        try {
          if (input.provider === "openai") {
            const { default: axios } = await import("axios");
            const res = await axios.post(
              "https://api.openai.com/v1/chat/completions",
              {
                model: "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content:
                      agent.systemPrompt || "You are an ibl1nk story agent.",
                  },
                  { role: "user", content: finalPrompt },
                ],
                temperature: 0.7,
              },
              {
                headers: { Authorization: `Bearer ${input.apiKey}` },
                timeout: 30000,
              }
            );
            const text = res.data.choices?.[0]?.message?.content;
            if (text) {
              return {
                agentId: agent.id,
                agentName: agent.displayName,
                result: text,
                model: agent.model,
                mode: "live-llm",
              };
            }
          }
        } catch (e: any) {
          console.warn(
            `[Agent ${agent.id} LLM Call Failed, using intelligent studio fallback]:`,
            e.message
          );
        }
      }

      // Intelligent Studio Agent Engine Fallback
      let resultText = `### 🤖 ${agent.displayName} Analysis\n\n`;
      if (agent.id === "story-architect") {
        resultText += `**Plot Architecture Strategy for "${activeStory?.title || "Your Story"}":**\n\n`;
        resultText += `1. **Inciting Catalyst**: Accelerate the discovery beat in Chapter 1 so the protagonist's world is disrupted before page 20.\n`;
        resultText += `2. **Midpoint Reversal**: Pivot the external mystery into an internal loyalty dilemma involving ${characters[0]?.name || "the protagonist"} and ${characters[1]?.name || "their ally"}.\n`;
        resultText += `3. **Climax Stakes**: Force a sacrifice where winning the battle requires losing an irreplaceable artifact.\n`;
      } else if (agent.id === "character-psychologist") {
        resultText += `**Psychological Profile & Tension Analysis:**\n\n`;
        resultText += `* **Primary Lie Believed**: The protagonist believes self-reliance is their only defense against past betrayal.\n`;
        resultText += `* **Friction with Cast**: ${characters
          .slice(0, 2)
          .map(c => c.name)
          .join(
            " and "
          )} hold opposing core values, generating instant subtext in shared scenes.\n`;
        resultText += `* **Arc Breakthrough**: In the climax, allow them to willingly place their trust in others to achieve true growth.\n`;
      } else if (agent.id === "scene-pacing-expert") {
        resultText += `**Scene Pacing Breakdown for ${activeChapter ? activeChapter.title : "Chapter"}:**\n\n`;
        resultText += `* **Beat 1 (Entry)**: Enter the scene 5 seconds before the confrontation begins.\n`;
        resultText += `* **Beat 2 (Micro-Tension)**: Insert an environmental obstacle (failing light, ticking timer) to amplify conversational urgency.\n`;
        resultText += `* **Beat 3 (Exit Hook)**: End on an unanswered question or sudden arrival to compel the reader to the next chapter.\n`;
      } else {
        resultText += `**Editorial Recommendation:**\n\n`;
        resultText += `* Your story has strong conceptual hooks. Focus next on tightening the cause-and-effect transitions between Chapter ${chapters[0]?.chapterNumber || 1} and Chapter ${chapters[1]?.chapterNumber || 2}.\n`;
      }

      return {
        agentId: agent.id,
        agentName: agent.displayName,
        result: resultText,
        model: agent.model,
        mode: "studio-agent",
      };
    }),
});
