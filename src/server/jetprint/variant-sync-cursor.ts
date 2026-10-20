export type JetprintVariantSyncCursor = {
  productId: string;
  sku: string;
};

export const encodeJetprintVariantCursor = (
  cursor: JetprintVariantSyncCursor,
) => Buffer.from(JSON.stringify(cursor)).toString("base64url");

export const decodeJetprintVariantCursor = (
  cursor: string | undefined,
): JetprintVariantSyncCursor | undefined => {
  if (!cursor) return undefined;

  try {
    const value: unknown = JSON.parse(
      Buffer.from(cursor, "base64url").toString("utf8"),
    );

    if (!value || typeof value !== "object") return undefined;

    const { productId, sku } = value as Record<string, unknown>;

    return typeof productId === "string" &&
      productId &&
      typeof sku === "string" &&
      sku
      ? { productId, sku }
      : undefined;
  } catch {
    return undefined;
  }
};
