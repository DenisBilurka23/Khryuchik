import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { format } from "prettier";

import type { JetprintBlankCatalog } from "@/types/catalog";

import { type RawJetprintBlank, toJetprintBlank } from "./jetprint-blank-parse";

const CATALOG_PATH = resolve("src/data/jetprint-blanks.json");

const main = async () => {
  const [inputPath] = process.argv.slice(2);

  if (!inputPath) {
    throw new Error(
      "Usage: npm run jetprint:blank -- <saved blankProduct/detail response.json>",
    );
  }

  const parsed = JSON.parse(readFileSync(resolve(inputPath), "utf8"));
  const raw: RawJetprintBlank = parsed.data ?? parsed;
  const blank = toJetprintBlank(raw, new Date().toISOString().slice(0, 10));

  const catalog: JetprintBlankCatalog = existsSync(CATALOG_PATH)
    ? JSON.parse(readFileSync(CATALOG_PATH, "utf8"))
    : {};

  catalog[String(raw.id)] = blank;

  writeFileSync(
    CATALOG_PATH,
    await format(JSON.stringify(catalog), { filepath: CATALOG_PATH }),
  );

  console.log(
    `Imported blank ${raw.id} (${blank.name}): ${blank.variants.length} variant(s), ${blank.standardShipping.length} shipping group(s)`,
  );
};

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
