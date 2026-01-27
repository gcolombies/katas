import { table } from "console";
import type { CsvError, ParseCsvOptions, Result } from "./domain.js";

export interface ParsedCsv {
  header: string[];
  rows: string[][];
  rowLineNumbers: number[];
}

/**
 * TODO: Parser minimal CSV.
 * MVP constraints for kata:
 * - delimiter: comma
 * - supports quoted fields with double quotes ("...")
 * - supports commas inside quoted fields
 * - no multiline fields
 *
 * Return errors with:
 * - code: CSV_EMPTY / CSV_HEADER_MISSING / CSV_PARSE / CSV_BAD_COLUMN_COUNT
 */
export function parseCsv(_input: string, _options: ParseCsvOptions = {}): Result<ParsedCsv> {
  const err: CsvError = {
    line: 1,
    column: "__row__",
    code: "CSV_PARSE",
    message: "TODO: implement parseCsv",
  };
  return { ok: false, errors: [err] };
}
