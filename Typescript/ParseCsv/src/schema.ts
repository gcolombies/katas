import { z } from "zod";

/**
 * Dataset: cartes (Riftbound-like).
 * On valide l'objet *typé* (après coercion).
 */
export const CardSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  setCode: z.literal("OGN"),
  type: z.enum(["LEADER", "UNIT", "SPELL", "ITEM"]),
  cost: z.number().int().min(0).max(20),
  unique: z.boolean(),
});

export type Card = z.infer<typeof CardSchema>;

export const CARD_COLUMNS = ["id", "name", "setCode", "type", "cost", "unique"] as const;
export type CardColumn = (typeof CARD_COLUMNS)[number];
