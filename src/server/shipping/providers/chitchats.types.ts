export type ChitChatsRate = {
  postage_type: string;
  postage_description?: string | null;
  delivery_time_description?: string | null;
  tracking_type_description?: string | null;
  purchase_amount?: string | null;
  payment_amount?: string | null;
};

export type ChitChatsShipment = {
  id: string;
  status?: string | null;
  order_id?: string | null;
  order_store?: string | null;
  created_at?: string | null;
  rates?: ChitChatsRate[] | null;
  postage_type?: string | null;
  purchase_amount?: string | null;
  carrier_tracking_code?: string | null;
  delivered_at?: string | null;
  carrier?: string | null;
  tracking_url?: string | null;
  postage_label_pdf_url?: string | null;
};
