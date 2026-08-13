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
  cost: number;
  price: number;
  is_enabled: boolean;
  is_available: boolean;
  options: number[];
};

export type PrintifyProductImage = {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
};

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

export type PrintifyShippingLineItem = {
  product_id: string;
  variant_id: number;
  quantity: number;
};

export type PrintifyShippingAddress = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
};

export type PrintifyShippingRequest = {
  line_items: PrintifyShippingLineItem[];
  address_to: PrintifyShippingAddress;
};

// Costs in cents, quoted in the shop's currency (USD for this shop — the API
// states no currency of its own). Only the methods the print providers offer
// for the destination come back, so every field is optional.
export type PrintifyShippingResponse = {
  standard?: number;
  express?: number;
  priority?: number;
  printify_express?: number;
  economy?: number;
};

export type PrintifyPublishScope = {
  title: boolean;
  description: boolean;
  images: boolean;
  variants: boolean;
  tags: boolean;
  keyFeatures: boolean;
  shipping_template: boolean;
};
