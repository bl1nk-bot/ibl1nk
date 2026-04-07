import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import {
  getCharactersByOutlineId,
  getCharactersByUserId,
  createCharacter,
  updateCharacter,
  getCharacterRelationships,
  createCharacterRelationship,
} from '../db';

export const charactersRouter = router({
  // Character Procedures
  listByOutline: protectedProcedure
    .input(z.object({ outlineId: z.number() }))
    .query(async ({ input }) => {
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
    .mutation(async ({ input }) => {
      return updateCharacter(input.id, {
        name: input.name,
        description: input.description,
        traits: input.traits,
        role: input.role,
      });
    }),

  // Character Relationships
  relationships: protectedProcedure
    .input(z.object({ characterId: z.number() }))
    .query(async ({ input }) => {
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
    .mutation(async ({ input }) => {
      return createCharacterRelationship({
        character1Id: input.character1Id,
        character2Id: input.character2Id,
        relationshipType: input.relationshipType,
        description: input.description,
      });
    }),
});
