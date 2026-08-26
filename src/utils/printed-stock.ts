import type { ProductPrintedStock } from "@/types/catalog";

export const toPrintedLanguages = (stock?: ProductPrintedStock): string[] =>
  Object.entries(stock ?? {})
    .filter(([, hubs]) => (hubs?.length ?? 0) > 0)
    .map(([language]) => language);

export const isPrintedOffered = (
  printedLanguages: string[] | undefined,
  language: string | undefined,
) => {
  if (!printedLanguages || printedLanguages.length === 0) {
    return true;
  }

  return !language || printedLanguages.includes(language);
};
