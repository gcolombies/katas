import { describe, expect, test } from "vitest";
import { validateDeck } from "../src/validator.js";
import type { ValidationErrorCode } from "../src/domain.js";
import {
  CATALOG,
  VALID_DECK,
  DECK_39,
  DECK_41,
  DECK_WITH_4_COPIES,
  DECK_WITH_DUPLICATE_ENTRIES,
  DECK_WITH_UNKNOWN_CARD,
  DECK_WITH_FORBIDDEN_SET,
  DECK_WITHOUT_LEADER,
  DECK_WITH_2_LEADERS,
  DECK_WITH_UNIQUE_X2,
  DECK_WITH_QTY_ZERO,
  DECK_WITH_QTY_NEGATIVE,
} from "./data.js";

function codes(result: { errors: { code: ValidationErrorCode }[] }): ValidationErrorCode[] {
  return result.errors.map((e) => e.code);
}

function expectHasCode(allCodes: ValidationErrorCode[], code: ValidationErrorCode) {
  expect(allCodes).toContain(code);
}

function expectNotHasCode(allCodes: ValidationErrorCode[], code: ValidationErrorCode) {
  expect(allCodes).not.toContain(code);
}

describe("validateDeck (kata) — duplicats refusés", () => {
  test("deck valide -> ok true, pas d'erreurs", () => {
    const result = validateDeck(VALID_DECK, CATALOG);

    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("39 cartes -> DECK_SIZE", () => {
    const result = validateDeck(DECK_39, CATALOG);

    expect(result.ok).toBe(false);
    expectHasCode(codes(result), "DECK_SIZE");
  });

  test("41 cartes -> DECK_SIZE", () => {
    const result = validateDeck(DECK_41, CATALOG);

    expect(result.ok).toBe(false);
    expectHasCode(codes(result), "DECK_SIZE");
  });

  test("une carte à 4 copies -> MAX_COPIES", () => {
    const result = validateDeck(DECK_WITH_4_COPIES, CATALOG);

    expect(result.ok).toBe(false);
    expectHasCode(codes(result), "MAX_COPIES");
  });

  test("carte inconnue -> UNKNOWN_CARD", () => {
    const result = validateDeck(DECK_WITH_UNKNOWN_CARD, CATALOG);

    expect(result.ok).toBe(false);
    expectHasCode(codes(result), "UNKNOWN_CARD");
  });

  test("set interdit -> SET_FORBIDDEN", () => {
    const result = validateDeck(DECK_WITH_FORBIDDEN_SET, CATALOG);

    expect(result.ok).toBe(false);
    expectHasCode(codes(result), "SET_FORBIDDEN");
  });

  test("0 leader -> LEADER_COUNT", () => {
    const result = validateDeck(DECK_WITHOUT_LEADER, CATALOG);

    expect(result.ok).toBe(false);
    expectHasCode(codes(result), "LEADER_COUNT");
  });

  test("2 leaders -> LEADER_COUNT (même si la taille peut aussi être invalide selon ton design)", () => {
    const result = validateDeck(DECK_WITH_2_LEADERS, CATALOG);

    expect(result.ok).toBe(false);
    expectHasCode(codes(result), "LEADER_COUNT");
  });

  test("unique à 2 copies -> UNIQUE_VIOLATION", () => {
    const result = validateDeck(DECK_WITH_UNIQUE_X2, CATALOG);

    expect(result.ok).toBe(false);
    expectHasCode(codes(result), "UNIQUE_VIOLATION");
  });

  test("qty = 0 -> INVALID_QTY", () => {
    const result = validateDeck(DECK_WITH_QTY_ZERO, CATALOG);

    expect(result.ok).toBe(false);
    expectHasCode(codes(result), "INVALID_QTY");
  });

  test("qty négatif -> INVALID_QTY", () => {
    const result = validateDeck(DECK_WITH_QTY_NEGATIVE, CATALOG);

    expect(result.ok).toBe(false);
    expectHasCode(codes(result), "INVALID_QTY");
  });

  test("duplicats d'entrée -> DUPLICATE_ENTRY", () => {
    const result = validateDeck(DECK_WITH_DUPLICATE_ENTRIES, CATALOG);

    expect(result.ok).toBe(false);
    expectHasCode(codes(result), "DUPLICATE_ENTRY");
  });

  test("un deck valide ne doit pas contenir ces codes", () => {
    const result = validateDeck(VALID_DECK, CATALOG);

    expect(result.ok).toBe(true);
    const c = codes(result);
    expectNotHasCode(c, "DECK_SIZE");
    expectNotHasCode(c, "MAX_COPIES");
    expectNotHasCode(c, "UNKNOWN_CARD");
    expectNotHasCode(c, "SET_FORBIDDEN");
    expectNotHasCode(c, "LEADER_COUNT");
    expectNotHasCode(c, "UNIQUE_VIOLATION");
    expectNotHasCode(c, "INVALID_QTY");
    expectNotHasCode(c, "DUPLICATE_ENTRY");
  });
});
