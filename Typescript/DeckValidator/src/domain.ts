/**
 * Types du domaine (à adapter si tu veux).
 * L'objectif : modéliser clairement les invariants et rendre le validateur testable.
 */

export type SetCode = "OGN";

export type CardType = "LEADER" | "UNIT" | "SPELL" | "ITEM";

export interface Card {
  id: string;
  name: string;
  setCode: SetCode | string; // autorise d'autres sets dans le catalogue, mais pas forcément en format OGN-only
  type: CardType | string;
  unique?: boolean;
  // tu peux enrichir (faction, rarity, cost, etc.)
}

export interface DeckEntry {
  cardId: string;
  qty: number;
}

export interface Deck {
  entries: DeckEntry[];
}

export type ValidationErrorCode =
  | "DECK_SIZE"
  | "MAX_COPIES"
  | "UNKNOWN_CARD"
  | "SET_FORBIDDEN"
  | "LEADER_COUNT"
  | "UNIQUE_VIOLATION"
  | "INVALID_QTY"
  | "DUPLICATE_ENTRY";

export interface ValidationError {
  code: ValidationErrorCode;
  message: string;
  meta?: Record<string, unknown>;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationError[];
}
