import { getTranslations } from "next-intl/server";

import type { DeliveryPageLabels } from "@/i18n/types";
import { getCountryDisplayName, getLocalizedPath } from "@/utils";

import { PageShell } from "@/components/page-shell";
import {
  DeliveryCtaSection,
  DeliveryFaqSection,
  DeliveryHeroSection,
  DeliveryMethodsSection,
  DeliveryPaymentSection,
  DeliveryReturnsSection,
  DeliveryStepsSection,
} from "./sections";
import { getDeliveryPaymentVariant } from "./utils";
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
    <PageShell>
      <DeliveryHeroSection {...hero} locale={locale} country={country} />
      <DeliveryPaymentSection {...payment} paymentVariant={paymentVariant} />
      <DeliveryMethodsSection {...methods} titlePrefix={methodsTitlePrefix} />
      <DeliveryStepsSection {...steps} />
      <DeliveryFaqSection {...faq} />
      <DeliveryReturnsSection {...returns} />
      <DeliveryCtaSection {...finalCta} shopHref={shopHref} />
    </PageShell>
  );
};

export type { DeliveryPageViewProps } from "./types";
