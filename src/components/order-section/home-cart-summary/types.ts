import type { CountryCode } from "@/utils";

export type HomeCartSummaryProps = {
  locale: "ru" | "en";
  country: CountryCode;
  shopHref: string;
  cartHref: string;
};