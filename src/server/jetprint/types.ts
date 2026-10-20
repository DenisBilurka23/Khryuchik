export type JetprintFilePayload = {
  name?: string;
  url: string;
};

export type JetprintAddress = {
  address1: string;
  address2?: string;
  city: string;
  zip: string;
  country: string;
  region?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
};

export type JetprintShipping = {
  logisticsType: number;
  deliveryType: number;
  remark?: string;
};

export type JetprintLineItemRequest = {
  customerItemNo: string;
  quantity: number;
  sku: string;
  previewFiles: JetprintFilePayload[];
  printFiles: JetprintFilePayload[];
};

export type JetprintOrderRequest = {
  customerOrderNo: string;
  isUrgent: boolean;
  remark?: string;
  addressTo: JetprintAddress;
  shipping: JetprintShipping;
  lineItems: JetprintLineItemRequest[];
};

export type JetprintWaybill = {
  carrier?: string;
  trackingUrl?: string;
  trackingNumber?: string;
  affectedItems?: string[];
  waybillStatus?: number;
};

export type JetprintLineItem = {
  itemStatus: number;
  customerItemNo: string;
  itemNo: string;
  quantity: number;
  sku?: string;
};

export type JetprintOrder = {
  orderNo: string;
  customerOrderNo: string;
  orderStatus: number;
  lineItems?: JetprintLineItem[];
  waybills?: JetprintWaybill[];
};

export type JetprintOrderEnvelope = {
  order: JetprintOrder;
};

export type JetprintOrderLookup =
  | { customerOrderNo: string }
  | { orderNo: string };

export type JetprintVariantStatusResponse = {
  status: number;
};
