import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { format } from "prettier";

import type { JetprintBlank, JetprintBlankCatalog } from "@/types/catalog";

import { type RawJetprintBlank, toJetprintBlank } from "./jetprint-blank-parse";

const CATALOG_PATH = resolve("src/data/jetprint-blanks.json");

export const readJetprintBlankResponse = (path: string): RawJetprintBlank => {
  const parsed = JSON.parse(readFileSync(resolve(path), "utf8"));

  return parsed.data ?? parsed;
};

const withoutImportDate = (blank: JetprintBlank) =>
  JSON.stringify({ ...blank, importedAt: undefined });

export const saveJetprintBlank = async (raw: RawJetprintBlank) => {
  const blank = toJetprintBlank(raw, new Date().toISOString().slice(0, 10));
  const catalog: JetprintBlankCatalog = existsSync(CATALOG_PATH)
    ? JSON.parse(readFileSync(CATALOG_PATH, "utf8"))
    : {};
  const current = catalog[String(raw.id)];

  if (current && withoutImportDate(current) === withoutImportDate(blank)) {
    return { blank: current, isChanged: false };
  }

  catalog[String(raw.id)] = blank;

  writeFileSync(
    CATALOG_PATH,
    await format(JSON.stringify(catalog), { filepath: CATALOG_PATH }),
  );

  return { blank, isChanged: true };
};
