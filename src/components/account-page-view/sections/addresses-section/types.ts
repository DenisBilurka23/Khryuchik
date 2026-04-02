import type { AccountAddressMock } from "@/data/account-page-mock";
import type { AccountPageDictionary } from "@/i18n/types";

export type AddressesSectionProps = {
  dictionary: AccountPageDictionary;
  addresses: AccountAddressMock[];
};