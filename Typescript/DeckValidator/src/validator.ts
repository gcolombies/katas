import type { Card, Deck, ValidationError, ValidationResult } from "./domain.js";

/**
 * Catalogue: injecté pour rendre le validateur pur/testable.
 * Map<cardId, Card>
 */
export type Catalog = ReadonlyMap<string, Card>;

/**
 * Optionnel: tu peux ajouter des options de format / normalisation.
 */
export interface ValidateDeckOptions {
  /**
   * Si true: fusionne les entrées dupliquées (même cardId présent plusieurs fois).
   * Si false/undefined: refuse et remonte une erreur DUPLICATE_ENTRY.
   */
  mergeDuplicates?: boolean;
}

/**
 * TODO: Implémente la logique.
 * Contraintes:
 * - Pur (pas d'IO)
 * - Retourne toutes les erreurs trouvées (pas fail-fast)
 * - Déterministe
 */
export function validateDeck(
  _deck: Deck,
  _catalog: Catalog,
  _options: ValidateDeckOptions = {},
): ValidationResult {
  const errors: ValidationError[] = [];

  const entries = _deck.entries;
  const cardByEntry = entries.map((e) => ({ entry: e, card: _catalog.get(e.cardId) }));

  // 1 Détection des duplicates entry
  const seenCardIds = new Set<string>();
  const duplicate = new Set<string>();
  for (const { cardId } of entries) {
    if (seenCardIds.has(cardId) && !duplicate.has(cardId)) {
      duplicate.add(cardId);
      errors.push({
        code: "DUPLICATE_ENTRY",
        message: `Carte ${cardId} présente plusieurs fois.`,
        meta: { cardId: cardId },
      });
    }
    seenCardIds.add(cardId);
  }

  // 2 Validation des quantités de chaque carte
  for (const { cardId, qty } of entries) {
    if (qty <= 0) {
      errors.push({
        code: "INVALID_QTY",
        message: "Quantité invalide (doit être >= 1).",
        meta: { cardId: cardId, qty: qty },
      });
    }
  }

  // 3 Détection des Unknown cards
  for (const { entry, card } of cardByEntry) {
    if (card === undefined) {
      errors.push({
        code: "UNKNOWN_CARD",
        message: "Carte inconnue",
        meta: { cardId: entry.cardId },
      });
    }
  }

  // 4 Detection des sets interdits
  for (const { entry, card } of cardByEntry) {
    if (card !== undefined) {
      if (card.setCode !== "OGN") {
        errors.push({
          code: "SET_FORBIDDEN",
          message: "Carte provenant d'un SET non authorisé",
          meta: { cardId: entry.cardId },
        });
      }
    }
  }

  // 5 Gérer le nombre max de copies d'une carte par deck
  for (const { cardId, qty } of entries) {
    if (qty > 3) {
      errors.push({
        code: "MAX_COPIES",
        message: "Nombre maximum de copies de cette carte dépassé",
        meta: { cardId: cardId, qty: qty },
      });
    }
  }

  // 6 Attention aux nombre de carte unique
  for (const { entry, card } of cardByEntry) {
    if (card !== undefined) {
      if (card.unique === true && entry.qty > 1) {
        errors.push({
          code: "UNIQUE_VIOLATION",
          message: "Carte unique autorisée en un seul exemplaire",
          meta: { cardId: entry.cardId, unique: card.unique, qty: entry.qty },
        });
      }
    }
  }

  // 7 Vérification du nombre de leaders
  const leaderCount = cardByEntry
    .filter(({ card }) => card !== undefined && card.type === "LEADER")
    .map(({ entry }) => entry.qty)
    .reduce((acc, qty) => acc + qty, 0);

  if (leaderCount !== 1) {
    errors.push({
      code: "LEADER_COUNT",
      message: "Carte leader autorisée en un seul exemplaire",
      meta: { expected: 1, actual: leaderCount },
    });
  }

  // 8 Vérification de la taille du deck
  const totalCards = entries.reduce((acc, entry) => acc + entry.qty, 0);
  if (totalCards !== 40) {
    errors.push({
      code: "DECK_SIZE",
      message: "Taille de deck invalide (doit être de 40 cartes).",
      meta: { expected: 40, actual: totalCards },
    });
  }
  return {
    ok: errors.length === 0,
    errors,
  };
}
