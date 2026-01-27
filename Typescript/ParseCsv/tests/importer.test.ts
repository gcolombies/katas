import { describe, expect, test } from "vitest";
import { importCardsFromCsv } from "../src/importer.js";
import type { CsvErrorCode } from "../src/domain.js";
import {
  CSV_VALID,
  CSV_BAD_SET,
  CSV_MISSING_COLUMN,
  CSV_UNKNOWN_COLUMN,
  CSV_BAD_COST,
  CSV_BAD_UNIQUE,
  CSV_QUOTED_COMMA,
} from "./data.js";

function codes(res: { ok: boolean; errors?: { code: CsvErrorCode }[] }): CsvErrorCode[] {
  if (res.ok) return [];
  return res.errors!.map((e) => e.code);
}

function findError(
  res: { ok: boolean; errors?: { code: CsvErrorCode; line: number; column: string }[] },
  code: CsvErrorCode,
) {
  if (res.ok) throw new Error("Expected errors, got ok");
  return res.errors!.find((e) => e.code === code);
}

describe("CSV Importer (Zod) — kata", () => {
  test("CSV_VALID -> ok true, 4 cards", () => {
    const res = importCardsFromCsv(CSV_VALID, { strictHeader: true, trim: true });

    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.value).toHaveLength(4);
    expect(res.value[0].id).toBe("L-001");
  });

  test("CSV_QUOTED_COMMA -> parse ok and keep comma in name", () => {
    const res = importCardsFromCsv(CSV_QUOTED_COMMA, { strictHeader: true, trim: true });

    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.value[0].name).toBe("Name, With Comma");
  });

  test("CSV_MISSING_COLUMN -> CSV_HEADER_MISSING_COLUMN (column=unique)", () => {
    const res = importCardsFromCsv(CSV_MISSING_COLUMN, { strictHeader: true, trim: true });

    expect(res.ok).toBe(false);
    expect(codes(res)).toContain("CSV_HEADER_MISSING_COLUMN");

    const err = findError(res, "CSV_HEADER_MISSING_COLUMN");
    expect(err?.column).toBe("unique");
    expect(err?.line).toBe(1);
  });

  test("CSV_UNKNOWN_COLUMN with strictHeader -> CSV_HEADER_UNKNOWN_COLUMN (column=rarity)", () => {
    const res = importCardsFromCsv(CSV_UNKNOWN_COLUMN, { strictHeader: true, trim: true });

    expect(res.ok).toBe(false);
    expect(codes(res)).toContain("CSV_HEADER_UNKNOWN_COLUMN");

    const err = findError(res, "CSV_HEADER_UNKNOWN_COLUMN");
    expect(err?.column).toBe("rarity");
    expect(err?.line).toBe(1);
  });

  test("CSV_BAD_SET -> ZOD on line 3 column setCode", () => {
    const res = importCardsFromCsv(CSV_BAD_SET, { strictHeader: true, trim: true });

    expect(res.ok).toBe(false);
    expect(codes(res)).toContain("ZOD");

    const z = findError(res, "ZOD");
    expect(z?.line).toBe(3);
    expect(z?.column).toBe("setCode");
  });

  test("CSV_BAD_COST -> COERCE on line 2 column cost", () => {
    const res = importCardsFromCsv(CSV_BAD_COST, { strictHeader: true, trim: true });

    expect(res.ok).toBe(false);
    expect(codes(res)).toContain("COERCE");

    const e = findError(res, "COERCE");
    expect(e?.line).toBe(2);
    expect(e?.column).toBe("cost");
  });

  test("CSV_BAD_UNIQUE -> COERCE on line 2 column unique", () => {
    const res = importCardsFromCsv(CSV_BAD_UNIQUE, { strictHeader: true, trim: true });

    expect(res.ok).toBe(false);
    expect(codes(res)).toContain("COERCE");

    const e = findError(res, "COERCE");
    expect(e?.line).toBe(2);
    expect(e?.column).toBe("unique");
  });
});
