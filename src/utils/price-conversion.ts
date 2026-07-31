// Prices derived from Printify are converted from USD at the region's rate and
// rounded up to a whole unit: an exact 62.37 BYN reads like a conversion
// artefact rather than a price, and rounding up never lands below what the
// print provider charges.
export const convertFromUsd = (amountUsd: number, rate: number) =>
  Math.ceil(amountUsd * rate);
