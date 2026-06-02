import { CheckoutResultView } from "@/components/checkout-result-view";
import { defaultLocale } from "@/i18n/config";

const CheckoutCancelPage = () => (
  <CheckoutResultView locale={defaultLocale} kind="cancel" />
);

export default CheckoutCancelPage;
