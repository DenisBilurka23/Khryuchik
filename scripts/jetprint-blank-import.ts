import {
  readJetprintBlankResponse,
  saveJetprintBlank,
} from "./jetprint-blank-catalog-file";

const main = async () => {
  const [inputPath] = process.argv.slice(2);

  if (!inputPath) {
    throw new Error(
      "Usage: npm run jetprint:blank -- <saved blankProduct/detail response.json>",
    );
  }

  const raw = readJetprintBlankResponse(inputPath);
  const { blank, isChanged } = await saveJetprintBlank(raw);

  console.log(
    `${isChanged ? "Imported" : "Unchanged"} blank ${raw.id} (${blank.name}): ${blank.variants.length} variant(s), ${blank.standardShipping.length} shipping group(s)`,
  );
};

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
