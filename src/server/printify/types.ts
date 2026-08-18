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

export type PrintifyLineItem = {
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
  line_items: PrintifyLineItem[];
  address_to: PrintifyShippingAddress;
};

export type PrintifyOrderRequest = {
  external_id: string;
  label?: string;
  line_items: PrintifyLineItem[];
  shipping_method: number;
  send_shipping_notification: boolean;
  address_to: PrintifyShippingAddress;
};

export type PrintifyOrderCreatedResponse = {
  id: string;
};

export type PrintifyShipment = {
  carrier?: string;
  number?: string;
  url?: string;
  delivered_at?: string;
};

export type PrintifyOrderResponse = {
  id: string;
  status: string;
  metadata?: {
    shop_order_id?: string | number;
    shop_order_label?: string;
    shop_fulfilled_at?: string;
  };
  shipments?: PrintifyShipment[];
};

export type PrintifyWebhookEvent = {
  id?: string;
  type: string;
  created_at?: string;
  resource: {
    id: string;
    type: string;
  };
};

export type PrintifyWebhook = {
  id: string;
  topic: string;
  url: string;
  shop_id?: number | string;
};

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
