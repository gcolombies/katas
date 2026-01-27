# TS Kata — CSV Importer + Zod (squelette)

Objectif: parser un CSV de cartes (Riftbound-like), convertir les types, valider avec Zod, et remonter des erreurs ligne/colonne.

## Installation
```bash
npm install
```

## Tests
```bash
npm test
```

## Architecture (guideline)
1. Parse CSV -> lignes (header + rows)
2. Map row -> objet raw (string)
3. Coerce -> objet typé (number/boolean)
4. Validate Zod -> issues
5. Adapter issues -> CsvError { line, column, code, message }

⚠️ Aucun code “solution” n’est fourni. Les TODO sont ton terrain de kata.
