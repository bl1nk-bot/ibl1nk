/**
 * ============================================================================
 * Characters & Relational Dynamics Router
 * ============================================================================
 *
 * 🔄 Data Flow Pathway:
 * 1. UI Request: CharactersWithViews.tsx triggers character/relationship queries/mutations
 * 2. Auth Guard: protectedProcedure verifies active user session (ctx.user.id)
 * 3. Validation: Zod schema enforces clean roles, traits, and relationship types
 * 4. DB Layer: Queries/Mutates characters and character_relationships in server/db.ts
 * 5. Isolation: All character deletions and relationship removals strictly scoped to ctx.user.id
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getCharactersByOutlineId,
  getCharactersByUserId,
  createCharacter,
  updateCharacter,
  deleteCharacterForUser,
  getCharacterByIdForUser,
  getOutlineByIdForUser,
  getCharacterRelationships,
  createCharacterRelationship,
  deleteCharacterRelationshipForUser,
} from "../db";

export const charactersRouter = router({
  // Character Procedures
  listByOutline: protectedProcedure
    .input(z.object({ outlineId: z.number() }))
    .query(async ({ ctx, input }) => {
      const outline = await getOutlineByIdForUser(input.outlineId, ctx.user.id);
      if (!outline) throw new Error("Outline not found");
      return getCharactersByOutlineId(input.outlineId);
    }),

  listByUser: protectedProcedure.query(async ({ ctx }) => {
    return getCharactersByUserId(ctx.user.id);
  }),

  create: protectedProcedure
    .input(
      z.object({
        outlineId: z.number().optional(),
        name: z.string().min(1),
        description: z.string().optional(),
        traits: z.string().optional(),
        role: z.string().optional(),
        craftCollectionItemId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.outlineId !== undefined) {
        const outline = await getOutlineByIdForUser(
          input.outlineId,
          ctx.user.id
        );
        if (!outline) throw new Error("Outline not found");
      }
      return createCharacter({
        userId: ctx.user.id,
        outlineId: input.outlineId,
        name: input.name,
        description: input.description,
        traits: input.traits,
        role: input.role,
        craftCollectionItemId: input.craftCollectionItemId,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        traits: z.string().optional(),
        role: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const character = await getCharacterByIdForUser(input.id, ctx.user.id);
      if (!character) throw new Error("Character not found");
      return updateCharacter(input.id, {
        name: input.name,
        description: input.description,
        traits: input.traits,
        role: input.role,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const character = await getCharacterByIdForUser(input.id, ctx.user.id);
      if (!character) throw new Error("Character not found");
      return deleteCharacterForUser(input.id, ctx.user.id);
    }),

  // Character Relationships
  relationships: protectedProcedure
    .input(z.object({ characterId: z.number() }))
    .query(async ({ ctx, input }) => {
      const character = await getCharacterByIdForUser(
        input.characterId,
        ctx.user.id
      );
      if (!character) throw new Error("Character not found");
      return getCharacterRelationships(input.characterId);
    }),

  addRelationship: protectedProcedure
    .input(
      z.object({
        character1Id: z.number(),
        character2Id: z.number(),
        relationshipType: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [character1, character2] = await Promise.all([
        getCharacterByIdForUser(input.character1Id, ctx.user.id),
        getCharacterByIdForUser(input.character2Id, ctx.user.id),
      ]);
      if (!character1 || !character2) {
        throw new Error("Character not found");
      }
      return createCharacterRelationship({
        character1Id: input.character1Id,
        character2Id: input.character2Id,
        relationshipType: input.relationshipType,
        description: input.description,
      });
    }),

  deleteRelationship: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return deleteCharacterRelationshipForUser(input.id, ctx.user.id);
    }),
});
