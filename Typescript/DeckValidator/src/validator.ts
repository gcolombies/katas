import type { Card, Deck, ValidationResult } from "./domain.js";

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
  return {
    ok: false,
    errors: [
      {
        code: "DECK_SIZE",
        message: "TODO: implémenter validateDeck",
      },
    ],
  };
}
