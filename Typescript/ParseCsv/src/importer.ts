import type { CsvError, ParseCsvOptions, Result } from "./domain.js";
import type { Card } from "./schema.js";
import { CardSchema, CARD_COLUMNS } from "./schema.js";
import { parseCsv } from "./csv.js";

export type RawCardRow = Record<string, string>;

/**
 * TODO: Convert raw row -> typed Card (numbers/booleans), then validate with Zod.
 * - cost: number
 * - unique: boolean (accept: true/false/1/0/yes/no ?) -> choose and document in code
 * - map Zod issues -> CsvError { line, column, code: "ZOD", message }
 */
export function importCardsFromCsv(
  _input: string,
  _options: ParseCsvOptions = { strictHeader: true, trim: true },
): Result<Card[]> {
  const parsed = parseCsv(_input, _options);
  if (!parsed.ok) return parsed;

  const errors: CsvError[] = [];
  const cards: Card[] = [];

  const header = parsed.value.header;

  // TODO: enforce required columns (CARD_COLUMNS)
  // TODO: strictHeader => unknown columns should be errors

  for (let i = 0; i < parsed.value.rows.length; i++) {
    const row = parsed.value.rows[i];
    const line = parsed.value.rowLineNumbers[i];

    // TODO: build raw object from header+row
    // TODO: coerce raw -> typed (cost, unique)
    // TODO: CardSchema.safeParse(typed)
    // TODO: push errors with correct line+column
    void row;
    void line;
    void header;
    void CARD_COLUMNS;
    void CardSchema;
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: cards };
}

/**
 * Helper you may want:
 * translate Zod issues to CsvError while preserving line and column from issue.path[0].
 */
export function zodIssuesToCsvErrors(_line: number, _issues: unknown[]): CsvError[] {
  // TODO
  return [];
}
