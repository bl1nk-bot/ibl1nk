import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";

export const aiRouter = router({
  assist: protectedProcedure
    .input(
      z.object({
        provider: z.enum(["openai", "anthropic", "gemini"]).default("openai"),
        apiKey: z.string().optional(),
        task: z.enum([
          "brainstorm_plot",
          "expand_scenes",
          "critique_character",
          "pacing_check",
          "custom",
        ]),
        prompt: z.string().min(1),
        context: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { provider, apiKey, task, prompt, context } = input;

      const systemPrompt = `You are an elite creative writing coach and story architect. 
Your goal is to provide specific, inspiring, actionable suggestions for novels, outlines, characters, and scenes.
Keep answers concise, formatted cleanly in Markdown with bullet points and bold highlights.`;

      const userMessage = `Task: ${task}
Context: ${context || "None provided"}
User Request: ${prompt}`;

      // If user supplied an API key, call the respective provider directly
      if (apiKey && apiKey.trim().length > 5) {
        try {
          if (provider === "openai") {
            const res = await fetch(
              "https://api.openai.com/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey.trim()}`,
                },
                body: JSON.stringify({
                  model: "gpt-4o-mini",
                  messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage },
                  ],
                  temperature: 0.7,
                  max_tokens: 1500,
                }),
              }
            );
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(
                err.error?.message || `OpenAI API returned status ${res.status}`
              );
            }
            const data = await res.json();
            return {
              result:
                data.choices?.[0]?.message?.content || "No response generated.",
              provider: "openai (GPT-4o-mini)",
            };
          }

          if (provider === "anthropic") {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey.trim(),
                "anthropic-version": "2023-06-01",
              },
              body: JSON.stringify({
                model: "claude-3-5-sonnet-20241022",
                system: systemPrompt,
                messages: [{ role: "user", content: userMessage }],
                max_tokens: 1500,
              }),
            });
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(
                err.error?.message ||
                  `Anthropic API returned status ${res.status}`
              );
            }
            const data = await res.json();
            return {
              result: data.content?.[0]?.text || "No response generated.",
              provider: "anthropic (Claude 3.5 Sonnet)",
            };
          }

          if (provider === "gemini") {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`;
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: `${systemPrompt}\n\n${userMessage}` }],
                  },
                ],
              }),
            });
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(
                err.error?.message || `Gemini API returned status ${res.status}`
              );
            }
            const data = await res.json();
            return {
              result:
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "No response generated.",
              provider: "gemini (Gemini 2.5 Flash)",
            };
          }
        } catch (error: any) {
          console.warn(
            `[AI Provider Error] ${error.message}. Falling back to offline assistant.`
          );
          return {
            result: `⚠️ **API Note**: Could not reach ${provider} (${error.message}).\n\n### Offline Writing Suggestions:\n* **Pacing Idea**: Introduce an unexpected obstacle or ticking clock in this sequence.\n* **Emotional Anchor**: Show what the character stands to lose immediately if they fail here.\n* **Sensory Hook**: Add a vivid visual or tactile detail to ground the reader.`,
            provider: "offline-fallback",
          };
        }
      }

      // Smart Local Suggestions when no API key is provided
      return {
        result:
          `### 💡 AI Writing Suggestions for: "${prompt}"\n\n` +
          `1. **Core Conflict Escalation**: Raise the personal stakes by forcing the protagonist to make a trade-off between two equally valuable desires.\n` +
          `2. **Scene Beats Recommendation**:\n` +
          `   - *Opening Hook*: Start in media res right after a critical decision has been made.\n` +
          `   - *Midpoint Turning Point*: Reveal a hidden truth that reframes the previous chapter.\n` +
          `   - *Climax Pressure*: Introduce a time constraint or environmental danger.\n` +
          `3. **Character Dynamic Tip**: Contrast their outward confidence with their internal flaw to make the dialogue more subtext-heavy.`,
        provider: "local-architect",
      };
    }),
});
