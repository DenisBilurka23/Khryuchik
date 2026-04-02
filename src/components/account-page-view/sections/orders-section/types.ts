import type { AccountOrderMock } from "@/data/account-page-mock";
import type { AccountPageDictionary } from "@/i18n/types";

export type OrdersSectionProps = {
  dictionary: AccountPageDictionary;
  orders: AccountOrderMock[];
};