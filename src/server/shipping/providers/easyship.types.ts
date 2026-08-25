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

export type EasyshipErrorBody = {
  error?: {
    code?: string;
    message?: string;
    type?: string;
  };
};
