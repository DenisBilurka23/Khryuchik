import "server-only";

const ENABLED_VALUES = new Set(["1", "true"]);

export const isShopClosed = (): boolean =>
  ENABLED_VALUES.has((process.env.SHOP_MAINTENANCE ?? "").trim().toLowerCase());
