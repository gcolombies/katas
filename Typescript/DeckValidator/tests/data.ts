import type { Card, Deck } from "../src/domain.js";

export function makeCatalog(cards: Card[]): ReadonlyMap<string, Card> {
  return new Map(cards.map((c) => [c.id, c]));
}

/**
 * Catalogue minimal mais suffisant pour tous les scénarios du kata:
 * - 1 leader OGN
 * - 13 cartes OGN non-uniques (pour construire un deck 40 exact avec des x3)
 * - 1 carte unique OGN
 * - 1 carte hors set (pour SET_FORBIDDEN)
 */
export const CATALOG_CARDS: Card[] = [
  // Leader (OGN)
  { id: "L-001", name: "Alpha Leader", setCode: "OGN", type: "LEADER" },

  // 13 cartes OGN non-uniques (UNIT/SPELL/ITEM) => parfait pour 13 * 3 + 1 = 40
  { id: "U-001", name: "Piltovan Scout", setCode: "OGN", type: "UNIT" },
  { id: "U-002", name: "Zaunite Brawler", setCode: "OGN", type: "UNIT" },
  { id: "U-003", name: "Hextech Adept", setCode: "OGN", type: "UNIT" },
  { id: "U-004", name: "Arena Challenger", setCode: "OGN", type: "UNIT" },
  { id: "U-005", name: "Street Fighter", setCode: "OGN", type: "UNIT" },
  { id: "S-001", name: "Quick Spell", setCode: "OGN", type: "SPELL" },
  { id: "S-002", name: "Tactical Swap", setCode: "OGN", type: "SPELL" },
  { id: "S-003", name: "Overcharge", setCode: "OGN", type: "SPELL" },
  { id: "S-004", name: "Disrupt", setCode: "OGN", type: "SPELL" },
  { id: "I-001", name: "Training Gear", setCode: "OGN", type: "ITEM" },
  { id: "I-002", name: "Hex Crystal", setCode: "OGN", type: "ITEM" },
  { id: "I-003", name: "Smoke Bomb", setCode: "OGN", type: "ITEM" },
  { id: "I-004", name: "Arena Ticket", setCode: "OGN", type: "ITEM" },

  // Unique OGN (pour UNIQUE_VIOLATION)
  { id: "UQ-001", name: "The One-of Relic", setCode: "OGN", type: "ITEM", unique: true },

  // Hors set (pour SET_FORBIDDEN)
  { id: "X-001", name: "Forbidden Import", setCode: "XYZ", type: "UNIT" },
];

export const CATALOG = makeCatalog(CATALOG_CARDS);

/**
 * Deck VALIDE: 40 cartes exact
 * 1 leader + 13 cartes à 3 copies = 1 + 39 = 40
 */
export const VALID_DECK: Deck = {
  entries: [
    { cardId: "L-001", qty: 1 },
    { cardId: "U-001", qty: 3 },
    { cardId: "U-002", qty: 3 },
    { cardId: "U-003", qty: 3 },
    { cardId: "U-004", qty: 3 },
    { cardId: "U-005", qty: 3 },
    { cardId: "S-001", qty: 3 },
    { cardId: "S-002", qty: 3 },
    { cardId: "S-003", qty: 3 },
    { cardId: "S-004", qty: 3 },
    { cardId: "I-001", qty: 3 },
    { cardId: "I-002", qty: 3 },
    { cardId: "I-003", qty: 3 },
    { cardId: "I-004", qty: 3 },
  ],
};

// 39 cartes (retire 1 copie)
export const DECK_39: Deck = {
  entries: VALID_DECK.entries.map((e) => (e.cardId === "I-004" ? { ...e, qty: 2 } : e)),
};

// 41 cartes (ajoute 1 copie)
export const DECK_41: Deck = {
  entries: VALID_DECK.entries.map((e) => (e.cardId === "I-004" ? { ...e, qty: 4 } : e)),
};

// Une carte à 4 copies (MAX_COPIES)
export const DECK_WITH_4_COPIES: Deck = {
  entries: VALID_DECK.entries.map((e) => (e.cardId === "U-003" ? { ...e, qty: 4 } : e)),
};

// Carte unique à 2 copies (UNIQUE_VIOLATION)
export const DECK_WITH_UNIQUE_X2: Deck = {
  entries: [
    ...VALID_DECK.entries.filter((e) => e.cardId !== "I-004"),
    { cardId: "I-004", qty: 1 },
    { cardId: "UQ-001", qty: 2 },
  ],
};

// 0 leader (LEADER_COUNT)
export const DECK_WITHOUT_LEADER: Deck = {
  entries: VALID_DECK.entries.filter((e) => e.cardId !== "L-001"),
};

// 2 leaders (LEADER_COUNT) — ici on duplique le leader en qty 2 (ça doit aussi être invalide)
export const DECK_WITH_2_LEADERS: Deck = {
  entries: VALID_DECK.entries.map((e) => (e.cardId === "L-001" ? { ...e, qty: 2 } : e)),
};

// Set interdit (SET_FORBIDDEN)
export const DECK_WITH_FORBIDDEN_SET: Deck = {
  entries: [
    ...VALID_DECK.entries.filter((e) => e.cardId !== "I-004"),
    { cardId: "I-004", qty: 2 }, // on libère 1 slot
    { cardId: "X-001", qty: 1 }, // carte hors set
  ],
};

// Carte inconnue (UNKNOWN_CARD)
export const DECK_WITH_UNKNOWN_CARD: Deck = {
  entries: [
    ...VALID_DECK.entries.filter((e) => e.cardId !== "I-004"),
    { cardId: "I-004", qty: 2 },
    { cardId: "??-404", qty: 1 },
  ],
};

// qty invalides (INVALID_QTY)
export const DECK_WITH_QTY_ZERO: Deck = {
  entries: [...VALID_DECK.entries.slice(0, -1), { cardId: "I-004", qty: 0 }],
};
export const DECK_WITH_QTY_NEGATIVE: Deck = {
  entries: [...VALID_DECK.entries.slice(0, -1), { cardId: "I-004", qty: -2 }],
};

/**
 * Duplicats d'entrée (même cardId présent deux fois) => doit être refusé (DUPLICATE_ENTRY)
 * On split U-001 en deux lignes 2 + 1.
 */
export const DECK_WITH_DUPLICATE_ENTRIES: Deck = {
  entries: [
    { cardId: "L-001", qty: 1 },
    { cardId: "U-001", qty: 2 },
    { cardId: "U-001", qty: 1 }, // duplicat
    ...VALID_DECK.entries.filter((e) => e.cardId !== "L-001" && e.cardId !== "U-001"),
  ],
};
