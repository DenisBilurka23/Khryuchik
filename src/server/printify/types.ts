// Shapes returned by the Printify REST API (https://developers.printify.com).
// Field names stay snake_case on purpose so responses can be typed as-is
// without an extra mapping layer; the mapping into our own catalog documents
// happens in the printify services.

export type PrintifyShop = {
  id: number;
  title: string;
  sales_channel: string;
};

export type PrintifyProductOptionValue = {
  id: number;
  title: string;
};

export type PrintifyProductOption = {
  name: string;
  type: string;
  values: PrintifyProductOptionValue[];
};

export type PrintifyProductVariant = {
  id: number;
  sku: string;
  title: string;
  /** Production cost charged by the print provider, in cents. */
  cost: number;
  /** Retail price configured inside Printify, in cents. */
  price: number;
  is_enabled: boolean;
  is_available: boolean;
  /** Ids of the option values this variant is built from. */
  options: number[];
};

export type PrintifyProductImage = {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
};

/** Link back to the product page on the merchant's own storefront. */
export type PrintifyExternalLink = {
  id?: string;
  handle?: string;
};

export type PrintifyProduct = {
  id: string;
  title: string;
  description: string;
  visible: boolean;
  is_locked: boolean;
  blueprint_id: number;
  print_provider_id: number;
  options: PrintifyProductOption[];
  variants: PrintifyProductVariant[];
  images: PrintifyProductImage[];
  external?: PrintifyExternalLink;
};

export type PrintifyPaginatedResponse<TItem> = {
  current_page: number;
  last_page: number;
  total: number;
  data: TItem[];
};

/** Flags telling Printify which fields the storefront picked up on publish. */
export type PrintifyPublishScope = {
  title: boolean;
  description: boolean;
  images: boolean;
  variants: boolean;
  tags: boolean;
  keyFeatures: boolean;
  shipping_template: boolean;
};
