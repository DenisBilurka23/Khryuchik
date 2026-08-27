export type EasyshipCourierService = {
  id?: string;
  name?: string;
  umbrella_name?: string;
};

export type EasyshipRate = {
  courier_service?: EasyshipCourierService;
  total_charge?: number | string;
  currency?: string;
  min_delivery_time?: number | null;
  max_delivery_time?: number | null;
};

export type EasyshipRatesResponse = {
  rates?: EasyshipRate[];
};

export type EasyshipTracking = {
  tracking_number?: string | null;
  handler?: string | null;
  tracking_page_url?: string | null;
  tracking_url?: string | null;
};

export type EasyshipShippingDocument = {
  category?: string | null;
  format?: string | null;
  url?: string | null;
};

export type EasyshipShipment = {
  easyship_shipment_id?: string;
  trackings?: EasyshipTracking[];
  shipping_documents?: EasyshipShippingDocument[];
  total_charge?: number | string | null;
  currency?: string | null;
};

export type EasyshipShipmentResponse = {
  shipment?: EasyshipShipment;
} & EasyshipShipment;

export type EasyshipErrorBody = {
  error?: {
    code?: string;
    message?: string;
    details?: string[];
    request_id?: string;
    type?: string;
  };
};
