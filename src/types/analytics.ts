import type { CurrencyCode } from "@/utils";

export type AnalyticsConsentStatus = "granted" | "denied";

export type AnalyticsConsentSnapshot = {
  ready: boolean;
  status: AnalyticsConsentStatus | null;
  settingsOpen: boolean;
};

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price: number;
  quantity: number;
};

export type AnalyticsCommerce = {
  currency: CurrencyCode;
  value: number;
  items: AnalyticsItem[];
};

export type AnalyticsPurchase = AnalyticsCommerce & {
  transaction_id: string;
  shipping: number;
  coupon?: string;
};

export type AnalyticsEvent =
  | { name: "view_item"; params: AnalyticsCommerce }
  | { name: "add_to_cart"; params: AnalyticsCommerce }
  | { name: "begin_checkout"; params: AnalyticsCommerce }
  | { name: "purchase"; params: AnalyticsPurchase };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}
