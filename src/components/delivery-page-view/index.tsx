import { Box } from "@mui/material";
import { getTranslations } from "next-intl/server";

import type { DeliveryPageLabels } from "@/i18n/types";
import { getCountryDisplayName, getLocalizedPath } from "@/utils";

import storefrontStyles from "../storefront/storefront.module.css";
import { DeliveryCtaSection } from "./sections/delivery-cta-section";
import { DeliveryFaqSection } from "./sections/delivery-faq-section";
import { DeliveryHeroSection } from "./sections/delivery-hero-section";
import { DeliveryMethodsSection } from "./sections/delivery-methods-section";
import { DeliveryPaymentSection } from "./sections/delivery-payment-section";
import { DeliveryReturnsSection } from "./sections/delivery-returns-section";
import { DeliveryStepsSection } from "./sections/delivery-steps-section";
import { getDeliveryPaymentVariant } from "./region-config";
import type { DeliveryPageViewProps } from "./types";

export const DeliveryPageView = async ({
  locale,
  country,
}: DeliveryPageViewProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.deliveryPage",
  });
  const hero = t.raw("hero") as DeliveryPageLabels["hero"];
  const payment = t.raw("payment") as DeliveryPageLabels["payment"];
  const methods = t.raw("methods") as DeliveryPageLabels["methods"];
  const steps = t.raw("steps") as DeliveryPageLabels["steps"];
  const faq = t.raw("faq") as DeliveryPageLabels["faq"];
  const returns = t.raw("returns") as DeliveryPageLabels["returns"];
  const finalCta = t.raw("finalCta") as DeliveryPageLabels["finalCta"];

  const paymentVariant = getDeliveryPaymentVariant(country);
  const shopHref = getLocalizedPath(locale, "/shop");
  const methodsTitlePrefix = t("methods.titlePrefix", {
    country: getCountryDisplayName(locale, country),
  });

  return (
    <Box className={storefrontStyles.pageShell}>
      <Box className={storefrontStyles.pageContent}>
        <DeliveryHeroSection {...hero} locale={locale} country={country} />
        <DeliveryPaymentSection {...payment} paymentVariant={paymentVariant} />
        <DeliveryMethodsSection {...methods} titlePrefix={methodsTitlePrefix} />
        <DeliveryStepsSection {...steps} />
        <DeliveryFaqSection {...faq} />
        <DeliveryReturnsSection {...returns} />
        <DeliveryCtaSection {...finalCta} shopHref={shopHref} />
      </Box>
    </Box>
  );
};

export type { DeliveryPageViewProps } from "./types";
