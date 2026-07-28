export type AccountDownload = {
  productId: string;
  productTitle: string;
  assetId: string;
  label: string;
  format: string;
  locale: string;
  sizeBytes?: number;
  downloadUrl: string;
};

export type ProductPurchaseContext = {
  ownedLanguages: string[];
  hasPurchased: boolean;
};
