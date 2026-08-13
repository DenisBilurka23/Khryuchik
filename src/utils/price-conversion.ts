export const convertFromUsd = (amountUsd: number, rate: number) =>
  Math.ceil(amountUsd * rate);
