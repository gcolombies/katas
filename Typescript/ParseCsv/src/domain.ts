export type CsvErrorCode =
  | "CSV_EMPTY"
  | "CSV_HEADER_MISSING"
  | "CSV_HEADER_UNKNOWN_COLUMN"
  | "CSV_HEADER_MISSING_COLUMN"
  | "CSV_BAD_ROW"
  | "CSV_BAD_COLUMN_COUNT"
  | "CSV_PARSE"
  | "COERCE"
  | "ZOD";

export interface CsvError {
  /** 1-based line number in the original CSV input */
  line: number;
  /** column name if known, otherwise something like "__row__" */
  column: string;
  code: CsvErrorCode;
  message: string;
  meta?: Record<string, unknown>;
}

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; errors: CsvError[] };

export interface ParseCsvOptions {
  /** If true, unknown columns in header produce errors. */
  strictHeader?: boolean;
  /** If true, trims whitespace around unquoted fields. */
  trim?: boolean;
}
